import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const ToastNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchUpcomingEvent = async () => {
      try {
        const response = await api.get('/events');
        const upcomingEvents = response.data.data?.filter(e => e.type === 'upcoming') || [];
        
        // Use API data if available, otherwise use fallback test data
        const eventToShow = upcomingEvents.length > 0 ? upcomingEvents[0] : {
          _id: 'test-1',
          title: 'Hackathon 2025',
          date: new Date('2025-09-09'),
          time: '10:00 AM',
          type: 'upcoming',
          image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?fm=jpg&q=60&w=3000'
        };
        
        setEvent(eventToShow);
        
        // Show toast after a delay
        setTimeout(() => {
          setIsVisible(true);
        }, 3000);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 13000);
      } catch (error) {
        console.error('Failed to fetch events for toast:', error);
        
        // Show fallback event even if API fails
        const fallbackEvent = {
          _id: 'fallback-1',
          title: 'Welcome to C-Square Club!',
          date: new Date(),
          time: 'Ongoing',
          type: 'upcoming',
          image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=3000'
        };
        
        setEvent(fallbackEvent);
        
        setTimeout(() => {
          setIsVisible(true);
        }, 3000);
        
        setTimeout(() => {
          setIsVisible(false);
        }, 13000);
      }
    };

    fetchUpcomingEvent();
  }, []);

  const closeToast = () => {
    setIsVisible(false);
  };

  const scrollToEvents = () => {
    const eventsSection = document.getElementById('events');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsVisible(false);
  };

  if (!event) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="toast-notification fixed z-50"
        >
          <div className="bg-black bg-opacity-95 backdrop-blur-lg border-2 border-neon-cyan rounded-xl overflow-hidden shadow-2xl shadow-neon-cyan/20 h-72 sm:h-80 md:h-96 flex flex-col">
            
            {/* Event Image - Takes 2.5/4 (62.5%) of the space */}
            <div className="relative h-[62.5%] overflow-hidden">
              <img 
                src={event.image || '/api/placeholder/400/300'} 
                alt={`${event.title} Banner`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/api/placeholder/400/300';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              {/* Close button on image */}
              <button
                onClick={closeToast}
                className="absolute top-2 sm:top-3 right-2 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 bg-red-500 bg-opacity-20 border border-red-500 text-red-400 rounded-full flex items-center justify-center text-sm sm:text-lg font-bold hover:bg-red-500 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                ×
              </button>
              
              {/* Event badge on image */}
              <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                <span className="text-neon-cyan text-xs font-medium bg-neon-cyan/20 backdrop-blur-sm px-2 py-1 rounded-full border border-neon-cyan/50">
                  🎉 Upcoming Event
                </span>
              </div>
            </div>

            {/* Content - Takes 1.5/4 (37.5%) of the space */}
            <div className="h-[37.5%] p-3 sm:p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm sm:text-lg font-orbitron font-bold text-white mb-1 line-clamp-1">
                  {event.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="text-neon-magenta">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                  {event.time && (
                    <span>⏰ {event.time}</span>
                  )}
                </div>
              </div>
              
              {/* CTA Button */}
              <button
                onClick={scrollToEvents}
                className="w-full mt-2 px-3 py-2 bg-gradient-to-r from-neon-cyan to-neon-magenta text-black font-bold rounded-lg hover:shadow-lg hover:shadow-neon-cyan/30 transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 -z-10 blur-xl"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastNotification;
