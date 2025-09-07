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
        
        if (upcomingEvents.length > 0) {
          setEvent(upcomingEvents[0]); // Get the first upcoming event
          
          // Show toast after a delay
          setTimeout(() => {
            setIsVisible(true);
          }, 3000);
          
          // Auto-hide after 10 seconds
          setTimeout(() => {
            setIsVisible(false);
          }, 13000);
        }
      } catch (error) {
        console.error('Failed to fetch events for toast:', error);
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
          initial={{ opacity: 0, y: -100, x: '50%' }}
          animate={{ opacity: 1, y: 0, x: '50%' }}
          exit={{ opacity: 0, y: -100, x: '50%' }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="toast-notification fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
        >
          <div className="bg-black bg-opacity-95 backdrop-blur-lg border-2 border-neon-cyan rounded-xl overflow-hidden shadow-2xl shadow-neon-cyan/20 h-96 flex flex-col">
            
            {/* Event Image - Takes 3/4 of the space */}
            <div className="relative h-3/4 overflow-hidden">
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
                className="absolute top-3 right-3 w-8 h-8 bg-red-500 bg-opacity-20 border border-red-500 text-red-400 rounded-full flex items-center justify-center text-lg font-bold hover:bg-red-500 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                ×
              </button>
              
              {/* Event badge on image */}
              <div className="absolute top-3 left-3">
                <span className="text-neon-cyan text-xs font-medium bg-neon-cyan/20 backdrop-blur-sm px-2 py-1 rounded-full border border-neon-cyan/50">
                  🎉 Upcoming Event
                </span>
              </div>
            </div>

            {/* Content - Takes 1/4 of the space */}
            <div className="h-1/4 p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-orbitron font-bold text-white mb-1 line-clamp-1">
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
                className="w-full mt-2 px-3 py-1 bg-gradient-to-r from-neon-cyan to-neon-magenta text-black font-bold rounded-lg hover:shadow-lg hover:shadow-neon-cyan/30 transition-all duration-300 transform hover:scale-105 text-sm"
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
