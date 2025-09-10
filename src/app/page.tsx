'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { Footer } from '@/components/ui/Footer'

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-100 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-slate-800"
          >
            NetSync
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-slate-800 transition-colors">Features</a>
            <a href="#about" className="text-slate-600 hover:text-slate-800 transition-colors">About</a>
            <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight"
                >
                  Connect.
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Network.
                  </span>
                  <br />
                  <span className="text-cyan-600">Level Up.</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-slate-600 mt-6 leading-relaxed"
                >
                  AI-powered networking for tech conferences. Match with like-minded attendees, 
                  coordinate meetups, and make meaningful connections that advance your career.
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    🔗 Connect Wallet
                  </motion.button>
                </Link>
                
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-slate-300 hover:border-blue-400 text-slate-700 hover:text-blue-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  >
                    ✉️ Start with Email
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">500+</div>
                  <div className="text-sm text-slate-600">Connections Made</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">50+</div>
                  <div className="text-sm text-slate-600">Events Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">95%</div>
                  <div className="text-sm text-slate-600">Match Success</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Main Card */}
              <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                {/* Mock Profile Cards */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">Alex Chen</div>
                      <div className="text-sm text-slate-600">Frontend Developer</div>
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      95% Match
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                      S
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">Sarah Kim</div>
                      <div className="text-sm text-slate-600">AI Researcher</div>
                    </div>
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      87% Match
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      M
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">Mike Johnson</div>
                      <div className="text-sm text-slate-600">Product Manager</div>
                    </div>
                    <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      82% Match
                    </div>
                  </div>
                </div>

                {/* Connection Lines */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-8 -left-8 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20"
              >
                <div className="text-2xl">🤝</div>
                <div className="text-xs text-slate-600 mt-1">New Match!</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-8 -right-8 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20"
              >
                <div className="text-2xl">💬</div>
                <div className="text-xs text-slate-600 mt-1">Chat Active</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose NetSync?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI-powered platform makes networking effortless and meaningful
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Smart Matching</h3>
              <p className="text-slate-600">
                Our AI analyzes your interests, goals, and experience to find perfect networking matches with high compatibility scores.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Real-time Chat</h3>
              <p className="text-slate-600">
                Connect instantly with matches through our built-in chat system. Coordinate meetups and share ideas seamlessly.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Event Integration</h3>
              <p className="text-slate-600">
                Sync with conference schedules, suggest optimal meeting times, and never miss an opportunity to connect.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white"
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Level Up Your Networking?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals making meaningful connections at tech events
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Get Started Free
                </motion.button>
              </Link>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  View Dashboard
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}