import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import Carousel from '../ui/Carousel';
import DetailModal from '../DetailModal';

const EventsSectionHorizontal = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => event.type === activeTab);

  const renderEventCard = (event) => (
    <motion.div
      key={event._id}
      onClick={() => setSelectedEvent(event)}
      className="flex-shrink-0 w-80 cursor-pointer group h-96 flex flex-col"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl overflow-hidden hover:border-neon-cyan/50 transition-colors duration-300 h-full flex flex-col">
        {/* Event Image - Takes 3/4 of the space */}
        <div className="relative h-3/4 overflow-hidden">
          <img
            src={event.image || '/api/placeholder/300/225'}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.src = '/api/placeholder/300/225';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Date Badge on image */}
          <div className="absolute top-3 left-3">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-neon-cyan/90 text-black text-xs font-medium backdrop-blur-sm">
              📅 {new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Text Content - Takes 1/4 of the space */}
        <div className="h-1/4 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-orbitron font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors line-clamp-1">
              {event.title}
            </h3>
            <div className="flex items-center justify-between text-xs text-gray-400">
              {event.location && (
                <span className="flex items-center">
                  📍 {event.location}
                </span>
              )}
              {event.time && (
                <span className="flex items-center">
                  ⏰ {event.time}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <section id="events" className="py-20 relative overflow-hidden">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
            <p className="text-gray-300 mt-4">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta/10 via-transparent to-neon-cyan/10"></div>
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-orbitron font-bold mb-6">
            <span className="neon-text">Events & Activities</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join us for exciting workshops, competitions, and networking events that push the boundaries of technology
          </p>
        </motion.div>

        {/* Event Type Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="flex bg-black/30 rounded-xl p-2 border border-gray-700">
            {['upcoming', 'past'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 capitalize ${
                  activeTab === tab
                    ? 'bg-neon-cyan text-black shadow-lg shadow-neon-cyan/25'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {tab} Events
              </button>
            ))}
          </div>
        </motion.div>

        {/* Events Carousel */}
        {filteredEvents.length > 0 ? (
          <Carousel
            items={filteredEvents}
            renderItem={renderEventCard}
            autoSlide={true}
            slideInterval={4000}
            className="mb-8"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-6">📅</div>
            <h3 className="text-2xl font-orbitron font-bold text-white mb-4">
              No {activeTab} events found
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {activeTab === 'upcoming' 
                ? 'Stay tuned for upcoming events and activities!'
                : 'Check back later for past event highlights.'
              }
            </p>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedEvent && (
        <DetailModal
          isOpen={true}
          onClose={() => setSelectedEvent(null)}
          data={selectedEvent}
          type="event"
        />
      )}
    </section>
  );
};

export default EventsSectionHorizontal;
