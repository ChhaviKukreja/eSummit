import React, { useState, useEffect, useContext, createContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { FiUsers, FiUserPlus, FiUser, FiTrendingUp, FiBook, FiMenu } from 'react-icons/fi';

// Create a context for sharing state between components
const EntrepreneurContext = createContext();

const EntrepreneurDashboard = () => {
  const [activeTab, setActiveTab] = useState('mentors');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [socket, setSocket] = useState(null);
  const [activeSessions, setActiveSessions] = useState({});

  // Connect to socket server
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Get user info from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.email);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }

    // Listen for session start notifications
    newSocket.on('session_started', (data) => {
      console.log('Session started by mentor:', data);
      setActiveSessions(prev => ({
        ...prev,
        [data.mentorId]: data.meetingId
      }));
    });

    // Clean up socket connection
    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  return (
    <EntrepreneurContext.Provider value={{ activeSessions, socket, userId }}>
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
              {isMobileMenuOpen ? <FiUser size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:flex md:w-64 bg-gray-900 border-r border-gray-700 flex-col">
            <nav className="flex-1 py-6 px-4">
              <ul className="space-y-2">
                {[
                  { id: 'mentors', label: 'Find Mentors', icon: <FiUsers size={20} /> },
                  { id: 'cofounders', label: 'Find Co-Founders', icon: <FiUserPlus size={20} /> },
                  { id: 'hype-cycle', label: 'Hype Cycle', icon: <FiTrendingUp size={20} /> },
                  { id: 'tech-stack', label: 'Tech Stack', icon: <FiBook size={20} /> },
                ].map((item) => (
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
                    <FiUser size={24} />
                  </button>
                </div>
                <ul className="space-y-2">
                  {[
                    { id: 'mentors', label: 'Find Mentors', icon: <FiUsers size={20} /> },
                    { id: 'cofounders', label: 'Find Co-Founders', icon: <FiUserPlus size={20} /> },
                    { id: 'hype-cycle', label: 'Hype Cycle', icon: <FiTrendingUp size={20} /> },
                    { id: 'tech-stack', label: 'Tech Stack', icon: <FiBook size={20} /> },
                  ].map((item) => (
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
              {(() => {
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
              })()}
            </div>
          </main>
        </div>
      </div>
    </EntrepreneurContext.Provider>
  );
};

// Mentor Section Component
const MentorSection = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const navigate = useNavigate();
  const { activeSessions } = useContext(EntrepreneurContext);

  // Fetch mentors from the database
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        // In a real app, you would fetch from your API
        // const response = await axios.get('http://localhost:5000/users/mentors', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // setMentors(response.data);
        
        // For now, we'll use hardcoded data
        setMentors([
          {
            id: 1,
            name: 'Satish Kumar',
            role: 'Product Manager',
            expertise: 'SaaS Products',
            experience: '8 years',
            price: '$120/hour',
            image: 'https://etimg.etb2bimg.com/photo/112985420.cms',
            rating: 4.8,
            reviews: 98,
            bio: 'Experienced product manager with a passion for building scalable SaaS products. I have helped multiple startups go from idea to product-market fit.',
            achievements: ['Led product development at 2 successful startups', 'Mentor at TechStars', 'Published author on product management'],
            education: 'MBA from IIM Bangalore',
            industry: 'Technology'
          },
          {
            id: 2,
            name: 'Abhinay Varsh',
            role: 'Tech Entrepreneur',
            expertise: 'AI & Machine Learning',
            experience: '10+ years',
            price: '$150/hour',
            image: 'https://tse3.mm.bing.net/th?id=OIP.XVAylWWQ4gKp8try6n4JRQHaEW&pid=Api&P=0&h=180',
            rating: 4.9,
            reviews: 124,
            bio: 'AI/ML expert with experience building and scaling AI-powered products. I help entrepreneurs navigate the complex world of artificial intelligence.',
            achievements: ['Founded AI startup acquired by Google', 'Published 15+ research papers', 'Speaker at major tech conferences'],
            education: 'PhD in Computer Science from IIT Delhi',
            industry: 'Artificial Intelligence'
          },
          {
            id: 3,  
            name: 'Neha Aggarwal',
            role: 'Startup Advisor',
            expertise: 'Fundraising & Growth',
            experience: '12 years',
            price: '$200/hour',
            image: 'https://tse4.mm.bing.net/th?id=OIP.gLl5eo35Jvx67W1ipHPzqAEgDY&pid=Api&P=0&h=180',
            rating: 4.9,
            reviews: 156,
            bio: 'Startup advisor with extensive experience in fundraising and scaling startups. I have helped companies raise over $50M in venture capital.',
            achievements: ['Partner at leading VC firm', 'Board member of 5 startups', 'Angel investor in 20+ companies'],
            education: 'MBA from Harvard Business School',
            industry: 'Venture Capital'
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching mentors:', error);
        setLoading(false);
      }
    };
    
    fetchMentors();
  }, []);

  const handleBookSession = (mentorId) => {
    navigate(`/mentor-chat/${mentorId}`);
  };

  const handleJoinSession = (meetingId) => {
    navigate(`/meeting/${meetingId}`);
  };

  const handleViewProfile = (mentor) => {
    setSelectedMentor(mentor);
    setShowProfileModal(true);
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <select className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 outline-none bg-white text-gray-800">
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>
          </div>
          <div className="w-full md:w-auto flex items-end">
            <button className="w-full md:w-auto px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
              Apply Filters
            </button>
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
                    <span className="text-yellow-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      {mentor.rating}
                    </span>
                    <span className="text-gray-500 text-xs ml-1">({mentor.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">{mentor.expertise}</span>
                  <span className="text-purple-600 font-bold">{mentor.price}</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">{mentor.experience} experience</p>
              </div>
              
              <div className="mt-6 flex gap-2">
                <button 
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all shadow-sm hover:shadow ${
                    activeSessions[mentor.id] ? 
                    'bg-green-600 text-white hover:bg-green-700 animate-pulse' : 
                    'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                  onClick={() => handleBookSession(mentor.id)}
                >
                  {activeSessions[mentor.id] ? 'Join Now' : 'Book Session'}
                </button>
                <button 
                  className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md font-medium transition-colors"
                  onClick={() => openProfileModal(mentor)}
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      {/* Mentor Profile Modal */}
      {showProfileModal && selectedMentor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-4">
                        Mentor Profile
                      </h3>
                      <button
                        onClick={() => setShowProfileModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FiUser size={24} />
                      </button>
                    </div>

                    <div className="mt-2">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                          <img 
                            src={selectedMentor.image} 
                            alt={selectedMentor.name}
                            className="w-full h-auto rounded-lg object-cover"
                          />
                          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                            <p className="text-gray-700 mb-1">Industry: {selectedMentor.industry}</p>
                            <p className="text-gray-700 mb-1">Rate: {selectedMentor.price}</p>
                            <div className="flex items-center mt-2">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(selectedMentor.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                  </svg>
                                ))}
                              </div>
                              <span className="text-gray-600 text-sm ml-2">{selectedMentor.rating} ({selectedMentor.reviews} reviews)</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:w-2/3">
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedMentor.name}</h2>
                          <p className="text-gray-700 mb-4">{selectedMentor.role} • {selectedMentor.experience} experience</p>
                          
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                            <p className="text-gray-700">{selectedMentor.bio}</p>
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-2">Expertise</h4>
                            <p className="text-gray-700">{selectedMentor.expertise}</p>
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                            <p className="text-gray-700">{selectedMentor.education}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Achievements</h4>
                            <ul className="list-disc pl-5 text-gray-700">
                              {selectedMentor.achievements.map((achievement, index) => (
                                <li key={index}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {activeSessions && activeSessions[selectedMentor.id] ? (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setShowProfileModal(false);
                      handleJoinSession(activeSessions[selectedMentor.id]);
                    }}
                  >
                    Join Session
                  </button>
                ) : (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setShowProfileModal(false);
                      handleBookSession(selectedMentor.id);
                    }}
                  >
                    Book Session
                  </button>
                )}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowProfileModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Co-Founder Section Component
const CoFounderSection = () => {
  const [cofounders, setCofounders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCofounder, setSelectedCofounder] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();

  // Fetch co-founders from the database
  useEffect(() => {
    const fetchCofounders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        // In a real app, you would fetch from your API
        // const response = await axios.get('http://localhost:5000/users/entrepreneurs', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // setCofounders(response.data);
        
        // For now, we'll use hardcoded data
        setCofounders([
          {
            id: 1,
            name: 'Rahul Sharma',
            role: 'Full Stack Developer',
            skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
            lookingFor: 'Business Co-founder',
            idea: 'A platform for connecting remote workers with local co-working spaces on-demand.',
            image: 'https://www.founderjar.com/wp-content/uploads/2022/09/2.-Farrhad-Acidwalla.jpeg',
            location: 'Bangalore, India',
            experience: '5 years',
            education: 'B.Tech in Computer Science from IIT Bombay',
            bio: 'Passionate developer with experience in building scalable web applications. Looking for a business-minded co-founder to help bring my idea to market.',
            achievements: ['Built and sold a SaaS product', 'Winner of AngelHack 2022', 'Open source contributor']
          },
          {
            id: 2,
            name: 'Priya Patel',
            role: 'Marketing Specialist',
            skills: ['Digital Marketing', 'Content Strategy', 'SEO', 'Social Media'],
            lookingFor: 'Technical Co-founder',
            idea: 'An AI-powered content creation tool for small businesses.',
            image: 'https://www.founderjar.com/wp-content/uploads/2022/09/7.-Divya-Gandotra-Tandon.jpeg',
            location: 'Mumbai, India',
            experience: '7 years',
            education: 'MBA from XLRI Jamshedpur',
            bio: 'Marketing expert with experience working with startups and Fortune 500 companies. Looking for a technical co-founder to build an AI-powered content creation tool.',
            achievements: ['Led marketing for a unicorn startup', 'Increased conversion rates by 300%', 'Speaker at marketing conferences']
          },
          {
            id: 3,
            name: 'Vikram Singh',
            role: 'Product Manager',
            skills: ['Product Strategy', 'UX Design', 'Data Analysis', 'Agile'],
            lookingFor: 'Technical & Marketing Co-founders',
            idea: 'A healthcare app that connects patients with doctors for virtual consultations.',
            image: 'https://www.founderjar.com/wp-content/uploads/2022/09/5.-Trishneet-Arora.jpeg',
            location: 'Delhi, India',
            experience: '6 years',
            education: 'MBA from ISB Hyderabad',
            bio: 'Product manager with experience in healthcare technology. Looking for technical and marketing co-founders to build a telemedicine platform.',
            achievements: ['Launched 5 successful products', 'Managed $10M product budget', 'Filed 2 patents']
          },
          {
            id: 4,
            name: 'Ananya Desai',
            role: 'UX/UI Designer',
            skills: ['UI Design', 'User Research', 'Prototyping', 'Figma'],
            lookingFor: 'Technical Co-founder',
            idea: 'A platform for independent designers to showcase and sell their work.',
            image: 'https://static.startuptalky.com/2022/03/Shradha-Sharma-YourStory-StartupTalky.jpg',
            location: 'Pune, India',
            experience: '4 years',
            education: 'BDes from NID Ahmedabad',
            bio: 'UX/UI designer passionate about creating beautiful and functional digital experiences. Looking for a technical co-founder to build a platform for independent designers.',
            achievements: ['Designed apps with over 1M users', 'Design mentor at DesignX', 'Won multiple design awards']
          }
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching co-founders:', error);
        setLoading(false);
      }
    };
    
    fetchCofounders();
  }, []);

  const handleConnect = (cofounderId) => {
    // In a real app, you would send a connection request
    console.log(`Connecting with co-founder ${cofounderId}`);
  };

  const handleViewProfile = (cofounder) => {
    setSelectedCofounder(cofounder);
    setShowProfileModal(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">Find Your Co-Founder</h2>
      <p className="text-gray-300 mb-8">
        Connect with potential co-founders who complement your skills and share your passion.
        Find the perfect partner to build your startup and turn your ideas into reality.
      </p>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cofounders.map((cofounder) => (
            <div key={cofounder.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={cofounder.image} 
                    alt={cofounder.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{cofounder.name}</h3>
                    <p className="text-gray-600">{cofounder.role}</p>
                    <p className="text-gray-500 text-sm">{cofounder.location}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Looking for:</h4>
                  <p className="text-gray-700 bg-purple-50 px-3 py-1 rounded-full inline-block">{cofounder.lookingFor}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Startup Idea:</h4>
                  <p className="text-gray-700">{cofounder.idea}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {cofounder.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-6">
                  <button 
                    className="flex-1 bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 py-2 px-4 rounded-md font-medium transition-all shadow-sm hover:shadow"
                    onClick={() => handleConnect(cofounder.id)}
                  >
                    Connect
                  </button>
                  <button 
                    className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md font-medium transition-colors"
                    onClick={() => handleViewProfile(cofounder)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Co-founder Profile Modal */}
      {showProfileModal && selectedCofounder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-4">
                        Co-founder Profile
                      </h3>
                      <button
                        onClick={() => setShowProfileModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FiUser size={24} />
                      </button>
                    </div>

                    <div className="mt-2">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                          <img 
                            src={selectedCofounder.image} 
                            alt={selectedCofounder.name}
                            className="w-full h-auto rounded-lg object-cover"
                          />
                          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                            <p className="text-gray-700 mb-1">Location: {selectedCofounder.location}</p>
                            <p className="text-gray-700 mb-1">Experience: {selectedCofounder.experience}</p>
                            <p className="text-gray-700">Education: {selectedCofounder.education}</p>
                          </div>
                        </div>
                        
                        <div className="md:w-2/3">
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCofounder.name}</h2>
                          <p className="text-gray-700 mb-4">{selectedCofounder.role}</p>
                          
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                            <p className="text-gray-700">{selectedCofounder.bio}</p>
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-2">Startup Idea</h4>
                            <p className="text-gray-700">{selectedCofounder.idea}</p>
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-2">Looking For</h4>
                            <p className="text-gray-700">{selectedCofounder.lookingFor}</p>
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedCofounder.skills.map((skill, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Achievements</h4>
                            <ul className="list-disc pl-5 text-gray-700">
                              {selectedCofounder.achievements.map((achievement, index) => (
                                <li key={index}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowProfileModal(false);
                    handleConnect(selectedCofounder.id);
                  }}
                >
                  Connect
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowProfileModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
