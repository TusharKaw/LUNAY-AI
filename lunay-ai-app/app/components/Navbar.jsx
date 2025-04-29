'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-luna-dark/80 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Replace with your actual logo */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-luna-primary to-luna-secondary flex items-center justify-center text-white font-bold text-xl">
                  L
                </div>
              </motion.div>
              <span className="ml-2 text-xl font-semibold bg-gradient-to-r from-luna-primary to-luna-secondary bg-clip-text text-transparent">
                Luna AI
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/#features"
                className="px-3 py-2 rounded-md text-sm font-medium hover:text-luna-primary transition-colors"
              >
                Features
              </Link>
              <Link
                href="/#personalities"
                className="px-3 py-2 rounded-md text-sm font-medium hover:text-luna-primary transition-colors"
              >
                Personalities
              </Link>
              <Link
                href="/#testimonials"
                className="px-3 py-2 rounded-md text-sm font-medium hover:text-luna-primary transition-colors"
              >
                Testimonials
              </Link>
              <Link
                href="/#pricing"
                className="px-3 py-2 rounded-md text-sm font-medium hover:text-luna-primary transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/try-luna"
                className="luna-button-primary ml-4"
              >
                Meet Luna Now
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-luna-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white dark:bg-luna-dark shadow-lg"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/#features"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-luna-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/#personalities"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-luna-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Personalities
            </Link>
            <Link
              href="/#testimonials"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-luna-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="/#pricing"
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-luna-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/try-luna"
              className="block px-3 py-2 rounded-md text-base font-medium bg-luna-primary text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Meet Luna Now
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;