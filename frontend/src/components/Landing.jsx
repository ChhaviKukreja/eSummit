import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUsers, FiTrendingUp, FiBriefcase, FiSearch, FiBook, FiAward, FiLinkedin, FiTwitter, FiInstagram, FiFacebook } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <SignUpSection />
      </main>
      <Footer />
    </div>
  );
};

// Header Component
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About', href: '#about' },
  ];

  // Go to dashboard if authenticated, otherwise go to signup
  const handleAuthAction = () => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 shadow-lg backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">ConnectHub</span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-10">
          {navLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`font-medium transition-colors hover:text-purple-600 ${scrolled ? 'text-gray-800' : 'text-white'}`}
            >
              {link.name}
            </motion.a>
          ))}
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated() ? (
            <>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-md text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </motion.button>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${scrolled ? 'text-purple-600 hover:text-purple-700' : 'text-white hover:text-purple-200'}`}
                onClick={logout}
              >
                Sign Out
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${scrolled ? 'text-purple-600 hover:text-purple-700' : 'text-white hover:text-purple-200'}`}
                onClick={() => navigate('/signup')}
              >
                Sign In
              </motion.button>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-md text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </motion.button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 focus:outline-none ${scrolled ? 'text-gray-800' : 'text-white'}`}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="font-medium text-gray-800 hover:text-purple-600 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                  {isAuthenticated() ? (
                    <>
                      <button 
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-md text-white font-medium"
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/dashboard');
                        }}
                      >
                        Dashboard
                      </button>
                      <button 
                        className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
                        onClick={() => {
                          setIsOpen(false);
                          logout();
                        }}
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/signup');
                        }}
                      >
                        Sign In
                      </button>
                      <button 
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-md text-white font-medium"
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/signup');
                        }}
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// Hero Component
const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 py-24 md:py-32">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2 text-center md:text-left mb-12 md:mb-0"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Connect, Collaborate & <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Build the Future
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg mx-auto md:mx-0"
            >
              Find mentors, co-founders, and professionals who share your vision. Stay ahead with tech trends and hype cycle insights.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg font-medium text-white shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => navigate('/signup')}
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-medium text-white hover:bg-white/20 transition-colors"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
          
          {/* Image/Illustration */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full md:w-1/2"
          >
            <div className="relative">
              {/* Placeholder for illustration */}
              <div className="w-full h-96 md:h-[500px] bg-gradient-to-br from-purple-500/30 to-blue-500/30 backdrop-blur-sm rounded-2xl border border-white/10 p-4 flex items-center justify-center">
                <div className="relative w-full h-full overflow-hidden">
                  {/* Decorative elements */}
                  <motion.div 
                    animate={{ 
                      y: [0, -10, 0], 
                      rotate: [0, 5, 0],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 6,
                      ease: "easeInOut" 
                    }}
                    className="absolute top-1/4 left-1/4 w-24 h-24 bg-purple-500/40 rounded-xl backdrop-blur-md border border-white/20"
                  ></motion.div>
                  
                  <motion.div 
                    animate={{ 
                      y: [0, 10, 0], 
                      rotate: [0, -5, 0],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 7,
                      ease: "easeInOut" 
                    }}
                    className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-500/40 rounded-full backdrop-blur-md border border-white/20"
                  ></motion.div>

                  <motion.div 
                    animate={{ 
                      x: [0, 15, 0], 
                      rotate: [0, 10, 0],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 8,
                      ease: "easeInOut" 
                    }}
                    className="absolute top-1/2 right-1/3 w-20 h-20 bg-indigo-500/40 rounded-lg backdrop-blur-md border border-white/20"
                  ></motion.div>

                  {/* Central element */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 3, 0],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 10,
                      ease: "easeInOut" 
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-purple-600/70 to-blue-600/70 rounded-2xl backdrop-blur-lg border border-white/30 flex items-center justify-center shadow-2xl"
                  >
                    <span className="text-3xl font-bold text-white">ConnectHub</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Features Component
const Features = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef(null);

  const features = [
    {
      icon: <FiUsers size={40} />,
      title: 'Connect with Co-Founders',
      description: 'Find the perfect business partner who complements your skills and shares your vision.',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: <FiTrendingUp size={40} />,
      title: 'Tech Trend Analysis',
      description: 'Stay ahead with insights based on the latest technology hype cycles and market trends.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FiBriefcase size={40} />,
      title: 'Professional Networking',
      description: 'Build relationships with industry professionals who can help grow your business.',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: <FiSearch size={40} />,
      title: 'Find Mentors',
      description: 'Connect with experienced mentors who can guide you through your entrepreneurial journey.',
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: <FiBook size={40} />,
      title: 'Resource Library',
      description: 'Access a wealth of articles, guides, and resources tailored to entrepreneurs.',
      color: 'from-yellow-500 to-amber-500',
    },
    {
      icon: <FiAward size={40} />,
      title: 'Mentorship Programs',
      description: 'Create or join structured mentorship programs to accelerate growth and development.',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % features.length);
      }, 5000);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, features.length]);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
    setAutoplay(false);
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
    setAutoplay(false);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length);
    setAutoplay(false);
  };

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Everything you need to connect, grow, and succeed in your entrepreneurial journey
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-5xl mx-auto mb-12 h-96">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col md:flex-row items-center gap-8"
            >
              {/* Feature Icon */}
              <div className="w-full md:w-1/3 flex justify-center">
                <div className={`w-40 h-40 rounded-3xl bg-gradient-to-br ${features[currentSlide].color} flex items-center justify-center text-white shadow-lg`}>
                  {features[currentSlide].icon}
                </div>
              </div>
              
              {/* Feature Content */}
              <div className="w-full md:w-2/3 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-4">{features[currentSlide].title}</h3>
                <p className="text-gray-600 text-lg mb-6">{features[currentSlide].description}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-shadow"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <div className="absolute -bottom-16 left-0 right-0 flex flex-col items-center">
            {/* Dots */}
            <div className="flex space-x-2 mb-4">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Arrows */}
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="p-2 rounded-full bg-white shadow hover:shadow-md transition-shadow"
                aria-label="Previous slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="p-2 rounded-full bg-white shadow hover:shadow-md transition-shadow"
                aria-label="Next slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Feature Grid (visible on larger screens) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="hidden lg:grid grid-cols-3 gap-8 mt-32"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// HowItWorks Component
const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Sign up and build your professional profile highlighting your skills, experience, and interests.'
    },
    {
      number: '02',
      title: 'Discover Connections',
      description: 'Browse through potential co-founders, mentors, and professionals based on your specific needs.'
    },
    {
      number: '03',
      title: 'Connect & Collaborate',
      description: 'Reach out to make connections and start collaborating on projects and ideas together.'
    },
    {
      number: '04',
      title: 'Grow Your Business',
      description: 'Leverage collective expertise and resources to accelerate your business growth.'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              How ConnectHub Works
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Our simple process to help you find the right connections for your entrepreneurial journey
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-500 transform -translate-x-1/2"></div>
            
            {/* Steps */}
            <div className="space-y-12 md:space-y-0">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex flex-col ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } md:items-center`}
                >
                  {/* Number */}
                  <div className="md:w-1/2 flex justify-center mb-6 md:mb-0">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {step.number}
                      </div>
                      <div className="hidden md:block absolute top-1/2 w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform -translate-y-1/2 
                        ${index % 2 === 0 ? 'right-full' : 'left-full'}"></div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="md:w-1/2 px-4">
                    <div className="bg-white rounded-lg p-6 shadow-md">
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// SignUpSection Component
const SignUpSection = () => {
  const [activeTab, setActiveTab] = useState('professional');
  const navigate = useNavigate();

  const tabContent = {
    entrepreneur: {
      title: "For Entrepreneurs",
      description: "Looking to build your startup team? Connect with co-founders, mentors, and professionals.",
      benefits: [
        "Find co-founders with complementary skills",
        "Connect with experienced mentors",
        "Access resources tailored to startup growth",
        "Join a community of like-minded entrepreneurs"
      ],
      image: "entrepreneur-illustration.svg" // Placeholder for illustration
    },
    professional: {
      title: "For Professionals & Mentors",
      description: "Share your expertise, mentor startups, or find exciting projects to collaborate on.",
      benefits: [
        "Discover promising startups to mentor",
        "Connect with entrepreneurs seeking your expertise",
        "Build your professional network",
        "Share knowledge and gain new perspectives"
      ],
      image: "professional-illustration.svg" // Placeholder for illustration
    }
  };

  return (
    <section id="signup" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Join ConnectHub Today
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Whether you're an entrepreneur or professional, we have the right connections for you
          </p>
        </motion.div>

        {/* Tab Selector */}
        <div className="max-w-sm mx-auto mb-12">
          <div className="flex justify-center p-1 bg-gray-200 rounded-lg shadow-inner">
            <button
              onClick={() => setActiveTab('entrepreneur')}
              className={`w-1/2 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'entrepreneur'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Entrepreneur
            </button>
            <button
              onClick={() => setActiveTab('professional')}
              className={`w-1/2 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'professional'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Professional/Mentor
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center gap-12"
            >
              {/* Content */}
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">{tabContent[activeTab].title}</h3>
                <p className="text-gray-600 text-lg mb-6">{tabContent[activeTab].description}</p>
                
                {/* Benefits */}
                <div className="space-y-4 mb-8">
                  {tabContent[activeTab].benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center mt-1">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="ml-3 text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h4 className="text-lg font-semibold mb-4">Create Your Account</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Your email address"
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input 
                        type="password" 
                        id="password" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Create a password"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-shadow"
                      onClick={() => navigate('/signup')}
                    >
                      Sign Up Now
                    </motion.button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/signup'); }} className="text-purple-600 hover:underline">Sign in</a>
                  </p>
                </div>
              </div>
              
              {/* Illustration */}
              <div className="w-full md:w-1/2">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  {/* Placeholder for illustration */}
                  <div className="w-full h-80 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
                        {activeTab === 'entrepreneur' ? <FiUsers size={40} /> : <FiAward size={40} />}
                      </div>
                      <h4 className="text-xl font-semibold mb-2">Join as a {activeTab === 'entrepreneur' ? 'Founder' : 'Mentor'}</h4>
                      <p className="text-gray-600">
                        {activeTab === 'entrepreneur' 
                          ? 'Build your dream team and grow your startup' 
                          : 'Share your expertise and help startups succeed'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'How It Works', href: '#how-it-works' },
        { name: 'Pricing', href: '#' },
        { name: 'FAQ', href: '#' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Contact', href: '#' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Community', href: '#' },
        { name: 'Success Stories', href: '#' },
        { name: 'Events', href: '#' },
        { name: 'Help Center', href: '#' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms', href: '#' },
        { name: 'Privacy', href: '#' },
        { name: 'Cookies', href: '#' },
        { name: 'Licenses', href: '#' },
      ]
    }
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: <FiLinkedin size={20} />, href: '#' },
    { name: 'Twitter', icon: <FiTwitter size={20} />, href: '#' },
    { name: 'Instagram', icon: <FiInstagram size={20} />, href: '#' },
    { name: 'Facebook', icon: <FiFacebook size={20} />, href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo and description */}
          <div className="col-span-2">
            <div className="mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">ConnectHub</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              ConnectHub brings together entrepreneurs, professionals, and mentors to create successful business partnerships and growth opportunities.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.href} 
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Navigation */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-lg font-semibold mb-4">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ConnectHub. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white text-sm">Terms</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Landing;
