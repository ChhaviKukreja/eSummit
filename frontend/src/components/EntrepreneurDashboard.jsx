import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiTrendingUp, FiSearch, FiBook, FiMenu, FiX, FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const EntrepreneurDashboard = () => {
  const [activeTab, setActiveTab] = useState('mentors');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items
  const navItems = [
    { id: 'mentors', label: 'Find Mentors', icon: <FiUsers size={20} /> },
    { id: 'cofounders', label: 'Find Co-Founders', icon: <FiSearch size={20} /> },
    { id: 'hype-cycle', label: 'Hype Cycle', icon: <FiTrendingUp size={20} /> },
    { id: 'tech-stack', label: 'Tech Stack', icon: <FiBook size={20} /> },
  ];

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'mentors':
        return <MentorSection />;
      case 'cofounders':
        return <CoFounderSection />;
      case 'hype-cycle':
        return <HypeCycleSection />;
      case 'tech-stack':
        return <TechStackSection />;
      default:
        return <MentorSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 shadow-md border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">
              Entrepreneur Dashboard
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

// Mentor Section Component
const MentorSection = () => {
  const mentors = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Tech Entrepreneur',
      expertise: 'AI & Machine Learning',
      experience: '10+ years',
      price: '$150/hour',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.9,
      reviews: 124,
    },
    {
      id: 2,
      name: 'Sarah Williams',
      role: 'Product Manager',
      expertise: 'SaaS Products',
      experience: '8 years',
      price: '$120/hour',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 4.8,
      reviews: 98,
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Startup Advisor',
      expertise: 'Fundraising & Growth',
      experience: '12 years',
      price: '$200/hour',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      rating: 4.9,
      reviews: 156,
    },
  ];

  const navigate = useNavigate();

  const handleBookSession = (mentorId) => {
    navigate(`/mentor-chat/${mentorId}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">Find Your Perfect Mentor</h2>
      <p className="text-gray-300 mb-8">
        Connect with experienced mentors who can guide you through your entrepreneurial journey.
        Book sessions, get personalized advice, and accelerate your growth.
      </p>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Expertise</label>
            <select className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 outline-none bg-white text-gray-800">
              <option value="">All Expertise</option>
              <option value="tech">Technology</option>
              <option value="business">Business Strategy</option>
              <option value="marketing">Marketing</option>
              <option value="fundraising">Fundraising</option>
            </select>
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <select className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 outline-none bg-white text-gray-800">
              <option value="">Any Price</option>
              <option value="low">$50-$100/hour</option>
              <option value="medium">$100-$150/hour</option>
              <option value="high">$150+/hour</option>
            </select>
          </div>
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <select className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 outline-none bg-white text-gray-800">
              <option value="">Any Time</option>
              <option value="week">This Week</option>
              <option value="weekend">Weekend</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mentor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex items-start">
                <img 
                  src={mentor.image} 
                  alt={mentor.name} 
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-purple-100" 
                />
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{mentor.name}</h3>
                  <p className="text-gray-600">{mentor.role}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(mentor.rating) ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm ml-1">
                      {mentor.rating} ({mentor.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Expertise:</span>
                  <span className="font-medium text-gray-800">{mentor.expertise}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium text-gray-800">{mentor.experience}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-purple-600">{mentor.price}</span>
                </div>
              </div>
              
              <div className="mt-6 flex gap-2">
                <button 
                  className="flex-1 bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 py-2 px-4 rounded-md font-medium transition-all shadow-sm hover:shadow"
                  onClick={() => handleBookSession(mentor.id)}
                >
                  Book Session
                </button>
                <button className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md font-medium transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Co-Founder Section Component
const CoFounderSection = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">Find Co-Founders</h2>
      <p className="text-gray-300 mb-8">
        Connect with potential co-founders who share your vision and complement your skills.
        Build your dream team and bring your ideas to life.
      </p>
      
      {/* Placeholder for co-founder search functionality */}
      <div className="bg-white border border-dashed border-gray-300 rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Co-Founder Marketplace Coming Soon</h3>
        <p className="text-gray-600">
          We're building a comprehensive co-founder matching platform. Check back soon for updates!
        </p>
      </div>
    </div>
  );
};

// Hype Cycle Section Component
const HypeCycleSection = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">Gartner Hype Cycle Insights</h2>
      <p className="text-gray-300 mb-8">
        Stay ahead of the curve with insights based on the latest technology hype cycles.
        Discover emerging technologies and trends to incorporate into your business.
      </p>
      
      {/* Placeholder for hype cycle visualization */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-medium mb-4 text-gray-700">2025 Technology Hype Cycle</h3>
        <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
          <p className="text-gray-600">Interactive hype cycle visualization coming soon</p>
        </div>
      </div>
      
      {/* Trending Technologies */}
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">Trending Technologies</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="p-6">
            <h4 className="font-bold text-lg mb-2 text-gray-800">Generative AI</h4>
            <p className="text-gray-600 mb-4">
              Generative AI is revolutionizing content creation, product design, and customer experiences.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded">Peak of Inflated Expectations</span>
              <button className="text-purple-600 hover:text-purple-800 font-medium">
                Learn More
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="p-6">
            <h4 className="font-bold text-lg mb-2 text-gray-800">Quantum Computing</h4>
            <p className="text-gray-600 mb-4">
              Quantum computing promises to solve complex problems that are beyond the capabilities of classical computers.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">Innovation Trigger</span>
              <button className="text-purple-600 hover:text-purple-800 font-medium">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tech Stack Section Component
const TechStackSection = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">Explore Tech Stack Options</h2>
      <p className="text-gray-300 mb-8">
        Discover the best technologies to power your startup based on your specific needs,
        industry trends, and scalability requirements.
      </p>
      
      {/* Tech Categories */}
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">Tech Categories</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="p-6">
            <h3 className="font-bold text-lg mb-3 text-gray-800">Frontend Technologies</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-gray-600">React.js</span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <span className="text-gray-600">Vue.js</span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                <span className="text-gray-600">Angular</span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                <span className="text-gray-600">Next.js</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="p-6">
            <h3 className="font-bold text-lg mb-3 text-gray-800">Backend Technologies</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-gray-600">Node.js</span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <span className="text-gray-600">Django</span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                <span className="text-gray-600">Ruby on Rails</span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                <span className="text-gray-600">Spring Boot</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="p-6">
            <h3 className="font-bold text-lg mb-3 text-gray-800">Database Solutions</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <span className="text-gray-600">PostgreSQL</span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-gray-600">MongoDB</span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                <span className="text-gray-600">Firebase</span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                <span className="text-gray-600">Redis</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Tech Stack Recommendation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Get Personalized Tech Stack Recommendations</h3>
        <p className="text-gray-600 mb-4">
          Answer a few questions about your project to receive tailored technology recommendations.
        </p>
        <button className="bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 py-2 px-6 rounded-md font-medium transition-all shadow-sm hover:shadow">
          Start Tech Assessment
        </button>
      </div>
    </div>
  );
};

export default EntrepreneurDashboard;
