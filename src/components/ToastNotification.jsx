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
          <div className="bg-black bg-opacity-95 backdrop-blur-lg border-2 border-neon-cyan rounded-xl overflow-hidden shadow-2xl shadow-neon-cyan/20">
            
            {/* Event Image */}
            {event.image && (
              <div className="relative h-32 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={`${event.title} Banner`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-2 left-4 right-4">
                  <div className="toast-event-date text-neon-magenta font-medium text-sm">
                    {event.date}
                  </div>
                </div>
              </div>
            )}

            {/* Content Container */}
            <div className="p-4">
              {/* Header */}
              <div className="toast-header flex justify-between items-center mb-3">
                <h4 className="toast-title text-neon-cyan font-orbitron font-bold text-lg">
                  🎉 Upcoming Event
                </h4>
                <button
                  onClick={closeToast}
                  className="toast-close w-8 h-8 bg-red-500 bg-opacity-20 border border-red-500 text-red-400 rounded-full flex items-center justify-center text-lg font-bold hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  ×
                </button>
              </div>

              {/* Event Content */}
              <div className="space-y-2">
                {!event.image && (
                  <div className="toast-event-date text-neon-magenta font-medium text-sm">
                    {event.date}
                  </div>
                )}
                
                <div className="toast-event-title text-white font-bold text-lg">
                  {event.title}
                </div>
                
                <div className="toast-event-description text-gray-300 text-sm line-clamp-2">
                  {event.description}
                </div>

                {/* Event Location and Time */}
                {(event.location || event.time) && (
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    {event.time && <span>⏰ {event.time}</span>}
                    {event.location && <span>📍 {event.location}</span>}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={scrollToEvents}
                className="toast-cta w-full mt-4 px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-magenta text-black font-bold rounded-lg hover:shadow-lg hover:shadow-neon-cyan/30 transition-all duration-300 transform hover:scale-105"
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
