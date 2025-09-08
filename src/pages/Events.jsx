import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { LoadingSpinner, LoadingCard } from '../components/LoadingSpinner';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      setEvents(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // You could add a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => event.type === activeTab);

  return (
    <div className="min-h-screen pt-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-orbitron font-bold text-center mb-16 neon-text">
            EVENTS
          </h1>

          {/* Tabs */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="flex space-x-2 sm:space-x-4">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-base transition-all duration-300 ${
                  activeTab === 'upcoming'
                    ? 'bg-gradient-to-r from-neon-cyan to-neon-magenta text-black'
                    : 'border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black'
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-base transition-all duration-300 ${
                  activeTab === 'past'
                    ? 'bg-gradient-to-r from-neon-cyan to-neon-magenta text-black'
                    : 'border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black'
                }`}
              >
                Past Events
              </button>
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <LoadingCard count={6} />
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-orbitron text-neon-cyan mb-2">
                No {activeTab} events found
              </h3>
              <p className="text-gray-400">
                {activeTab === 'upcoming' 
                  ? 'Stay tuned for exciting upcoming events!' 
                  : 'Check back later for past event highlights.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl overflow-hidden hover:border-neon-cyan/50 transition-all duration-300 hover:scale-105 group h-80 sm:h-96 flex flex-col"
                >
                  {/* Event Image - Takes 3/4 of the space */}
                  <div className="relative h-3/4 overflow-hidden">
                    <img
                      src={event.image || '/api/placeholder/400/300'}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/400/300';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Category badge on image */}
                    <div className="absolute top-3 right-3">
                      <span className="text-green-400 text-xs font-medium bg-green-500/80 backdrop-blur-sm px-2 py-1 rounded-full">
                        {event.category || event.type}
                      </span>
                    </div>
                  </div>
                  
                  {/* Text Content - Takes 1/4 of the space */}
                  <div className="h-1/4 p-3 sm:p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm sm:text-lg font-orbitron font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors line-clamp-1">
                        {event.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="text-neon-magenta">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        {event.location && (
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="truncate max-w-20 sm:max-w-none">{event.location}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {filteredEvents.length === 0 && !loading && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-orbitron text-gray-400 mb-4">
                No {activeTab} events found
              </h3>
              <p className="text-gray-500">
                {activeTab === 'upcoming' 
                  ? 'Check back soon for upcoming events!' 
                  : 'Our event history will appear here.'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Events;
