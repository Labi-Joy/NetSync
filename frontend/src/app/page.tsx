'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { 
  Brain, 
  Hand, 
  Award, 
  DollarSign, 
  Calendar, 
  User,
  Users,
  Target,
  Zap,
  Sun,
  Moon
} from 'lucide-react'

export default function Home() {
  const [theme, setTheme] = useState('dark')
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'light' : 'dark')
  }

  const features = [
    {
      icon: Brain,
      title: "Smart Professional Matching",
      description: "AI analyzes your skills, experience level, and career goals to find perfect networking matches with detailed compatibility scores"
    },
    {
      icon: Hand,
      title: "Swipe to Connect",
      description: "Tinder-style interface for browsing potential professional connections. Swipe right to connect, left to pass on networking opportunities"
    },
    {
      icon: Award,
      title: "NFT Networking Badges",
      description: "Mint commemorative NFT badges for successful meetups and ongoing professional collaborations at tech conferences"
    },
    {
      icon: DollarSign,
      title: "Stake & Earn Rewards",
      description: "Stake tokens on promising networking connections. Earn rewards when relationships lead to verified long-term collaborations"
    },
    {
      icon: Calendar,
      title: "Conference Integration",
      description: "Sync with tech conference schedules. Get real-time notifications about optimal networking opportunities during events"
    },
    {
      icon: User,
      title: "Web3 Professional Profiles",
      description: "Showcase your technical skills, experience, and Web3 portfolio. Connect your professional identity directly to your wallet"
    }
  ]

  const stats = [
    { number: "2,500+", label: "Tech Professionals Connected" },
    { number: "75+", label: "Conference Events Integrated" },
    { number: "1,200+", label: "NFT Networking Badges Minted" },
    { number: "85%", label: "Success Rate for Lasting Professional Connections" }
  ]

  const steps = [
    {
      step: "01",
      title: "Connect your Web3 wallet and build your professional networking profile",
      description: "Link your digital identity and showcase your skills"
    },
    {
      step: "02", 
      title: "Browse potential matches with AI-generated compatibility scores based on skills and goals",
      description: "Find professionals who align with your networking objectives"
    },
    {
      step: "03",
      title: "Swipe right on tech professionals you'd like to network with at conferences",
      description: "Express interest in meaningful professional connections"
    },
    {
      step: "04",
      title: "When both users match, coordinate meetups and mint NFT networking badges as proof of connection",
      description: "Create lasting proof of your professional networking activities"
    }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text)' }}>
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 animate-float" style={{ backgroundColor: 'var(--accent-secondary)', opacity: 0.1, borderRadius: '50%' }}></div>
        <div className="absolute bottom-40 left-40 w-24 h-24 animate-float" style={{ backgroundColor: 'var(--accent-primary)', opacity: 0.1, borderRadius: '50%', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 animate-pulse" style={{ backgroundColor: 'var(--accent-secondary)', opacity: 0.1, borderRadius: '50%' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold"
            style={{ color: 'var(--text)' }}
          >
            NetSync
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text-muted)' }}>Features</a>
            <a href="#how-it-works" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text-muted)' }}>How It Works</a>
            <a href="#tokenomics" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text-muted)' }}>Tokenomics</a>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--accent-primary)' }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <Link href="/signup" className="btn btn-primary">
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
                  className="text-5xl lg:text-6xl font-bold leading-tight"
                  style={{ color: 'var(--text)' }}
                >
                  Connect.
                  <br />
                  <span style={{ color: 'var(--accent-primary)' }}>
                    Network.
                  </span>
                  <br />
                  <span style={{ color: 'var(--accent-secondary)' }}>Earn.</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl mt-6 leading-relaxed"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Web3-Native Professional Networking for Tech Conferences
                </motion.p>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg mt-4 leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  AI-powered matching for tech professionals. Mint NFT badges for successful connections. 
                  Stake on promising networking relationships and earn tokens from lasting collaborations.
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary text-lg px-8 py-4 rounded-xl font-semibold"
                >
                  🔗 Connect Wallet & Start Networking
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-secondary text-lg px-8 py-4 rounded-xl font-semibold"
                >
                  📺 View Demo
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual (Space for image) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="card p-8 relative">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🤝</div>
                  <h3 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
                    3D Professional Networking Visualization
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    [Space for hero image showing diverse tech professionals with floating NFT badges and connection lines]
                  </p>
                </div>
                
                {/* Floating NFT Badges */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -left-4 nft-badge"
                >
                  💎 NFT Badge
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 -right-4 nft-badge"
                >
                  🎯 95% Match
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text)' }}>
              Web3-Native Networking Features
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              Revolutionary features that transform how tech professionals connect and collaborate
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
                className="card p-8"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-xl mb-6" style={{ backgroundColor: 'var(--accent-primary)' }}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-muted)' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text)' }}>
              How NetSync Works
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              Four simple steps to revolutionize your professional networking
            </p>
          </motion.div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex items-center gap-8 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
              >
                <div className="flex-1 card p-8">
                  <div className="text-sm font-bold mb-2" style={{ color: 'var(--accent-primary)' }}>
                    STEP {step.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                    {step.title}
                  </h3>
                  <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
                    {step.description}
                  </p>
                </div>
                <div className="flex-shrink-0 w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}>
                  {step.step}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text)' }}>
              Proven Results in Web3 Networking
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold mb-2" style={{ color: 'var(--accent-primary)' }}>
                  {stat.number}
                </div>
                <div className="text-lg" style={{ color: 'var(--text-muted)' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics Preview Section */}
      <section id="tokenomics" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text)' }}>
              Tokenomics Preview
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-8" style={{ color: 'var(--text-muted)' }}>
              NetSync tokens power the decentralized networking ecosystem - stake on promising connections, 
              earn from successful professional relationships, and unlock premium matching features
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="card p-6 text-center"
            >
              <DollarSign className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent-primary)' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
                Staking on Matches
              </h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="card p-6 text-center"
            >
              <Target className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent-primary)' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
                Earning Rewards
              </h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="card p-6 text-center"
            >
              <Zap className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent-primary)' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
                Premium Matching
              </h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="card p-6 text-center"
            >
              <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent-primary)' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
                Exclusive Events
              </h3>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card p-12"
            style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Revolutionize Your Professional Network?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join the future of Web3 professional networking. Connect with like-minded tech professionals 
              and earn while you build meaningful career relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-lg px-8 py-4 rounded-xl font-semibold transition-colors"
                style={{ backgroundColor: 'white', color: 'var(--accent-primary)' }}
              >
                🚀 Launch DApp Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-colors"
              >
                📝 Join Beta Waitlist
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>NetSync</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Web3-native professional networking for tech conferences and beyond.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Community</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text-muted)' }}>Discord</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text-muted)' }}>Twitter</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text-muted)' }}>LinkedIn</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text-muted)' }}>GitHub</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text-muted)' }}>Documentation</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text-muted)' }}>Developer API</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text-muted)' }}>Partnership Inquiries</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text-muted)' }}>Privacy Policy</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--text-muted)' }}>Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 text-center" style={{ borderTop: '1px solid var(--border)' }}>
            
          </div>
        </div>
      </footer>
    </div>
  )
}