const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../models/Subscription');
const User = require('../models/User');

// @desc    Get user subscription details
// @route   GET /api/subscriptions
// @access  Private
const getSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOne({ user: req.user._id });
  
  if (!subscription) {
    res.status(404);
    throw new Error('Subscription not found');
  }
  
  res.json(subscription);
});

// @desc    Create checkout session for subscription
// @route   POST /api/subscriptions/checkout
// @access  Private
const createCheckoutSession = asyncHandler(async (req, res) => {
  const { plan, billingCycle } = req.body;
  
  if (!plan || !['premium', 'ultimate'].includes(plan)) {
    res.status(400);
    throw new Error('Valid plan (premium or ultimate) is required');
  }
  
  if (!billingCycle || !['monthly', 'yearly'].includes(billingCycle)) {
    res.status(400);
    throw new Error('Valid billing cycle (monthly or yearly) is required');
  }
  
  try {
    // Get or create customer
    let customerId;
    const subscription = await Subscription.findOne({ user: req.user._id });
    
    if (subscription && subscription.paymentDetails.customerId) {
      customerId = subscription.paymentDetails.customerId;
    } else {
      // Create a new customer
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: {
          userId: req.user._id.toString()
        }
      });
      
      customerId = customer.id;
    }
    
    // Define price IDs (these would be created in your Stripe dashboard)
    const priceIds = {
      premium: {
        monthly: 'price_premium_monthly', // Replace with actual Stripe price ID
        yearly: 'price_premium_yearly'    // Replace with actual Stripe price ID
      },
      ultimate: {
        monthly: 'price_ultimate_monthly', // Replace with actual Stripe price ID
        yearly: 'price_ultimate_yearly'    // Replace with actual Stripe price ID
      }
    };
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceIds[plan][billingCycle],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      metadata: {
        userId: req.user._id.toString(),
        plan,
        billingCycle
      }
    });
    
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500);
    throw new Error('Error creating checkout session');
  }
});

// @desc    Handle Stripe webhook events
// @route   POST /api/subscriptions/webhook
// @access  Public
const handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      
      // Extract data from session
      const { userId, plan, billingCycle } = session.metadata;
      
      // Update or create subscription
      await Subscription.findOneAndUpdate(
        { user: userId },
        {
          plan,
          billingCycle,
          status: 'active',
          paymentDetails: {
            provider: 'stripe',
            customerId: session.customer,
            subscriptionId: session.subscription,
            priceId: session.line_items?.data[0]?.price?.id
          },
          startDate: new Date(),
          currentPeriodEnd: null, // Will be updated when subscription.created event is received
          cancelAtPeriodEnd: false
        },
        { upsert: true, new: true }
      );
      
      break;
    }
    
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      
      // Find the user by customer ID
      const userSubscription = await Subscription.findOne({
        'paymentDetails.customerId': subscription.customer
      });
      
      if (userSubscription) {
        userSubscription.status = subscription.status;
        userSubscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
        userSubscription.cancelAtPeriodEnd = subscription.cancel_at_period_end;
        
        await userSubscription.save();
      }
      
      break;
    }
    
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      
      // Find the user by customer ID
      const userSubscription = await Subscription.findOne({
        'paymentDetails.customerId': subscription.customer
      });
      
      if (userSubscription) {
        userSubscription.status = 'canceled';
        userSubscription.plan = 'free';
        
        await userSubscription.save();
      }
      
      break;
    }
  }
  
  res.json({ received: true });
});

// @desc    Cancel subscription
// @route   POST /api/subscriptions/cancel
// @access  Private
const cancelSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOne({ user: req.user._id });
  
  if (!subscription || subscription.plan === 'free') {
    res.status(400);
    throw new Error('No active subscription to cancel');
  }
  
  try {
    if (subscription.paymentDetails.subscriptionId) {
      // Cancel at period end
      await stripe.subscriptions.update(subscription.paymentDetails.subscriptionId, {
        cancel_at_period_end: true
      });
      
      subscription.cancelAtPeriodEnd = true;
      await subscription.save();
      
      res.json({
        message: 'Subscription will be canceled at the end of the billing period',
        currentPeriodEnd: subscription.currentPeriodEnd
      });
    } else {
      res.status(400);
      throw new Error('No subscription ID found');
    }
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500);
    throw new Error('Error canceling subscription');
  }
});

// @desc    Get available subscription plans
// @route   GET /api/subscriptions/plans
// @access  Public
const getSubscriptionPlans = asyncHandler(async (req, res) => {
  // In a real implementation, these might come from a database or Stripe Products API
  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Basic features to get started',
      price: {
        monthly: 0,
        yearly: 0
      },
      features: {
        maxCompanions: 1,
        voiceMinutesPerMonth: 10,
        advancedPersonality: false,
        exclusiveAvatars: false,
        memoryCapacity: 100
      }
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Enhanced features for a better experience',
      price: {
        monthly: 9.99,
        yearly: 99.99 // ~17% discount
      },
      features: {
        maxCompanions: 3,
        voiceMinutesPerMonth: 100,
        advancedPersonality: true,
        exclusiveAvatars: false,
        memoryCapacity: 1000
      }
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      description: 'The complete experience with all features',
      price: {
        monthly: 19.99,
        yearly: 199.99 // ~17% discount
      },
      features: {
        maxCompanions: 10,
        voiceMinutesPerMonth: 500,
        advancedPersonality: true,
        exclusiveAvatars: true,
        memoryCapacity: 10000
      }
    }
  ];
  
  res.json(plans);
});

module.exports = {
  getSubscription,
  createCheckoutSession,
  handleWebhook,
  cancelSubscription,
  getSubscriptionPlans,
};