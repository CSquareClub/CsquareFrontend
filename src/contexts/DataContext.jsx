import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    events: [],
    team: [],
    faculty: [],
    gallery: [],
    loading: {
      events: false,
      team: false,
      faculty: false,
      gallery: false,
    }
  });

  const fetchEvents = async (force = false) => {
    if (!force && data.events.length > 0) return; // Don't refetch if already loaded unless forced
    
    setData(prev => ({ ...prev, loading: { ...prev.loading, events: true } }));
    try {
      const response = await api.get('/events');
      const eventsData = response.data.data || response.data || [];
      setData(prev => ({ 
        ...prev, 
        events: eventsData, 
        loading: { ...prev.loading, events: false } 
      }));
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setData(prev => ({ ...prev, loading: { ...prev.loading, events: false } }));
    }
  };

  const fetchTeam = async (force = false) => {
    if (!force && data.team.length > 0) return; // Don't refetch if already loaded unless forced
    
    setData(prev => ({ ...prev, loading: { ...prev.loading, team: true } }));
    try {
      const response = await api.get('/team');
      const teamData = response.data.data || response.data || [];
      setData(prev => ({ 
        ...prev, 
        team: teamData, 
        loading: { ...prev.loading, team: false } 
      }));
    } catch (error) {
      console.error('Failed to fetch team:', error);
      setData(prev => ({ ...prev, loading: { ...prev.loading, team: false } }));
    }
  };

  const fetchFaculty = async (force = false) => {
    if (!force && data.faculty.length > 0) return; // Don't refetch if already loaded unless forced
    
    setData(prev => ({ ...prev, loading: { ...prev.loading, faculty: true } }));
    try {
      const response = await api.get('/faculty');
      const facultyData = response.data.data || response.data || [];
      setData(prev => ({ 
        ...prev, 
        faculty: facultyData, 
        loading: { ...prev.loading, faculty: false } 
      }));
    } catch (error) {
      console.error('Failed to fetch faculty:', error);
      setData(prev => ({ ...prev, loading: { ...prev.loading, faculty: false } }));
    }
  };

  const fetchGallery = async (force = false) => {
    if (!force && data.gallery.length > 0) return; // Don't refetch if already loaded unless forced
    
    setData(prev => ({ ...prev, loading: { ...prev.loading, gallery: true } }));
    try {
      const response = await api.get('/gallery?active=true');
      const galleryData = response.data.data || response.data || [];
      setData(prev => ({ 
        ...prev, 
        gallery: galleryData, 
        loading: { ...prev.loading, gallery: false } 
      }));
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      setData(prev => ({ ...prev, loading: { ...prev.loading, gallery: false } }));
    }
  };

  // Refresh functions that force refetch
  const refreshEvents = () => fetchEvents(true);
  const refreshTeam = () => fetchTeam(true);
  const refreshFaculty = () => fetchFaculty(true);
  const refreshGallery = () => fetchGallery(true);

  const refreshData = () => {
    setData(prev => ({ 
      ...prev, 
      events: [], 
      team: [], 
      faculty: [], 
      gallery: [] 
    }));
  };

  // Load initial data
  useEffect(() => {
    fetchEvents();
    fetchTeam();
    fetchFaculty();
    fetchGallery();
  }, []);

  return (
    <DataContext.Provider value={{
      // Direct access to data arrays
      events: data.events,
      teamMembers: data.team,
      facultyMembers: data.faculty,
      galleryItems: data.gallery,
      loading: data.loading,
      
      // Refresh functions with consistent naming
      refreshEvents,
      refreshTeam,
      refreshFaculty,
      refreshGallery,
      refreshData,
      
      // Initial fetch functions
      fetchEvents,
      fetchTeam,
      fetchFaculty,
      fetchGallery
    }}>
      {children}
    </DataContext.Provider>
  );
};
