'use client'

import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-br from-slate-50 to-blue-50 border-t border-slate-200/50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-200 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-3">NetSync</h3>
              <p className="text-slate-600 leading-relaxed max-w-md">
                AI-powered networking for tech conferences. Connect with like-minded professionals, 
                coordinate meaningful meetups, and advance your career through strategic networking.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: Github, href: '#', label: 'GitHub' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Mail, href: '#', label: 'Email' }
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/50"
                  aria-label={label}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Product</h4>
            <ul className="space-y-3">
              {['Features', 'How it Works', 'Pricing', 'API Docs'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-slate-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Support</h4>
            <ul className="space-y-3">
              {['Help Center', 'Community', 'Contact Us', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-slate-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/30"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-semibold text-slate-800 mb-2">Stay in the loop</h4>
              <p className="text-slate-600">Get the latest updates on networking events and platform features.</p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-slate-200/50 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <div className="text-slate-600 text-sm">
              © {currentYear} NetSync. All rights reserved.
            </div>

            {/* Made with love */}
            <motion.div 
              className="flex items-center gap-2 text-sm"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-slate-600">Made with</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </motion.div>
              <span className="text-slate-600">by</span>
              <motion.a
                href="https://github.com/labi-dev" // Update with actual profile
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
              >
                labi_dev
              </motion.a>
            </motion.div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <a href="#" className="hover:text-blue-600 transition-colors duration-200">Terms</a>
              <a href="#" className="hover:text-blue-600 transition-colors duration-200">Privacy</a>
              <a href="#" className="hover:text-blue-600 transition-colors duration-200">Cookies</a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating decoration */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-8 right-8 w-2 h-2 bg-blue-400 rounded-full"
      />
      
      <motion.div
        animate={{ 
          y: [0, 10, 0],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-16 left-12 w-3 h-3 bg-purple-400 rounded-full"
      />
    </footer>
  )
}


