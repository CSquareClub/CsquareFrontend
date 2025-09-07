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
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-orbitron font-bold text-center mb-16 neon-text">
            EVENTS
          </h1>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'upcoming'
                    ? 'bg-gradient-to-r from-neon-cyan to-neon-magenta text-black'
                    : 'border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black'
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card hover:scale-105"
                >
                  <div className="text-neon-magenta font-medium mb-3">
                    {event.date}
                  </div>
                  <h3 className="text-xl font-orbitron font-bold text-white mb-4">
                    {event.title}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {event.description}
                  </p>
                  {event.link && (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-block"
                    >
                      {event.linkText || 'Learn More'} →
                    </a>
                  )}
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
