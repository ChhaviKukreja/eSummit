import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiTrendingUp, FiAward, FiUser, FiMenu, FiX, FiHome, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const ProfessionalDashboard = () => {
  const [activeTab, setActiveTab] = useState('mentorship');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items
  const navItems = [
    { id: 'mentorship', label: 'Mentorship Program', icon: <FiAward size={20} /> },
    { id: 'career-paths', label: 'Career Paths', icon: <FiTrendingUp size={20} /> },
    { id: 'profile', label: 'My Profile', icon: <FiUser size={20} /> },
  ];

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'mentorship':
        return <MentorshipSection />;
      case 'career-paths':
        return <CareerPathsSection />;
      case 'profile':
        return <ProfileSection />;
      default:
        return <MentorshipSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 shadow-md border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">
              Professional Dashboard
            </h1>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-300 hover:bg-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex md:w-64 bg-gray-900 border-r border-gray-700 flex-col">
          <nav className="flex-1 py-6 px-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-white border border-purple-500 text-purple-700'
                        : 'bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span className={`mr-3 ${activeTab === item.id ? 'text-purple-600' : 'text-gray-300'}`}>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
            <nav className="relative flex flex-col w-80 max-w-[calc(100%-4rem)] h-full py-6 px-4 bg-gray-900 border-r border-gray-700 overflow-y-auto">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">Menu</h2>
                <button 
                  className="p-2 rounded-md text-gray-300 hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiX size={24} />
                </button>
              </div>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-white border border-purple-500 text-purple-700'
                          : 'bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <span className={`mr-3 ${activeTab === item.id ? 'text-purple-600' : 'text-gray-300'}`}>{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-900 to-purple-900 p-6">
          <div className="container mx-auto">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

// Mentorship Section Component
const MentorshipSection = () => {
  const [activeView, setActiveView] = useState('apply');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to the backend
    // For now, we'll just show the success alert
    setShowAlert(true);
    // Hide the alert after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleStartSession = async (entrepreneurId) => {
    try {
      // Generate a unique meeting ID using UUID
      const meetingId = uuidv4();
      
      // In a real application, you would save this meeting to the database
      // and notify the entrepreneur that a session has started
      // For now, we'll just navigate to the meeting
      
      // Simulate API call to create a meeting
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // This would be the actual API call in a real application
          // await axios.post('http://localhost:5000/mentor/meetings/start', {
          //   entrepreneurId,
          //   meetingId
          // }, {
          //   headers: { Authorization: `Bearer ${token}` }
          // });
          
          console.log(`Created meeting with ID: ${meetingId} for entrepreneur: ${entrepreneurId}`);
          
          // Navigate to the meeting room
          navigate(`/meeting/${meetingId}`);
        } catch (error) {
          console.error('Error creating meeting:', error);
        }
      } else {
        console.error('No authentication token found');
      }
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">Mentorship Program</h2>
      <p className="text-gray-300 mb-8">
        Share your expertise with aspiring entrepreneurs. Apply to become a mentor and
        create structured mentorship programs to help others succeed.
      </p>

      {/* Success Alert */}
      {showAlert && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 flex items-center justify-between" role="alert">
          <div>
            <span className="font-bold">Success! </span>
            <span className="block sm:inline">Form submitted successfully. We'll review your application shortly.</span>
          </div>
          <button 
            onClick={() => setShowAlert(false)}
            className="text-green-700 hover:text-green-900"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"/>
            </svg>
          </button>
        </div>
      )}

      {/* Toggle between apply and manage views */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveView('apply')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeView === 'apply'
                ? 'bg-white border border-purple-600 text-purple-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Apply as Mentor
          </button>
          <button
            onClick={() => setActiveView('manage')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeView === 'manage'
                ? 'bg-white border border-purple-600 text-purple-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Manage Programs
          </button>
        </div>
      </div>

      {/* Apply as Mentor Form */}
      {activeView === 'apply' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Mentor Application</h3>
          <p className="text-gray-600 mb-6">
            Fill out the form below to apply as a mentor. Our team will review your application
            and get back to you within 48 hours.
          </p>

          <form className="space-y-4" onSubmit={handleSubmitApplication}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expertise</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 outline-none bg-white text-gray-800">
                  <option value="">Select your expertise</option>
                  <option value="tech">Technology</option>
                  <option value="business">Business Strategy</option>
                  <option value="marketing">Marketing</option>
                  <option value="product">Product Management</option>
                  <option value="finance">Finance</option>
                  <option value="design">Design</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 outline-none bg-white text-gray-800" 
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (USD)</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 outline-none bg-white text-gray-800" 
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 outline-none bg-white text-gray-800" 
                  rows="4"
                  placeholder="Tell entrepreneurs about your background and how you can help them..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mentorship Approach</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 outline-none bg-white text-gray-800" 
                  rows="3"
                  placeholder="Describe your mentorship style and approach..."
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button 
                type="button"
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-6 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 py-2 px-6 rounded-md font-medium transition-all shadow-sm hover:shadow"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Manage Mentorship Programs */}
      {activeView === 'manage' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Your Mentorship Programs</h3>
          
          {/* Entrepreneurs List */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-700 mb-4">Entrepreneurs Under Your Mentorship</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Entrepreneur Card 1 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <img 
                      src="https://images.yourstory.com/cs/1/39b69590-716a-11e9-995c-171c030e4eb8/1396731559746268747.jpg?fm=png&auto=format&w=800&blur=500" 
                      alt="Entrepreneur" 
                      className="w-12 h-12 rounded-full object-cover mr-3" 
                    />
                    <div>
                      <h5 className="font-medium text-gray-800">Tarun Arora</h5>
                      <p className="text-sm text-gray-600">AI Startup Founder</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-700">Working on an AI-powered content generation platform for marketing teams.</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Tech</span>
                    <button 
                      onClick={() => handleStartSession('john-smith')}
                      className="bg-white border border-green-600 text-green-600 hover:bg-green-50 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                    >
                      Start Session
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Entrepreneur Card 2 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <img 
                      src="https://static.startuptalky.com/2022/03/Aparajita-Amar-SHLC-StartupTalky.jpg" 
                      alt="Entrepreneur" 
                      className="w-12 h-12 rounded-full object-cover mr-3" 
                    />
                    <div>
                      <h5 className="font-medium text-gray-800">Sakshi Verma</h5>
                      <p className="text-sm text-gray-600">FinTech Entrepreneur</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-700">Developing a personal finance app for young professionals with automated savings features.</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Finance</span>
                    <button 
                      onClick={() => handleStartSession('emily-chen')}
                      className="bg-white border border-green-600 text-green-600 hover:bg-green-50 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                    >
                      Start Session
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Entrepreneur Card 3 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <img 
                      src="https://www.founderjar.com/wp-content/uploads/2022/09/Bhavish-Agarwal-Best-Young-Indian-Entrepreneur.jpeg" 
                      alt="Entrepreneur" 
                      className="w-12 h-12 rounded-full object-cover mr-3" 
                    />
                    <div>
                      <h5 className="font-medium text-gray-800">Bhavish Aggarwal</h5>
                      <p className="text-sm text-gray-600">E-commerce Founder</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-700">Building a sustainable fashion marketplace connecting eco-friendly brands with conscious consumers.</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Retail</span>
                    <button 
                      onClick={() => handleStartSession('michael-rodriguez')}
                      className="bg-white border border-green-600 text-green-600 hover:bg-green-50 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                    >
                      Start Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Create New Program Button */}
          <div className="text-center">
            <button className="bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 py-2 px-6 rounded-md font-medium transition-all shadow-sm hover:shadow">
              Create New Program
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Career Paths Section Component
const CareerPathsSection = () => {
  const careerPaths = [
    {
      id: 1,
      title: 'AI/ML Specialist',
      description: 'Leverage your technical skills to specialize in artificial intelligence and machine learning applications.',
      hypeStage: 'Peak of Inflated Expectations',
      growthRate: 'High',
      demandLevel: 85,
      skills: ['Python', 'TensorFlow', 'Data Analysis', 'Neural Networks']
    },
    {
      id: 2,
      title: 'Blockchain Developer',
      description: 'Build decentralized applications and smart contracts on blockchain platforms.',
      hypeStage: 'Trough of Disillusionment',
      growthRate: 'Moderate',
      demandLevel: 78,
      skills: ['Solidity', 'Smart Contracts', 'Distributed Systems', 'Cryptography']
    },
    {
      id: 3,
      title: 'Quantum Computing Researcher',
      description: 'Research and develop quantum algorithms and applications for next-generation computing.',
      hypeStage: 'Innovation Trigger',
      growthRate: 'Emerging',
      demandLevel: 65,
      skills: ['Quantum Mechanics', 'Linear Algebra', 'Quantum Algorithms', 'Physics']
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">Career Path Insights</h2>
      <p className="text-gray-300 mb-8">
        Explore emerging career paths based on technology trends and market demand.
        The Gartner Hype Cycle provides a graphical representation of the maturity and adoption of technologies and applications.
        Use this insight to make strategic career decisions.
      </p>

      {/* Hype Cycle Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Technology Hype Cycle Position</h3>
        <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center mb-4">
          <p className="text-gray-500">Interactive hype cycle visualization coming soon</p>
        </div>
        <p className="text-gray-600 text-sm">
          The Gartner Hype Cycle provides a graphical representation of the maturity and adoption of technologies and applications.
          Use this insight to make strategic career decisions.
        </p>
      </div>

      {/* Career Path Cards */}
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Recommended Career Paths</h3>
      <div className="space-y-6">
        {careerPaths.map((path) => (
          <div key={path.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-lg">{path.title}</h4>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  path.hypeStage === 'Peak of Inflated Expectations' ? 'bg-purple-100 text-purple-700' :
                  path.hypeStage === 'Trough of Disillusionment' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {path.hypeStage}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{path.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Growth Rate</h5>
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${
                      path.growthRate === 'High' ? 'bg-green-500' :
                      path.growthRate === 'Moderate' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></span>
                    <span>{path.growthRate}</span>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Demand Level</h5>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${path.demandLevel}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Key Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {path.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-white border border-purple-600 text-purple-600 font-medium rounded-md shadow-sm hover:bg-purple-50 hover:shadow-md transition-all">
                  Explore Path
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Profile Section Component
const ProfileSection = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">My Professional Profile</h2>
      <p className="text-gray-300 mb-8">
        Manage your professional profile, showcase your expertise, and track your mentorship activities.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center">
            <img 
              src="https://etimg.etb2bimg.com/photo/112985420.cms" 
              alt="Profile" 
              className="w-32 h-32 rounded-full mb-4 border border-gray-300" 
            />
              {/* <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-gray-400">
                <FiUser size={48} />
              </div> */}
              <h3 className="font-bold text-xl mb-1">Satish Kumar</h3>
              <p className="text-gray-600 mb-4">Tech Entrepreneur</p>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Edit Profile
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-800 mb-3">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-700">Email:</span>
                  <span>satish.kumar@gmail.com</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-700">Location:</span>
                  <span>Delhi, India</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-700">Member Since:</span>
                  <span>March 2025</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Expertise and Skills */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Expertise & Skills</h3>
            
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">Areas of Expertise</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Software Development</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Cloud Architecture</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">DevOps</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">System Design</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Technical Skills</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">AI/ML</span>
                    <span className="text-sm text-gray-700">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">React & React Native</span>
                    <span className="text-sm text-gray-700">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Node.js</span>
                    <span className="text-sm text-gray-700">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">AWS/Cloud Services</span>
                    <span className="text-sm text-gray-700">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mentorship Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Mentorship Statistics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <h4 className="text-2xl font-bold text-purple-700">3</h4>
                <p className="text-sm text-gray-700">Active Mentees</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <h4 className="text-2xl font-bold text-blue-700">7</h4>
                <p className="text-sm text-gray-700">Sessions Completed</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <h4 className="text-2xl font-bold text-green-700">23</h4>
                <p className="text-sm text-gray-700">Hours Mentored</p>
              </div>
            </div>
            
            {/* <div className="text-center">
              <p className="text-gray-600 mb-4">
                You haven't started mentoring yet. Apply to become a mentor to start helping entrepreneurs succeed!
              </p>
              <button 
                onClick={() => setActiveTab('mentorship')}
                className="px-6 py-2 bg-white border border-purple-600 text-purple-600 font-medium rounded-md hover:bg-purple-50 transition-all shadow-sm hover:shadow"
              >
                Apply as Mentor
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
