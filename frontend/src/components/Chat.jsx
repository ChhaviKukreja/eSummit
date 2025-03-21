import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiVideo, FiCalendar, FiShare2, FiPlus, FiMic, FiMicOff, FiVideoOff, FiPhone } from 'react-icons/fi';
import io from 'socket.io-client';
import axios from 'axios';

const MentorChat = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const [isSending, setIsSending] = useState(false); // Add state to prevent duplicate sends

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

    // Clean up socket connection
    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  // Join chat room when socket and user IDs are available
  useEffect(() => {
    if (socket && userId && mentorId) {
      socket.emit('join_chat', { userId, receiverId: mentorId });

      // Listen for incoming messages
      socket.on('receive_message', (data) => {
        setMessages((prev) => [...prev, data]);
      });
    }
  }, [socket, userId, mentorId]);

  // Fetch mentor details
  useEffect(() => {
    const fetchMentor = async () => {
      try {
        // For demo purposes, if the mentor isn't found in the database,
        // we'll use hardcoded data based on the ID
        const mentorData = {
          1: {
            _id: 1,
            firstName: 'Satish',
            lastName: 'Kumar',
            industry: 'Technology',
            expertise: 'AI & Machine Learning',
            profilePicture: 'https://etimg.etb2bimg.com/photo/112985420.cms'
          },
          2: {
            _id: 2,
            firstName: 'Abhinay',
            lastName: 'Varsh',
            industry: 'SaaS',
            expertise: 'Product Management',
            profilePicture: 'https://tse3.mm.bing.net/th?id=OIP.XVAylWWQ4gKp8try6n4JRQHaEW&pid=Api&P=0&h=180'
          },
          3: {
            _id: 3,
            firstName: 'Neha',
            lastName: 'Aggarwal',
            industry: 'Venture Capital',
            expertise: 'Fundraising & Growth',
            profilePicture: 'https://tse4.mm.bing.net/th?id=OIP.gLl5eo35Jvx67W1ipHPzqAEgDY&pid=Api&P=0&h=180'
          }
        };

        try {
          // First try to get from API
          const response = await axios.get(`http://localhost:5000/mentor/mentors/${mentorId}`);
          setMentor(response.data);
        } catch (apiError) {
          console.log('Mentor not found in database, using demo data');
          // If API fails, use our hardcoded data
          if (mentorData[mentorId]) {
            setMentor(mentorData[mentorId]);
          } else {
            throw new Error('Mentor not found');
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching mentor:', error);
        setError('Could not find mentor information');
        setLoading(false);
      }
    };

    if (mentorId) {
      fetchMentor();
    }
  }, [mentorId]);

  // Fetch previous messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/mentor/chat/${mentorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        // Initialize with empty messages array if API fails
        setMessages([]);
      }
    };

    if (mentorId && userId) {
      fetchMessages();
    }
  }, [mentorId, userId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;
    
    // Set sending flag to prevent duplicate sends
    setIsSending(true);

    const messageData = {
      senderId: userId,
      receiverId: mentorId,
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    try {
      // Clear input field immediately to prevent duplicate submissions
      setNewMessage('');
      
      // Add message to local state immediately for better UX
      setMessages(prev => [...prev, messageData]);
      
      // Send message to socket
      socket.emit('send_message', messageData);

      // Save message to database
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/mentor/chat/send', {
        receiverId: mentorId,
        message: messageData.message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      // Reset sending flag after a short delay to prevent rapid clicking
      setTimeout(() => {
        setIsSending(false);
      }, 1000); // Increased delay to 1 second to further prevent duplicate sends
    }
  };

  const handleScheduleMeeting = () => {
    // Open meeting scheduler modal
    document.getElementById('scheduleMeetingModal').classList.remove('hidden');
  };

  const handleJoinMeeting = (meetingId) => {
    navigate(`/meeting/${meetingId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left sidebar - Meeting controls */}
      <div className="w-24 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-6">
        <div className="flex flex-col items-center space-y-10">
          <button 
            className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
            onClick={() => handleJoinMeeting('demo-meeting')}
          >
            <FiVideo size={28} />
          </button>
          <button 
            className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
            onClick={handleScheduleMeeting}
          >
            <FiCalendar size={28} />
          </button>
          <button className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors">
            <FiShare2 size={28} />
          </button>
          <button className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors">
            <FiPlus size={28} />
          </button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="h-20 bg-gray-800 border-b border-gray-700 flex items-center px-6">
          <div className="flex items-center">
            <img 
              src={mentor?.profilePicture || "https://randomuser.me/api/portraits/men/32.jpg"} 
              alt={mentor?.firstName} 
              className="w-12 h-12 rounded-full object-cover mr-4" 
            />
            <div>
              <h3 className="font-medium text-xl text-white">{mentor?.firstName} {mentor?.lastName}</h3>
              <p className="text-sm text-gray-400">{mentor?.industry} • {mentor?.expertise}</p>
            </div>
          </div>
        </div>

        {/* Chat heading */}
        <div className="bg-gray-800 py-4 px-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Chat with your Mentor</h2>
          <p className="text-sm text-gray-400">Ask questions, schedule meetings, and get personalized advice</p>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-center mb-4">
                <p className="text-lg mb-2">No messages yet</p>
                <p className="text-sm">Send a message to start the conversation</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 px-4">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs md:max-w-md px-4 py-3 rounded-lg ${
                      msg.senderId === userId 
                        ? 'bg-purple-600 text-white ml-12' 
                        : 'bg-gray-700 text-gray-200 mr-12'
                    }`}
                  >
                    <p>{msg.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message input */}
        <div className="h-20 bg-gray-800 border-t border-gray-700 p-4 flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button 
            onClick={handleSendMessage}
            disabled={isSending}
            className="ml-3 bg-purple-600 text-white px-5 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      <div id="scheduleMeetingModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4 text-white">Schedule a Meeting</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Meeting title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
                <input 
                  type="time" 
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
                <input 
                  type="time" 
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea 
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
                placeholder="Meeting description"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                type="button"
                onClick={() => document.getElementById('scheduleMeetingModal').classList.add('hidden')}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Schedule
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MentorChat;
