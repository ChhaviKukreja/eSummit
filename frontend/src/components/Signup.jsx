import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiArrowLeft, FiBriefcase, FiBook, FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  // Navigation
  const navigate = useNavigate();
  
  // Auth context
  const { login, register, error: authError } = useAuth();
  
  // State to track which screen to show
  const [currentScreen, setCurrentScreen] = useState('auth-choice');
  
  // State for user inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  
  // Form error state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Additional attributes based on role
  const [attributes, setAttributes] = useState({
    // Common attributes for both roles
    industry: 'Technology',
    skills: '',
    bio: '',
    
    // For mentors
    expertise: '',
    yearsOfExperience: '',
    
    // For entrepreneurs
    startupIdea: '',
    fundingStage: '',
  });
  
  // Handle attribute changes
  const handleAttributeChange = (field, value) => {
    setAttributes({
      ...attributes,
      [field]: value,
    });
  };

  // Handle form submission for sign in
  const handleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      if (!email || !password) {
        throw new Error('Please fill in all required fields');
      }
      
      await login({ email, password });
      // If successful, the auth context will redirect to dashboard
    } catch (err) {
      // Handle different types of error responses
      if (err.error && typeof err.error === 'object') {
        // Handle validation errors from backend
        const errorMessages = Object.values(err.error).join(', ');
        setError(errorMessages || 'Sign in failed. Please check your credentials.');
      } else if (err.msg) {
        // Handle custom error messages from backend
        setError(err.msg);
      } else {
        // Handle other errors
        setError(err.message || 'Sign in failed. Please try again.');
      }
      console.error('Signin error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle sign up logic
  const handleSignUp = async () => {
    setError('');
    setLoading(true);
    
    try {
      if (!username || !email || !password || !role) {
        throw new Error('Please fill in all required fields');
      }
      
      // Validate password meets requirements
      const passwordRegex = {
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        number: /[0-9]/
      };
      
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }
      
      if (!passwordRegex.uppercase.test(password)) {
        throw new Error('Password must include at least one uppercase letter');
      }
      
      if (!passwordRegex.lowercase.test(password)) {
        throw new Error('Password must include at least one lowercase letter');
      }
      
      if (!passwordRegex.number.test(password)) {
        throw new Error('Password must include at least one number');
      }
      
      // Split name properly
      const nameParts = username.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : firstName; // Use firstName as lastName if not provided
      
      // Validate name lengths
      if (firstName.length < 2) {
        throw new Error('First name must have at least 2 characters');
      }
      
      if (lastName.length < 2) {
        throw new Error('Last name must have at least 2 characters');
      }
      
      // Prepare skills array from comma-separated string if needed
      let skillsArray = attributes.skills;
      if (typeof attributes.skills === 'string') {
        skillsArray = attributes.skills.split(',').map(skill => skill.trim()).filter(Boolean);
      }
      
      const userData = {
        firstName,
        lastName,
        email,
        password,
        confirmPassword: password,
        role: role === 'mentor' ? 'mentor' : 'entrepreneur',
        industry: attributes.industry || 'Technology',
        skills: skillsArray,
        bio: attributes.bio || '',
      };
      
      // Add role-specific fields
      if (role === 'mentor') {
        userData.expertise = attributes.expertise;
        userData.yearsOfExperience = attributes.yearsOfExperience;
      } else {
        userData.startupIdea = attributes.startupIdea;
        userData.fundingStage = attributes.fundingStage;
      }
      
      await register(userData);
      // If successful, the auth context will redirect to dashboard
    } catch (err) {
      // Handle different types of error responses
      if (err.error && typeof err.error === 'object') {
        // Handle Zod validation errors from backend
        const errorMessages = Object.values(err.error).join(', ');
        setError(errorMessages || 'Sign up failed. Please check your information.');
      } else if (err.msg) {
        // Handle custom error messages from backend
        setError(err.msg);
      } else {
        // Handle other errors
        setError(err.message || 'Sign up failed. Please try again.');
      }
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
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
            
            {(error || authError) && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg"
              >
                {error || authError}
              </motion.div>
            )}
            
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
                disabled={loading}
                className={`w-full py-3 px-6 mt-6 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg shadow-md text-white font-medium hover:shadow-lg transition-shadow ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Signing In...' : 'Sign In'}
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
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg"
              >
                {error}
              </motion.div>
            )}
            
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
                <label className="block text-sm font-medium text-gray-700">Expertise</label>
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
              
              {/* Common fields for both roles */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <select
                  value={attributes.industry}
                  onChange={(e) => handleAttributeChange('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                >
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={attributes.skills}
                  onChange={(e) => handleAttributeChange('skills', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                  placeholder="E.g., JavaScript, React, Node.js"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={attributes.bio}
                  onChange={(e) => handleAttributeChange('bio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                  placeholder="Tell us about yourself"
                  rows="3"
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
                <label className="block text-sm font-medium text-gray-700">Startup Idea</label>
                <input
                  type="text"
                  value={attributes.startupIdea}
                  onChange={(e) => handleAttributeChange('startupIdea', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter your startup idea"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Funding Stage</label>
                <select
                  value={attributes.fundingStage}
                  onChange={(e) => handleAttributeChange('fundingStage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                >
                  <option value="">Select funding stage</option>
                  <option value="bootstrap">Bootstrapped</option>
                  <option value="seed">Seed ($10K-$100K)</option>
                  <option value="angel">Angel ($100K-$500K)</option>
                  <option value="series-a">Series A ($500K+)</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              
              {/* Common fields for both roles */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <select
                  value={attributes.industry}
                  onChange={(e) => handleAttributeChange('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                >
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={attributes.skills}
                  onChange={(e) => handleAttributeChange('skills', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                  placeholder="E.g., JavaScript, React, Node.js"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={attributes.bio}
                  onChange={(e) => handleAttributeChange('bio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                  placeholder="Tell us about yourself"
                  rows="3"
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
