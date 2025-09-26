'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronRight,
  MessageCircle,
  Mail,
  Phone,
  Book,
  Video,
  FileText,
  Send,
  Star,
  ThumbsUp,
  ThumbsDown,
  ExternalLink
} from 'lucide-react';
import Navigation from '@/components/ui/Navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  helpful: number;
  notHelpful: number;
  tags: string[];
}

interface SupportTicket {
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

export default function HelpPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<'faq' | 'contact' | 'guides' | 'feedback'>('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [supportTicket, setSupportTicket] = useState<SupportTicket>({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqData: FAQItem[] = [
    {
      id: '1',
      category: 'getting-started',
      question: 'How do I get started with NetSync?',
      answer: 'Welcome to NetSync! To get started: 1) Complete your profile with your professional information, skills, and networking goals. 2) Browse upcoming events and conferences in your industry. 3) Let our AI matching algorithm suggest relevant connections. 4) Start networking by sending connection requests and messages.',
      helpful: 45,
      notHelpful: 2,
      tags: ['onboarding', 'profile', 'basics']
    },
    {
      id: '2',
      category: 'matching',
      question: 'How does the AI matching algorithm work?',
      answer: 'Our AI algorithm analyzes your profile information, including your skills, interests, experience level, and networking goals. It then matches you with other users who have complementary skills, similar interests, or mutual networking objectives. The matching score is based on factors like skill overlap, industry relevance, experience compatibility, and networking preferences.',
      helpful: 38,
      notHelpful: 5,
      tags: ['ai', 'matching', 'algorithm']
    },
    {
      id: '3',
      category: 'privacy',
      question: 'Is my data secure and private?',
      answer: 'Yes, we take data security very seriously. Your personal information is encrypted and stored securely. We never share your data with third parties without your explicit consent. You can control your privacy settings to determine what information is visible to other users and opt out of data analytics at any time.',
      helpful: 52,
      notHelpful: 1,
      tags: ['security', 'privacy', 'data']
    },
    {
      id: '4',
      category: 'connections',
      question: 'How do I manage my connections?',
      answer: 'You can manage all your connections from the "My Network" page. Here you can: view all your connections, send messages, see pending connection requests, accept or decline invitations, search through your network, and organize connections by categories or tags.',
      helpful: 31,
      notHelpful: 3,
      tags: ['connections', 'networking', 'management']
    },
    {
      id: '5',
      category: 'events',
      question: 'How do I register for events?',
      answer: 'Browse events on the Events page, click on any event that interests you, and click the "Register" button. Some events are free while others may require payment. Once registered, you\'ll receive confirmation and reminder emails. You can view all your registered events in the "My Events" tab.',
      helpful: 29,
      notHelpful: 4,
      tags: ['events', 'registration', 'conferences']
    },
    {
      id: '6',
      category: 'profile',
      question: 'How can I improve my profile visibility?',
      answer: 'To improve your profile visibility: 1) Complete all profile sections (aim for 90%+ completion), 2) Add a professional photo, 3) Include detailed skills and interests, 4) Write a compelling bio, 5) Keep your information up-to-date, 6) Set your profile visibility to "Public" in privacy settings.',
      helpful: 41,
      notHelpful: 2,
      tags: ['profile', 'visibility', 'optimization']
    },
    {
      id: '7',
      category: 'troubleshooting',
      question: 'I\'m not receiving any matches. What should I do?',
      answer: 'If you\'re not receiving matches: 1) Ensure your profile is complete (especially skills and interests), 2) Check your matching preferences in settings, 3) Make sure you have events selected or are attending conferences, 4) Verify your account email, 5) Try broadening your networking goals. Contact support if the issue persists.',
      helpful: 22,
      notHelpful: 8,
      tags: ['troubleshooting', 'matches', 'algorithm']
    },
    {
      id: '8',
      category: 'billing',
      question: 'What are the pricing options?',
      answer: 'NetSync offers a free tier with basic matching and networking features. Premium plans include: Enhanced matching algorithm, priority support, advanced analytics, unlimited messages, and early access to new features. Visit our pricing page or contact sales for enterprise solutions.',
      helpful: 33,
      notHelpful: 6,
      tags: ['pricing', 'billing', 'premium']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Categories', count: faqData.length },
    { id: 'getting-started', label: 'Getting Started', count: faqData.filter(faq => faq.category === 'getting-started').length },
    { id: 'matching', label: 'Matching & AI', count: faqData.filter(faq => faq.category === 'matching').length },
    { id: 'connections', label: 'Connections', count: faqData.filter(faq => faq.category === 'connections').length },
    { id: 'events', label: 'Events', count: faqData.filter(faq => faq.category === 'events').length },
    { id: 'profile', label: 'Profile', count: faqData.filter(faq => faq.category === 'profile').length },
    { id: 'privacy', label: 'Privacy & Security', count: faqData.filter(faq => faq.category === 'privacy').length },
    { id: 'troubleshooting', label: 'Troubleshooting', count: faqData.filter(faq => faq.category === 'troubleshooting').length },
    { id: 'billing', label: 'Billing', count: faqData.filter(faq => faq.category === 'billing').length }
  ];

  const guides = [
    {
      id: '1',
      title: 'Complete Profile Setup Guide',
      description: 'Step-by-step guide to creating an effective professional profile',
      type: 'article',
      duration: '5 min read',
      url: '#'
    },
    {
      id: '2',
      title: 'Networking Best Practices',
      description: 'Tips and strategies for effective professional networking',
      type: 'video',
      duration: '12 min watch',
      url: '#'
    },
    {
      id: '3',
      title: 'Using the AI Matching System',
      description: 'How to leverage our AI algorithm for better connections',
      type: 'article',
      duration: '7 min read',
      url: '#'
    },
    {
      id: '4',
      title: 'Event Networking Strategies',
      description: 'Making the most of conference and event networking opportunities',
      type: 'video',
      duration: '15 min watch',
      url: '#'
    }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Support ticket submitted:', supportTicket);
      setSupportTicket({
        subject: '',
        description: '',
        category: 'general',
        priority: 'medium'
      });
      setIsSubmitting(false);
      alert('Your support ticket has been submitted successfully! We\'ll get back to you within 24 hours.');
    }, 1500);
  };

  const handleFeedback = (faqId: string, helpful: boolean) => {
    console.log(`FAQ ${faqId} marked as ${helpful ? 'helpful' : 'not helpful'}`);
    // Implement feedback logic here
  };

  const sections = [
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'contact', label: 'Contact Support', icon: MessageCircle },
    { id: 'guides', label: 'Guides & Tutorials', icon: Book },
    { id: 'feedback', label: 'Feedback', icon: Star }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Help & Support</h1>
                <p className="text-slate-600 dark:text-slate-300">Find answers to your questions and get help when you need it</p>
              </div>
            </div>

            {/* Section Navigation */}
            <div className="flex flex-wrap gap-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {section.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* FAQ Section */}
          {activeSection === 'faq' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-lg"
                />
              </div>

              <div className="grid lg:grid-cols-4 gap-8">
                {/* Categories */}
                <div className="lg:col-span-1">
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                            selectedCategory === category.id
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'text-slate-300 hover:bg-slate-700/50'
                          }`}
                        >
                          <span>{category.label}</span>
                          <span className="text-xs bg-slate-600 px-2 py-1 rounded-full">
                            {category.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FAQ Items */}
                <div className="lg:col-span-3 space-y-4">
                  {filteredFAQs.length === 0 ? (
                    <div className="card p-8 text-center">
                      <HelpCircle className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                      <p className="text-slate-400">Try adjusting your search terms or category filter.</p>
                    </div>
                  ) : (
                    filteredFAQs.map((faq, index) => (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="card"
                      >
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/50 transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                          {expandedFAQ === faq.id ? (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          )}
                        </button>

                        {expandedFAQ === faq.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-6 pb-6"
                          >
                            <div className="border-t border-slate-700 pt-4">
                              <p className="text-slate-300 mb-4">{faq.answer}</p>
                              
                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {faq.tags.map(tag => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              {/* Feedback */}
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-slate-400">Was this helpful?</span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleFeedback(faq.id, true)}
                                    className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-full hover:bg-green-500/30 transition-colors"
                                  >
                                    <ThumbsUp className="w-4 h-4" />
                                    {faq.helpful}
                                  </button>
                                  <button
                                    onClick={() => handleFeedback(faq.id, false)}
                                    className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-300 rounded-full hover:bg-red-500/30 transition-colors"
                                  >
                                    <ThumbsDown className="w-4 h-4" />
                                    {faq.notHelpful}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Contact Support Section */}
          {activeSection === 'contact' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Contact Methods */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white mb-4">Get in Touch</h2>
                  
                  <div className="card p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <MessageCircle className="w-6 h-6 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Live Chat</h3>
                    </div>
                    <p className="text-slate-300 text-sm mb-3">
                      Get instant help from our support team
                    </p>
                    <p className="text-slate-400 text-xs">Available: Mon-Fri, 9 AM - 6 PM PST</p>
                    <button className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors">
                      Start Chat
                    </button>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Mail className="w-6 h-6 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">Email Support</h3>
                    </div>
                    <p className="text-slate-300 text-sm mb-3">
                      Send us a detailed message
                    </p>
                    <p className="text-slate-400 text-xs mb-2">Response time: Within 24 hours</p>
                    <p className="text-blue-400 text-sm">support@netsync.com</p>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Phone className="w-6 h-6 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">Phone Support</h3>
                    </div>
                    <p className="text-slate-300 text-sm mb-3">
                      Call us for urgent issues
                    </p>
                    <p className="text-slate-400 text-xs mb-2">Available: Mon-Fri, 9 AM - 6 PM PST</p>
                    <p className="text-purple-400 text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>

                {/* Support Form */}
                <div className="lg:col-span-2">
                  <div className="card p-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">Submit a Support Ticket</h2>
                    
                    <form onSubmit={handleSubmitTicket} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Category
                          </label>
                          <select
                            value={supportTicket.category}
                            onChange={(e) => setSupportTicket({...supportTicket, category: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          >
                            <option value="general">General Question</option>
                            <option value="technical">Technical Issue</option>
                            <option value="billing">Billing & Payments</option>
                            <option value="account">Account Management</option>
                            <option value="feature">Feature Request</option>
                            <option value="bug">Bug Report</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Priority
                          </label>
                          <select
                            value={supportTicket.priority}
                            onChange={(e) => setSupportTicket({...supportTicket, priority: e.target.value as any})}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={supportTicket.subject}
                          onChange={(e) => setSupportTicket({...supportTicket, subject: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          placeholder="Brief description of your issue"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Description
                        </label>
                        <textarea
                          value={supportTicket.description}
                          onChange={(e) => setSupportTicket({...supportTicket, description: e.target.value})}
                          rows={6}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          placeholder="Please provide as much detail as possible about your issue, including steps to reproduce, error messages, etc."
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Guides Section */}
          {activeSection === 'guides' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-white">Guides & Tutorials</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {guides.map((guide, index) => (
                  <motion.div
                    key={guide.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card p-6 hover:scale-[1.02] transition-transform duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        guide.type === 'video' ? 'bg-red-500/20' : 'bg-blue-500/20'
                      }`}>
                        {guide.type === 'video' ? (
                          <Video className={`w-6 h-6 ${guide.type === 'video' ? 'text-red-400' : 'text-blue-400'}`} />
                        ) : (
                          <FileText className={`w-6 h-6 ${guide.type === 'video' ? 'text-red-400' : 'text-blue-400'}`} />
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-white mb-2">{guide.title}</h3>
                        <p className="text-slate-300 mb-3">{guide.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">{guide.duration}</span>
                          <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                            <span className="text-sm">Read More</span>
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Feedback Section */}
          {activeSection === 'feedback' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-8"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">We Value Your Feedback</h2>
              <p className="text-slate-300 mb-6">
                Help us improve NetSync by sharing your thoughts, suggestions, and feature requests.
              </p>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    What would you like to share?
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500">
                    <option>General Feedback</option>
                    <option>Feature Request</option>
                    <option>Bug Report</option>
                    <option>Improvement Suggestion</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Tell us what you think..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Submit Feedback
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}