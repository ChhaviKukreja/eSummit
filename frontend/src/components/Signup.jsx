import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiArrowLeft, FiBriefcase, FiBook, FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  // Navigation
  const navigate = useNavigate();
  
  // State to track which screen to show
  const [currentScreen, setCurrentScreen] = useState('auth-choice');
  
  // State for user inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  
  // Additional attributes based on role
  const [attributes, setAttributes] = useState({
    // For mentors/professionals
    yearsOfExperience: '',
    expertise: '',
    hourlyRate: '',
    skills: '',
    interestedTechnologies: '',
    mentorshipIntent: false,
    mentorshipTopics: '',
    pricing: '',
    
    // For aspiring entrepreneurs
    interests: '',
    skillSet: '',
    collaborationPreferences: '',
    budgetRange: '',
    availabilityPreferences: '',
    preferredTopics: '',
  });
  
  // Handle attribute changes
  const handleAttributeChange = (field, value) => {
    setAttributes({
      ...attributes,
      [field]: value,
    });
  };

  // Handle form submission for sign in
  const handleSignIn = () => {
    // This will be implemented later to fetch JWT token
    console.log('Sign In with:', { email, password });
  };

  // Handle sign up logic
  const handleSignUp = () => {
    // Here you would typically send the data to your backend
    console.log({
      username,
      email,
      password,
      role,
      attributes,
    });
    
    // Navigate to dashboard with the appropriate role
    navigate('/dashboard', { state: { userRole: role === 'mentor' ? 'professional' : 'entrepreneur' } });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  // Render different screens based on currentScreen state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'auth-choice':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md mx-auto"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
            >
              Welcome to ConnectHub
            </motion.h2>
            
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentScreen('sign-in')}
                className="w-full py-3 px-6 bg-white rounded-lg shadow-md border border-gray-200 text-gray-800 font-medium flex items-center justify-center space-x-2 hover:shadow-lg transition-shadow"
              >
                <span>Sign In</span>
                <FiArrowRight />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentScreen('sign-up')}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg shadow-md text-white font-medium flex items-center justify-center space-x-2 hover:shadow-lg transition-shadow"
              >
                <span>Sign Up</span>
                <FiArrowRight />
              </motion.button>
            </motion.div>
          </motion.div>
        );
        
      case 'sign-in':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md mx-auto"
          >
            <motion.div variants={itemVariants} className="flex items-center mb-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentScreen('auth-choice')}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
              >
                <FiArrowLeft size={20} />
              </motion.button>
              <h2 className="text-2xl font-bold ml-2 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Sign In
              </h2>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignIn}
                className="w-full py-3 px-6 mt-6 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg shadow-md text-white font-medium hover:shadow-lg transition-shadow"
              >
                Sign In
              </motion.button>
            </motion.div>
          </motion.div>
        );
        
      case 'sign-up':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md mx-auto"
          >
            <motion.div variants={itemVariants} className="flex items-center mb-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentScreen('auth-choice')}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
              >
                <FiArrowLeft size={20} />
              </motion.button>
              <h2 className="text-2xl font-bold ml-2 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Create Account
              </h2>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                    placeholder="johndoe"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentScreen('select-role')}
                className="w-full py-3 px-6 mt-6 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg shadow-md text-white font-medium hover:shadow-lg transition-shadow"
              >
                Continue
              </motion.button>
            </motion.div>
          </motion.div>
        );
        
      case 'select-role':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md mx-auto"
          >
            <motion.div variants={itemVariants} className="flex items-center mb-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentScreen('sign-up')}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
              >
                <FiArrowLeft size={20} />
              </motion.button>
              <h2 className="text-2xl font-bold ml-2 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Select Your Role
              </h2>
            </motion.div>
            
            <motion.p 
              variants={itemVariants}
              className="text-gray-600 mb-6"
            >
              Choose the role that best describes you to personalize your experience.
            </motion.p>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setRole('mentor');
                  setCurrentScreen('mentor-attributes');
                }}
                className="p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white">
                    <FiBriefcase size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-lg text-gray-800">Mentor / Professional</h3>
                    <p className="text-gray-600 text-sm">Share your expertise and guide others</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setRole('entrepreneur');
                  setCurrentScreen('entrepreneur-attributes');
                }}
                className="p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white">
                    <FiBook size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-lg text-gray-800">Aspiring Entrepreneur</h3>
                    <p className="text-gray-600 text-sm">Find resources and connections to grow</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        );
        
      case 'mentor-attributes':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md mx-auto"
          >
            <motion.div variants={itemVariants} className="flex items-center mb-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentScreen('select-role')}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
              >
                <FiArrowLeft size={20} />
              </motion.button>
              <h2 className="text-2xl font-bold ml-2 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Professional Details
              </h2>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                <select
                  value={attributes.yearsOfExperience}
                  onChange={(e) => handleAttributeChange('yearsOfExperience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                >
                  <option value="">Select your experience</option>
                  <option value="0-1">Less than 1 year</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Field of Expertise</label>
                <select
                  value={attributes.expertise}
                  onChange={(e) => handleAttributeChange('expertise', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                >
                  <option value="">Select your expertise</option>
                  <option value="software-development">Software Development</option>
                  <option value="data-science">Data Science</option>
                  <option value="product-management">Product Management</option>
                  <option value="marketing">Marketing</option>
                  <option value="finance">Finance</option>
                  <option value="design">Design</option>
                  <option value="sales">Sales</option>
                  <option value="operations">Operations</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {/* Two-column layout for additional fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                  <input
                    type="number"
                    value={attributes.hourlyRate}
                    onChange={(e) => handleAttributeChange('hourlyRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                    placeholder="Enter your hourly rate"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Skills</label>
                  <input
                    type="text"
                    value={attributes.skills}
                    onChange={(e) => handleAttributeChange('skills', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                    placeholder="E.g., JavaScript, React"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Technologies Interested In</label>
                <input
                  type="text"
                  value={attributes.interestedTechnologies}
                  onChange={(e) => handleAttributeChange('interestedTechnologies', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                  placeholder="E.g., AI, Blockchain, Cloud"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mentorship Intent</label>
                  <select
                    value={attributes.mentorshipIntent}
                    onChange={(e) => handleAttributeChange('mentorshipIntent', e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                  >
                    <option value="">Want to mentor?</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Pricing</label>
                  <input
                    type="text"
                    value={attributes.pricing}
                    onChange={(e) => handleAttributeChange('pricing', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                    placeholder="E.g., $50-100/hour"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Mentorship Topics</label>
                <input
                  type="text"
                  value={attributes.mentorshipTopics}
                  onChange={(e) => handleAttributeChange('mentorshipTopics', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                  placeholder="E.g., Startup Strategy, Coding"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignUp}
                className="w-full py-3 px-6 mt-6 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg shadow-md text-white font-medium hover:shadow-lg transition-shadow"
              >
                Complete Sign Up
              </motion.button>
            </motion.div>
          </motion.div>
        );
        
      case 'entrepreneur-attributes':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md mx-auto"
          >
            <motion.div variants={itemVariants} className="flex items-center mb-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentScreen('select-role')}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
              >
                <FiArrowLeft size={20} />
              </motion.button>
              <h2 className="text-2xl font-bold ml-2 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Entrepreneur Details
              </h2>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Areas of Interest</label>
                <select
                  value={attributes.interests}
                  onChange={(e) => handleAttributeChange('interests', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                >
                  <option value="">Select your interest</option>
                  <option value="tech">Technology</option>
                  <option value="health">Health & Wellness</option>
                  <option value="finance">Finance & Fintech</option>
                  <option value="education">Education</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="sustainability">Sustainability</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Skill Set</label>
                <select
                  value={attributes.skillSet}
                  onChange={(e) => handleAttributeChange('skillSet', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                >
                  <option value="">Select your primary skill</option>
                  <option value="technical">Technical (Coding, Engineering)</option>
                  <option value="design">Design (UI/UX, Graphics)</option>
                  <option value="business">Business (Strategy, Operations)</option>
                  <option value="marketing">Marketing & Sales</option>
                  <option value="content">Content Creation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Collaboration Preferences</label>
                  <select
                    value={attributes.collaborationPreferences}
                    onChange={(e) => handleAttributeChange('collaborationPreferences', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                  >
                    <option value="">Select preference</option>
                    <option value="co-founder">Co-founder</option>
                    <option value="freelancer">Freelancer</option>
                    <option value="employee">Employee</option>
                    <option value="advisor">Advisor</option>
                    <option value="multiple">Multiple Options</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Budget Range</label>
                  <select
                    value={attributes.budgetRange}
                    onChange={(e) => handleAttributeChange('budgetRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                  >
                    <option value="">Select budget</option>
                    <option value="bootstrap">Bootstrapped</option>
                    <option value="seed">Seed ($10K-$100K)</option>
                    <option value="angel">Angel ($100K-$500K)</option>
                    <option value="series-a">Series A ($500K+)</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Availability</label>
                  <select
                    value={attributes.availabilityPreferences}
                    onChange={(e) => handleAttributeChange('availabilityPreferences', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                  >
                    <option value="">Select availability</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="weekends">Weekends Only</option>
                    <option value="flexible">Flexible Hours</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Preferred Topics</label>
                  <input
                    type="text"
                    value={attributes.preferredTopics}
                    onChange={(e) => handleAttributeChange('preferredTopics', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                    placeholder="E.g., AI, Web3, SaaS"
                  />
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignUp}
                className="w-full py-3 px-6 mt-6 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg shadow-md text-white font-medium hover:shadow-lg transition-shadow"
              >
                Complete Sign Up
              </motion.button>
            </motion.div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
          {/* Home button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 p-2 rounded-full text-gray-600 hover:bg-gray-100 flex items-center gap-1"
          >
            <FiHome size={20} />
            <span className="text-sm">Home</span>
          </motion.button>
          
          <AnimatePresence mode="wait">
            {renderScreen()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Signup;
