import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Personalities from './components/Personalities';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Personalities />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
