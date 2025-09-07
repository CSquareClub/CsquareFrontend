import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import ImageUpload from '../components/ImageUpload';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true); // Add verification state
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [activeManagement, setActiveManagement] = useState('');
  const [events, setEvents] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [facultyMembers, setFacultyMembers] = useState([]);
  
  // Edit states
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [editingGallery, setEditingGallery] = useState(null);
  
  const [newEvent, setNewEvent] = useState({
    type: 'upcoming',
    date: '',
    time: '',
    title: '',
    description: '',
    location: '',
    image: '',
    link: '',
    linkText: '',
    tags: []
  });
  const [newMember, setNewMember] = useState({
    name: '',
    position: '',
    bio: '',
    initials: '',
    photo: '',
    email: '',
    linkedin: '',
    github: '',
    portfolio: '',
    skills: [],
    isCore: false
  });
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    description: '',
    imageUrl: '',
    eventId: ''
  });
  const [newFacultyMember, setNewFacultyMember] = useState({
    name: '',
    designation: '',
    department: '',
    bio: '',
    photo: '',
    email: '',
    linkedin: '',
    specialization: [],
    experience: '',
    education: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        await verifyToken(token);
      } else {
        setIsVerifying(false); // No token, stop verifying
      }
    };
    
    checkAuthentication();
  }, []);

  // Separate effect to fetch data when authentication state changes
  useEffect(() => {
    if (isAuthenticated && !isVerifying) {
      fetchData();
    }
  }, [isAuthenticated, isVerifying]);

  const verifyToken = async (token) => {
    setIsVerifying(true);
    try {
      console.log('Verifying token...');
      const response = await api.post('/auth/verify', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && (response.data.valid || response.data.success)) {
        console.log('Token verification successful');
        setIsAuthenticated(true);
        // Data will be fetched by the useEffect that monitors isAuthenticated
      } else {
        console.log('Token verification failed - invalid response');
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        setStatus({ type: 'error', message: 'Session expired. Please login again.' });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        console.error('Auth endpoint not found - check backend server');
        setStatus({ type: 'error', message: 'Authentication service unavailable. Please check if the backend server is running.' });
      } else if (error.response?.status === 401) {
        console.log('Token expired or invalid');
        setStatus({ type: 'error', message: 'Session expired. Please login again.' });
      } else {
        console.log('Network or server error during verification');
        setStatus({ type: 'error', message: 'Unable to verify session. Please check your connection and try again.' });
      }
      
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      setStatus({ type: 'error', message: 'Please enter both username and password.' });
      return;
    }

    const sanitizedCredentials = {
      username: credentials.username.trim().toLowerCase(),
      password: credentials.password.trim()
    };

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await api.post('/auth/login', sanitizedCredentials);
      const { token } = response.data.data;
      localStorage.setItem('adminToken', token);
      setIsAuthenticated(true);
      fetchData();
      setStatus({ type: 'success', message: 'Login successful!' });
      setCredentials({ username: '', password: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      setStatus({ type: 'error', message: errorMessage });
      setCredentials(prev => ({ ...prev, password: '' }));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
    setActiveManagement('');
  };

  const fetchData = async () => {
    // Only fetch data if authenticated and not verifying
    if (!isAuthenticated || isVerifying) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      console.log('Fetching admin data...');
      
      const [eventsRes, teamRes, galleryRes, facultyRes] = await Promise.all([
        api.get('/events'),
        api.get('/team'),
        api.get('/gallery'),
        api.get('/faculty')
      ]);
      
      console.log('Data fetched successfully');
      setEvents(eventsRes.data.data || []);
      setTeamMembers(teamRes.data.data || []);
      setGalleryItems(galleryRes.data.data || []);
      setFacultyMembers(facultyRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      
      // If any request fails with 401, logout the user
      if (error.response?.status === 401 || error.status === 401) {
        console.log('Authentication failed, logging out');
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        setStatus({ type: 'error', message: 'Session expired. Please login again.' });
      } else {
        setStatus({ type: 'error', message: 'Failed to load admin data. Please try again.' });
      }
    }
  };

  const addEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await api.post('/events', newEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Event added successfully!' });
      setNewEvent({
        type: 'upcoming',
        date: '',
        time: '',
        title: '',
        description: '',
        location: '',
        image: '',
        link: '',
        linkText: '',
        tags: []
      });
      fetchData();
    } catch (error) {
      console.error('Add event error:', error.response?.data || error.message);
      setStatus({
        type: 'error',
        message: error.response?.data?.details ?
          error.response.data.details.join(', ') :
          'Failed to add event'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      console.log('Deleting event with ID:', id);
      await api.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Event deleted successfully!' });
      fetchData();
    } catch (error) {
      console.error('Delete event error:', error);
      setStatus({ type: 'error', message: `Failed to delete event: ${error.response?.data?.message || error.message}` });
    }
  };

  const addTeamMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await api.post('/team', newMember, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Team member added successfully!' });
      setNewMember({
        name: '',
        position: '',
        bio: '',
        initials: '',
        photo: ''
      });
      fetchData();
    } catch (error) {
      console.error('Add team member error:', error.response?.data || error.message);
      setStatus({
        type: 'error',
        message: error.response?.data?.details ?
          error.response.data.details.join(', ') :
          'Failed to add team member'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTeamMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      console.log('Deleting team member with ID:', id);
      await api.delete(`/team/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Team member deleted successfully!' });
      fetchData();
    } catch (error) {
      console.error('Delete team member error:', error);
      setStatus({ type: 'error', message: `Failed to delete team member: ${error.response?.data?.message || error.message}` });
    }
  };

  const addGalleryItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      // Prepare the data - convert empty eventId to null
      const galleryData = {
        ...newGalleryItem,
        eventId: newGalleryItem.eventId.trim() || null,
        description: newGalleryItem.description.trim()
      };
      
      console.log('Sending gallery data:', galleryData); // Debug log
      console.log('Available events:', events); // Debug log
      console.log('Raw eventId value:', newGalleryItem.eventId); // Debug log
      console.log('Processed eventId:', galleryData.eventId); // Debug log
      await api.post('/gallery', galleryData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Gallery item added successfully!' });
      setNewGalleryItem({
        title: '',
        description: '',
        imageUrl: '',
        eventId: ''
      });
      fetchData();
    } catch (error) {
      console.error('Add gallery item error:', error);
      console.error('Response data:', error.response?.data);
      console.error('Status code:', error.response?.status);
      setStatus({
        type: 'error',
        message: error.response?.data?.details ?
          (Array.isArray(error.response.data.details) ? 
            error.response.data.details.join(', ') : 
            error.response.data.details) :
          error.response?.data?.error || 
          error.response?.data?.message || 
          'Failed to add gallery item'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteGalleryItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await api.delete(`/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Gallery item deleted successfully!' });
      fetchData();
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to delete gallery item' });
    }
  };

  // ===== ENHANCED CRUD FUNCTIONS =====

  // Gallery CRUD
  const startEditGallery = (item) => {
    setEditingGallery(item._id);
    setNewGalleryItem({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      eventId: item.eventId || ''
    });
  };

  const updateGalleryItem = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const galleryData = {
        ...newGalleryItem,
        eventId: newGalleryItem.eventId.trim() || null,
        description: newGalleryItem.description.trim()
      };

      await api.put(`/gallery/${editingGallery}`, galleryData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEditingGallery(null);
      setNewGalleryItem({
        title: '',
        description: '',
        imageUrl: '',
        eventId: ''
      });
      setStatus({ type: 'success', message: 'Gallery item updated successfully!' });
      fetchData();
    } catch (error) {
      console.error('Update gallery item error:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to update gallery item'
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelEditGallery = () => {
    setEditingGallery(null);
    setNewGalleryItem({
      title: '',
      description: '',
      imageUrl: '',
      eventId: ''
    });
  };

  // Event CRUD
  const startEditEvent = (event) => {
    setEditingEvent(event.id);
    setNewEvent({
      type: event.type,
      date: event.date,
      time: event.time || '',
      title: event.title,
      description: event.description,
      location: event.location || '',
      image: event.image || '',
      link: event.link || '',
      linkText: event.linkText || '',
      tags: event.tags || []
    });
  };

  const updateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await api.put(`/events/${editingEvent}`, newEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Event updated successfully!' });
      setEditingEvent(null);
      setNewEvent({
        type: 'upcoming',
        date: '',
        time: '',
        title: '',
        description: '',
        location: '',
        image: '',
        link: '',
        linkText: '',
        tags: []
      });
      fetchData();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.details ?
          error.response.data.details.join(', ') :
          'Failed to update event'
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelEditEvent = () => {
    setEditingEvent(null);
    setNewEvent({
      type: 'upcoming',
      date: '',
      time: '',
      title: '',
      description: '',
      location: '',
      image: '',
      link: '',
      linkText: '',
      tags: []
    });
  };

  // Team Member CRUD
  const startEditMember = (member) => {
    setEditingMember(member.id);
    setNewMember({
      name: member.name,
      position: member.position,
      bio: member.bio,
      initials: member.initials || '',
      photo: member.photo || '',
      email: member.email || '',
      linkedin: member.linkedin || '',
      github: member.github || '',
      portfolio: member.portfolio || '',
      skills: member.skills || [],
      isCore: member.isCore || false
    });
  };

  const updateTeamMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await api.put(`/team/${editingMember}`, newMember, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Team member updated successfully!' });
      setEditingMember(null);
      setNewMember({
        name: '',
        position: '',
        bio: '',
        initials: '',
        photo: '',
        email: '',
        linkedin: '',
        github: '',
        portfolio: '',
        skills: [],
        isCore: false
      });
      fetchData();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.details ?
          error.response.data.details.join(', ') :
          'Failed to update team member'
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelEditMember = () => {
    setEditingMember(null);
    setNewMember({
      name: '',
      position: '',
      bio: '',
      initials: '',
      photo: '',
      email: '',
      linkedin: '',
      github: '',
      portfolio: '',
      skills: [],
      isCore: false
    });
  };

  // Faculty CRUD
  const addFacultyMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await api.post('/faculty', newFacultyMember, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Faculty member added successfully!' });
      setNewFacultyMember({
        name: '',
        designation: '',
        department: '',
        bio: '',
        photo: '',
        email: '',
        linkedin: '',
        specialization: [],
        experience: '',
        education: ''
      });
      fetchData();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.details ?
          error.response.data.details.join(', ') :
          'Failed to add faculty member'
      });
    } finally {
      setLoading(false);
    }
  };

  const startEditFaculty = (faculty) => {
    setEditingFaculty(faculty.id);
    setNewFacultyMember({
      name: faculty.name,
      designation: faculty.designation,
      department: faculty.department,
      bio: faculty.bio || '',
      photo: faculty.photo || '',
      email: faculty.email || '',
      linkedin: faculty.linkedin || '',
      specialization: faculty.specialization || [],
      experience: faculty.experience || '',
      education: faculty.education || ''
    });
  };

  const updateFacultyMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await api.put(`/faculty/${editingFaculty}`, newFacultyMember, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Faculty member updated successfully!' });
      setEditingFaculty(null);
      setNewFacultyMember({
        name: '',
        designation: '',
        department: '',
        bio: '',
        photo: '',
        email: '',
        linkedin: '',
        specialization: [],
        experience: '',
        education: ''
      });
      fetchData();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.details ?
          error.response.data.details.join(', ') :
          'Failed to update faculty member'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteFacultyMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      console.log('Deleting faculty member with ID:', id);
      await api.delete(`/faculty/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Faculty member deleted successfully!' });
      fetchData();
    } catch (error) {
      console.error('Delete faculty member error:', error);
      setStatus({ type: 'error', message: `Failed to delete faculty member: ${error.response?.data?.message || error.message}` });
    }
  };

  const cancelEditFaculty = () => {
    setEditingFaculty(null);
    setNewFacultyMember({
      name: '',
      designation: '',
      department: '',
      bio: '',
      photo: '',
      email: '',
      linkedin: '',
      specialization: [],
      experience: '',
      education: ''
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="card max-w-md w-full p-8 bg-black/40 rounded-xl border border-gray-700"
        >
          <h1 className="text-3xl font-orbitron font-bold text-center mb-8 neon-text">
            🔐 Admin Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white transition-colors"
                required
                autoComplete="username"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white transition-colors"
                required
                autoComplete="current-password"
                maxLength={100}
              />
            </div>

            {status.message && (
              <div className={`p-4 rounded-lg ${status.type === 'success'
                ? 'bg-green-500/20 border border-green-500 text-green-400'
                : 'bg-red-500/20 border border-red-500 text-red-400'
                }`}>
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary py-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Show loading while verifying token
  if (isVerifying) {
    return (
      <main className="relative z-10">
        <div className="min-h-screen pt-20 sm:pt-24 md:pt-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="max-w-4xl mx-auto text-center">
            <div className="card bg-black/60 backdrop-blur-sm border-gray-700 p-8">
              <div className="animate-spin w-8 h-8 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-white mb-2">Verifying Authentication</h2>
              <p className="text-gray-400">Please wait while we verify your session...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10">
      <div className="min-h-screen pt-20 sm:pt-24 md:pt-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-orbitron font-bold neon-text text-center sm:text-left">
              🛠️ Admin Control Panel
            </h1>
            <button
              onClick={handleLogout}
              className="btn-secondary self-center sm:self-auto px-6 py-2 text-sm sm:text-base"
            >
              Logout
            </button>
          </div>

          {status.message && (
            <div className={`p-4 rounded-lg mb-6 text-center ${status.type === 'success'
              ? 'bg-green-500/20 border border-green-500 text-green-400'
              : 'bg-red-500/20 border border-red-500 text-red-400'
              }`}>
              {status.message}
            </div>
          )}

          {/* Dashboard Overview */}
          {activeManagement === '' && (
            <div className="space-y-8">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Events Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card flex flex-col items-center p-6 bg-black/40 rounded-xl border border-gray-700 text-center"
                >
                  <div className="text-4xl md:text-5xl mb-4">📅</div>
                  <div className="text-3xl md:text-4xl font-orbitron font-bold text-neon-cyan mb-2">
                    {events.length}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-4">Total Events</h3>
                  <p className="text-sm text-gray-300 mb-6">
                    Manage your club events, workshops, and activities
                  </p>
                  <button
                    onClick={() => setActiveManagement('events')}
                    className="w-full btn-primary py-2 text-sm sm:text-base"
                  >
                    Manage Events
                  </button>
                </motion.div>

                {/* Team Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card flex flex-col items-center p-6 bg-black/40 rounded-xl border border-gray-700 text-center w-[278px] lg:w-[379px]"
                >
                  <div className="text-4xl md:text-5xl mb-4">👥</div>
                  <div className="text-3xl md:text-4xl font-orbitron font-bold text-neon-cyan mb-2">
                    {teamMembers.length}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-4">Team Members</h3>
                  <p className="text-sm text-gray-300 mb-6">
                    Add and manage your club team members
                  </p>
                  <button
                    onClick={() => setActiveManagement('team')}
                    className="w-full btn-primary py-2 text-sm sm:text-base"
                  >
                    Manage Team
                  </button>
                </motion.div>

                {/* Gallery Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="card flex flex-col items-center p-6 bg-black/40 rounded-xl border border-gray-700 text-center"
                >
                  <div className="text-4xl md:text-5xl mb-4">🖼️</div>
                  <div className="text-3xl md:text-4xl font-orbitron font-bold text-neon-cyan mb-2">
                    {galleryItems.length}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-4">Gallery Items</h3>
                  <p className="text-sm text-gray-300 mb-6">
                    Manage your club's photo gallery and memories
                  </p>
                  <button
                    onClick={() => setActiveManagement('gallery')}
                    className="w-full btn-primary py-2 text-sm sm:text-base"
                  >
                    Manage Gallery
                  </button>
                </motion.div>

                {/* Faculty Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="card flex flex-col items-center p-6 bg-black/40 rounded-xl border border-gray-700 text-center"
                >
                  <div className="text-4xl md:text-5xl mb-4">👨‍🏫</div>
                  <div className="text-3xl md:text-4xl font-orbitron font-bold text-neon-cyan mb-2">
                    {facultyMembers.length}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-4">Faculty Mentors</h3>
                  <p className="text-sm text-gray-300 mb-6">
                    Manage faculty mentors and advisors
                  </p>
                  <button
                    onClick={() => setActiveManagement('faculty')}
                    className="w-full btn-primary py-2 text-sm sm:text-base"
                  >
                    Manage Faculty
                  </button>
                </motion.div>
              </div>

              {/* Quick Overview */}
              <div className="p-6 bg-black/40 rounded-xl border border-gray-700">
                <h2 className="text-2xl font-orbitron font-bold text-white mb-6 text-center sm:text-left flex items-center gap-2">
                  <img src="icon.png" alt="Stats Icon" className="inline w-7 h-7 object-cover" />
                  Quick Overview
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
                  <div className="flex flex-col justify-center items-center h-32 w-full bg-black/30 rounded-lg border border-gray-600 text-center">
                    <div className="text-2xl font-bold text-neon-cyan">1</div>
                    <div className="text-base text-white mt-2">Upcoming Events</div>
                  </div>
                  <div className="flex flex-col justify-center items-center h-32 w-full bg-black/30 rounded-lg border border-gray-600 text-center">
                    <div className="text-2xl font-bold text-neon-magenta">1</div>
                    <div className="text-base text-white mt-2">Past Events</div>
                  </div>
                  <div className="flex flex-col justify-center items-center h-32 w-full bg-black/30 rounded-lg border border-gray-600 text-center">
                    <div className="text-2xl font-bold text-neon-yellow">4</div>
                    <div className="text-base text-white mt-2">Active Members</div>
                  </div>
                  <div className="flex flex-col justify-center items-center h-32 w-full bg-black/30 rounded-lg border border-gray-600 text-center">
                    <div className="text-2xl font-bold text-green-400">2</div>
                    <div className="text-base text-white mt-2">Photos</div>
                  </div>
                </div>
              </div>

            </div>

          )}

          {/* Back Button for Management Sections */}
          {activeManagement !== '' && (
            <div className="mb-6">
              <button
                onClick={() => setActiveManagement('')}
                className="btn-secondary text-sm sm:text-base"
              >
                ← Back to Dashboard
              </button>
            </div>
          )}

          {/* Event Management */}
          {activeManagement === 'events' && (
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-orbitron font-bold text-white mb-6">
                📅 Event Management
              </h2>

              {/* Add/Edit Event Form */}
              <div className="card p-6 bg-black/40 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h3>
                <form onSubmit={editingEvent ? updateEvent : addEvent} className="space-y-6">

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2 font-medium">Event Type *</label>
                      <select
                        value={newEvent.type}
                        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                        className="w-[278px] px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                        required
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-medium">Date *</label>
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        className="w-[278px] px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2 font-medium">Time</label>
                      <input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        className="w-[278px] px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-medium">Location</label>
                      <input
                        type="text"
                        placeholder="Event location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        className="w-[278px] px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-medium">Title *</label>
                    <input
                      type="text"
                      placeholder="Event title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-medium">Description</label>
                    <textarea
                      rows={4}
                      placeholder="Event description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors resize-none text-sm sm:text-base"
                    />
                  </div>

                  <ImageUpload
                    currentImage={newEvent.image}
                    onImageChange={(url) => setNewEvent({ ...newEvent, image: url })}
                    label="Event Image"
                    className="col-span-1 lg:col-span-2"
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2 font-medium">Link</label>
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={newEvent.link}
                        onChange={(e) => setNewEvent({ ...newEvent, link: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-medium">Link Text</label>
                    <input
                      type="text"
                      placeholder="Register Now, Learn More, etc."
                      value={newEvent.linkText}
                      onChange={(e) => setNewEvent({ ...newEvent, linkText: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-medium">Tags (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g., Tech, Open, Workshop"
                      value={Array.isArray(newEvent.tags) ? newEvent.tags.join(', ') : ''}
                      onChange={(e) => setNewEvent({
                        ...newEvent,
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                      })}
                      className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1 sm:flex-none"
                    >
                      {loading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Add Event')}
                    </button>

                    {editingEvent && (
                      <button
                        type="button"
                        onClick={cancelEditEvent}
                        className="btn-secondary flex-1 sm:flex-none"
                      >
                        Cancel Edit
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setNewEvent({
                        type: 'upcoming',
                        date: '',
                        time: '',
                        title: '',
                        description: '',
                        location: '',
                        image: '',
                        link: '',
                        linkText: '',
                        tags: []
                      })}
                      className="btn-secondary flex-1 sm:flex-none"
                    >
                      Clear Form
                    </button>
                  </div>

                </form>
              </div>

              {/* Events List */}
              <div className="card p-6 bg-black/40 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">Existing Events ({events.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-black/30 rounded-lg border border-gray-600 p-4 hover:border-neon-cyan transition-colors"
                    >
                      {event.image && (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h4 className="text-lg font-bold text-white mb-2">{event.title}</h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-300">
                          📅 {new Date(event.date).toLocaleDateString()}
                          {event.time && ` at ${event.time}`}
                        </p>
                        {event.location && (
                          <p className="text-gray-300">📍 {event.location}</p>
                        )}
                        <p className="text-neon-cyan capitalize">
                          🏷️ {event.type}
                        </p>
                      </div>
                      {event.description && (
                        <p className="text-gray-400 text-sm mt-3 line-clamp-3">
                          {event.description}
                        </p>
                      )}
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {event.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {event.link && (
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-3 text-neon-cyan hover:text-cyan-300 text-sm"
                        >
                          {event.linkText || 'Learn More'} →
                        </a>
                      )}
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => startEditEvent(event)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEvent(event._id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {events.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <p className="text-gray-400 text-lg">No events found</p>
                    <p className="text-gray-500 text-sm mt-2">Add your first event using the form above</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Team Management */}
          {activeManagement === 'team' && (
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-orbitron font-bold text-white mb-6">
                👥 Team Management
              </h2>

              {/* Add/Edit Team Member Form */}
              <div className="card p-6 bg-black/40 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">
                  {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                </h3>
                <form onSubmit={editingMember ? updateTeamMember : addTeamMember} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2 font-medium">Name *</label>
                      <input
                        type="text"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        className="w-[278px] px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                        placeholder="Member name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-medium">Position *</label>
                      <input
                        type="text"
                        value={newMember.position}
                        onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                        className="w-[278px] px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                        placeholder="Position/Role"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2 font-medium">Initials *</label>
                      <input
                        type="text"
                        value={newMember.initials}
                        onChange={(e) => setNewMember({ ...newMember, initials: e.target.value.toUpperCase() })}
                        maxLength={3}
                        className="w-[278px] px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                        placeholder="ABC"
                        required
                      />
                    </div>
                  </div>

                  <ImageUpload
                    currentImage={newMember.photo}
                    onImageChange={(url) => setNewMember({ ...newMember, photo: url })}
                    label="Profile Photo"
                  />

                  <div>
                    <label className="block text-white mb-2 font-medium">Bio</label>
                    <textarea
                      value={newMember.bio}
                      onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors resize-none text-sm sm:text-base"
                      placeholder="Member bio/description"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2 font-medium">Email</label>
                      <input
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                        placeholder="member@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-medium">LinkedIn Profile</label>
                      <input
                        type="url"
                        value={newMember.linkedin}
                        onChange={(e) => setNewMember({ ...newMember, linkedin: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                        placeholder="https://linkedin.com/in/member"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2 font-medium">GitHub Profile</label>
                      <input
                        type="url"
                        value={newMember.github}
                        onChange={(e) => setNewMember({ ...newMember, github: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                        placeholder="https://github.com/member"
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-medium">Portfolio/Website</label>
                      <input
                        type="url"
                        value={newMember.portfolio}
                        onChange={(e) => setNewMember({ ...newMember, portfolio: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                        placeholder="https://member-portfolio.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-medium">Skills</label>
                    <input
                      type="text"
                      value={newMember.skills.join(', ')}
                      onChange={(e) => setNewMember({ 
                        ...newMember, 
                        skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                      })}
                      className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="JavaScript, React, Node.js, Python (comma separated)"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isCore"
                      checked={newMember.isCore}
                      onChange={(e) => setNewMember({ ...newMember, isCore: e.target.checked })}
                      className="w-5 h-5 text-neon-cyan bg-black/50 border-2 border-gray-600 rounded focus:ring-neon-cyan focus:ring-2"
                    />
                    <label htmlFor="isCore" className="text-white font-medium">
                      Core Team Member
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      className="btn-primary flex-1 sm:flex-none"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : (editingMember ? 'Update Member' : 'Add Member')}
                    </button>
                    {editingMember && (
                      <button
                        type="button"
                        onClick={cancelEditMember}
                        className="btn-secondary flex-1 sm:flex-none"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setNewMember({
                        name: '',
                        position: '',
                        bio: '',
                        initials: '',
                        photo: '',
                        email: '',
                        linkedin: '',
                        github: '',
                        portfolio: '',
                        skills: [],
                        isCore: false
                      })}
                      className="btn-secondary flex-1 sm:flex-none"
                    >
                      Clear Form
                    </button>
                  </div>
                </form>
              </div>

              {/* Team Members List */}
              <div className="card p-6 bg-black/40 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">Team Members ({teamMembers.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {teamMembers.map((member) => (
                    <motion.div
                      key={member._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-black/30 rounded-lg border border-gray-600 p-4 hover:border-neon-cyan transition-colors"
                    >
                      <div className="flex items-center mb-4">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-16 h-16 rounded-full object-cover mr-4"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center text-black font-bold text-lg mr-4">
                            {member.initials}
                          </div>
                        )}
                        <div>
                          <h4 className="text-lg font-bold text-white">{member.name}</h4>
                          <p className="text-neon-cyan text-sm">{member.position}</p>
                        </div>
                      </div>
                      {member.bio && (
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                          {member.bio}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditMember(member)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTeamMember(member._id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {teamMembers.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <p className="text-gray-400 text-lg">No team members found</p>
                    <p className="text-gray-500 text-sm mt-2">Add your first team member using the form above</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Gallery Management */}
          {activeManagement === 'gallery' && (
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-orbitron font-bold text-white mb-6">
                🖼️ Gallery Management
              </h2>

              {/* Add/Edit Gallery Item Form */}
              <div className="card p-6 bg-black/40 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">
                  {editingGallery ? 'Edit Gallery Item' : 'Add New Gallery Item'}
                </h3>
                <form onSubmit={editingGallery ? updateGalleryItem : addGalleryItem} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2 font-medium">Title *</label>
                      <input
                        type="text"
                        value={newGalleryItem.title}
                        onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                        className="w-[278px] px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                        placeholder="Image title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-medium">Related Event (Optional)</label>
                      <select
                        value={newGalleryItem.eventId}
                        onChange={(e) => setNewGalleryItem({ ...newGalleryItem, eventId: e.target.value })}
                        className="w-[278px] px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                      >
                        <option value="">No event selected</option>
                        {events.map((event) => (
                          <option key={event._id} value={event._id}>
                            {event.title} - {new Date(event.date).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <ImageUpload
                    currentImage={newGalleryItem.imageUrl}
                    onImageChange={(url) => setNewGalleryItem({ ...newGalleryItem, imageUrl: url })}
                    label="Gallery Image"
                    required={!editingGallery}
                  />

                  <div>
                    <label className="block text-white mb-2 font-medium">Description</label>
                    <textarea
                      value={newGalleryItem.description}
                      onChange={(e) => setNewGalleryItem({ ...newGalleryItem, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors resize-none text-sm sm:text-base"
                      placeholder="Image description"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      className="btn-primary flex-1 sm:flex-none"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : (editingGallery ? 'Update Gallery Item' : 'Add Gallery Item')}
                    </button>
                    {editingGallery && (
                      <button
                        type="button"
                        onClick={cancelEditGallery}
                        className="btn-secondary flex-1 sm:flex-none"
                      >
                        Cancel Edit
                      </button>
                    )}
                    {!editingGallery && (
                      <button
                        type="button"
                        onClick={() => setNewGalleryItem({
                          title: '',
                          description: '',
                          imageUrl: '',
                          eventId: ''
                        })}
                        className="btn-secondary flex-1 sm:flex-none"
                      >
                        Clear Form
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Gallery Items List */}
              <div className="card p-6 bg-black/40 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">Gallery Items ({galleryItems.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {galleryItems.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-black/30 rounded-lg border border-gray-600 p-4 hover:border-neon-cyan transition-colors w-[284px]"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                      <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                      <>
                        {item.description && (
                          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                            {item.description}
                          </p>
                        )}
                        {item.eventId && (
                          <p className="text-neon-cyan text-sm mb-4">
                            🔗 Event: {item.eventId}
                          </p>
                        )}
                      </>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditGallery(item)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteGalleryItem(item._id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {galleryItems.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p className="text-gray-400 text-lg">No gallery items found</p>
                    <p className="text-gray-500 text-sm mt-2">Add your first gallery item using the form above</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Faculty Management */}
          {activeManagement === 'faculty' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl sm:text-3xl font-orbitron font-bold text-white">
                  👨‍🏫 Faculty Management
                </h2>
                <button
                  onClick={() => setActiveManagement('')}
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  ← Back to Dashboard
                </button>
              </div>

              {/* Add/Edit Faculty Form */}
              <div className="card p-6 bg-black/40 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">
                  {editingFaculty ? 'Edit Faculty Member' : 'Add New Faculty Member'}
                </h3>
                <form onSubmit={editingFaculty ? updateFacultyMember : addFacultyMember} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2 font-medium">Full Name *</label>
                      <input
                        type="text"
                        value={newFacultyMember.name}
                        onChange={(e) => setNewFacultyMember({ ...newFacultyMember, name: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                        placeholder="Dr. John Smith"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-medium">Designation *</label>
                      <input
                        type="text"
                        value={newFacultyMember.designation}
                        onChange={(e) => setNewFacultyMember({ ...newFacultyMember, designation: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                        placeholder="Professor / Associate Professor"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2 font-medium">Department *</label>
                      <input
                        type="text"
                        value={newFacultyMember.department}
                        onChange={(e) => setNewFacultyMember({ ...newFacultyMember, department: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                        placeholder="Computer Science & Engineering"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-medium">Experience</label>
                      <input
                        type="text"
                        value={newFacultyMember.experience}
                        onChange={(e) => setNewFacultyMember({ ...newFacultyMember, experience: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                        placeholder="15+ years"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-medium">Bio</label>
                    <textarea
                      value={newFacultyMember.bio}
                      onChange={(e) => setNewFacultyMember({ ...newFacultyMember, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors resize-none text-sm sm:text-base"
                      placeholder="Brief description about the faculty member..."
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-medium">Education</label>
                    <textarea
                      value={newFacultyMember.education}
                      onChange={(e) => setNewFacultyMember({ ...newFacultyMember, education: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors resize-none text-sm sm:text-base"
                      placeholder="PhD Computer Science, MIT; MS Computer Science, Stanford..."
                    />
                  </div>

                  <ImageUpload
                    currentImage={newFacultyMember.photo}
                    onImageChange={(url) => setNewFacultyMember({ ...newFacultyMember, photo: url })}
                    label="Profile Photo"
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2 font-medium">Email</label>
                      <input
                        type="email"
                        value={newFacultyMember.email}
                        onChange={(e) => setNewFacultyMember({ ...newFacultyMember, email: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                        placeholder="john.smith@university.edu"
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2 font-medium">LinkedIn Profile</label>
                      <input
                        type="url"
                        value={newFacultyMember.linkedin}
                        onChange={(e) => setNewFacultyMember({ ...newFacultyMember, linkedin: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                        placeholder="https://linkedin.com/in/john-smith"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-medium">Specialization</label>
                    <input
                      type="text"
                      value={newFacultyMember.specialization.join(', ')}
                      onChange={(e) => setNewFacultyMember({ 
                        ...newFacultyMember, 
                        specialization: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                      })}
                      className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="Machine Learning, AI, Data Science (comma separated)"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      className="btn-primary flex-1 sm:flex-none"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : (editingFaculty ? 'Update Faculty' : 'Add Faculty')}
                    </button>
                    {editingFaculty && (
                      <button
                        type="button"
                        onClick={cancelEditFaculty}
                        className="btn-secondary flex-1 sm:flex-none"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setNewFacultyMember({
                        name: '',
                        designation: '',
                        department: '',
                        bio: '',
                        photo: '',
                        email: '',
                        linkedin: '',
                        specialization: [],
                        experience: '',
                        education: ''
                      })}
                      className="btn-secondary flex-1 sm:flex-none"
                    >
                      Clear Form
                    </button>
                  </div>
                </form>
              </div>

              {/* Faculty Members List */}
              <div className="card p-6 bg-black/40 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">Faculty Members ({facultyMembers.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {facultyMembers.map((faculty) => (
                    <motion.div
                      key={faculty.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-black/30 rounded-lg border border-gray-600 p-4 hover:border-neon-cyan transition-colors"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full border-2 border-neon-cyan overflow-hidden mr-4">
                          {faculty.photo ? (
                            <img
                              src={faculty.photo}
                              alt={faculty.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-neon-cyan to-neon-magenta flex items-center justify-center text-lg font-bold text-black">
                              {faculty.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white">{faculty.name}</h4>
                          <p className="text-neon-cyan text-sm">{faculty.designation}</p>
                          <p className="text-gray-400 text-xs">{faculty.department}</p>
                        </div>
                      </div>
                      
                      {faculty.specialization && faculty.specialization.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {faculty.specialization.slice(0, 3).map((spec, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-neon-cyan/20 border border-neon-cyan rounded text-xs text-neon-cyan"
                              >
                                {spec}
                              </span>
                            ))}
                            {faculty.specialization.length > 3 && (
                              <span className="text-xs text-gray-400">+{faculty.specialization.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditFaculty(faculty)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteFacultyMember(faculty._id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {facultyMembers.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👨‍🏫</div>
                    <p className="text-gray-400 text-lg">No faculty members found</p>
                    <p className="text-gray-500 text-sm mt-2">Add your first faculty member using the form above</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Admin;
