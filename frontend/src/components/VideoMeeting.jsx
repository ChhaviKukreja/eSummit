import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhone, FiMessageSquare, FiUsers, FiSettings } from 'react-icons/fi';
import io from 'socket.io-client';
import axios from 'axios';

const VideoMeeting = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [socket, setSocket] = useState(null);
  const [participants, setParticipants] = useState([]);
  
  // Video/Audio state
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  // WebRTC state
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  
  // Initialize socket connection
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

  // Join meeting room when socket and meeting ID are available
  useEffect(() => {
    if (socket && userId && meetingId) {
      socket.emit('join_meeting', { userId, meetingId });

      // Listen for user joined event
      socket.on('user_joined', (data) => {
        console.log('User joined:', data.userId);
        setParticipants(prev => [...prev, data.userId]);
        
        // If we have a peer connection, create and send an offer
        if (peerConnectionRef.current) {
          createOffer();
        }
      });

      // WebRTC signaling
      socket.on('offer', async (offer) => {
        console.log('Received offer');
        if (!peerConnectionRef.current) {
          createPeerConnection();
        }
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socket.emit('answer', { meetingId, answer });
      });

      socket.on('answer', async (answer) => {
        console.log('Received answer');
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      socket.on('ice_candidate', async (candidate) => {
        console.log('Received ICE candidate');
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });
    }
  }, [socket, userId, meetingId]);

  // Fetch meeting details
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        // For demo purposes, if the meeting isn't found in the database,
        // we'll use hardcoded data
        const demoMeeting = {
          _id: 'demo-meeting',
          title: 'Meeting',
          host: {
            _id: 'host-id',
            firstName: 'You',
            lastName: '',
            email: userId
          },
          participant: {
            _id: meetingId === 'demo-meeting' ? '1' : meetingId,
            firstName: meetingId === 'demo-meeting' ? 'Satish' : `Mentor ${meetingId}`,
            lastName: meetingId === 'demo-meeting' ? 'Kumar' : '',
            email: 'mentor@example.com'
          },
          startTime: new Date(),
          endTime: new Date(Date.now() + 3600000), // 1 hour from now
          status: 'scheduled',
          meetingId: meetingId
        };

        try {
          // First try to get from API
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5000/mentor/meetings/${meetingId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMeeting(response.data);
        } catch (apiError) {
          console.log('Meeting not found in database, using demo data');
          // If API fails, use our hardcoded data
          setMeeting(demoMeeting);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching meeting:', error);
        setError('Failed to load meeting details');
        setLoading(false);
      }
    };

    if (meetingId) {
      fetchMeeting();
    }
  }, [meetingId, userId]);

  // Initialize WebRTC
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: isVideoOn, 
          audio: isMicOn 
        });
        
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        createPeerConnection();
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setError('Failed to access camera or microphone');
      }
    };

    if (meetingId && !loading) {
      initializeMedia();
    }

    // Clean up
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [meetingId, loading, isVideoOn, isMicOn]);

  const createPeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const peerConnection = new RTCPeerConnection(configuration);
    
    // Add local tracks to the peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current);
      });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice_candidate', { meetingId, candidate: event.candidate });
      }
    };

    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnectionRef.current = peerConnection;
  };

  const createOffer = async () => {
    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit('offer', { meetingId, offer });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true 
      });
      
      // Replace video track with screen share track
      if (localStreamRef.current && peerConnectionRef.current) {
        const videoTrack = screenStream.getVideoTracks()[0];
        
        const senders = peerConnectionRef.current.getSenders();
        const videoSender = senders.find(sender => 
          sender.track.kind === 'video'
        );
        
        if (videoSender) {
          videoSender.replaceTrack(videoTrack);
        }
        
        // Update local video
        localVideoRef.current.srcObject = screenStream;
        
        // Listen for the end of screen sharing
        videoTrack.onended = () => {
          stopScreenShare();
        };
        
        setIsScreenSharing(true);
      }
    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  };

  const stopScreenShare = async () => {
    try {
      // Restore camera video track
      if (localStreamRef.current && peerConnectionRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoTrack = stream.getVideoTracks()[0];
        
        const senders = peerConnectionRef.current.getSenders();
        const videoSender = senders.find(sender => 
          sender.track.kind === 'video'
        );
        
        if (videoSender) {
          videoSender.replaceTrack(videoTrack);
        }
        
        // Update local video
        localVideoRef.current.srcObject = stream;
        localStreamRef.current = stream;
        
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  };

  const endCall = () => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    // Redirect to dashboard
    navigate('/dashboard');
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
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Meeting header */}
      <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
        <div>
          <h2 className="font-medium text-lg">{meeting?.title || 'Video Meeting'}</h2>
          <p className="text-sm text-gray-400">Meeting ID: {meetingId}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-white">
            <FiUsers size={20} />
          </button>
          <button className="text-gray-400 hover:text-white">
            <FiMessageSquare size={20} />
          </button>
          <button className="text-gray-400 hover:text-white">
            <FiSettings size={20} />
          </button>
        </div>
      </div>

      {/* Video grid */}
      <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Local video */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden">
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-70 px-3 py-1 rounded-md text-sm">
            You {isScreenSharing ? '(Screen)' : ''}
          </div>
        </div>
        
        {/* Remote video */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden">
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-70 px-3 py-1 rounded-md text-sm">
            {meeting?.participant?.firstName || 'Participant'}
          </div>
        </div>
      </div>

      {/* Meeting controls */}
      <div className="h-20 bg-gray-800 border-t border-gray-700 flex items-center justify-center space-x-6">
        <button 
          onClick={toggleMic}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isMicOn ? <FiMic size={28} /> : <FiMicOff size={28} />}
        </button>
        
        <button 
          onClick={toggleVideo}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isVideoOn ? <FiVideo size={28} /> : <FiVideoOff size={28} />}
        </button>
        
        <button 
          onClick={isScreenSharing ? stopScreenShare : startScreenShare}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            isScreenSharing ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </button>
        
        <button 
          onClick={endCall}
          className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors"
        >
          <FiPhone size={28} />
        </button>
      </div>
    </div>
  );
};

export default VideoMeeting;
