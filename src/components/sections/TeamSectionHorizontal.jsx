import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import Carousel from '../ui/Carousel';
import DetailModal from '../DetailModal';

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await api.get('/team');
      setTeamMembers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTeamCard = (member) => (
    <motion.div
      key={member._id}
      onClick={() => setSelectedMember(member)}
      className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px] cursor-pointer group h-[350px] sm:h-[370px] md:h-[400px] flex flex-col mx-auto"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl overflow-hidden hover:border-neon-magenta/50 transition-colors duration-300 h-full flex flex-col">
        {/* Member Image - Takes 3/4 of the space */}
        <div className="relative h-3/4 overflow-hidden">
          {/* Animated border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-magenta via-neon-cyan to-neon-magenta rounded-t-xl animate-spin opacity-50 blur-sm"></div>
          <div className="relative bg-gray-900 rounded-t-xl overflow-hidden h-full">
            <img
              src={member.photo || '/api/placeholder/300/225'}
              alt={member.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                e.target.src = '/api/placeholder/300/225';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          
          {/* Core Badge on image */}
          {member.isCore && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
              <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-neon-magenta/90 text-white text-xs font-medium backdrop-blur-sm">
                ⭐ Core Member
              </div>
            </div>
          )}
        </div>

        {/* Text Content - Takes 1/4 of the space */}
        <div className="h-1/4 p-3 sm:p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-orbitron font-bold text-white mb-1 group-hover:text-neon-magenta transition-colors line-clamp-1">
              {member.name}
            </h3>
            <p className="text-neon-cyan text-xs sm:text-sm font-medium line-clamp-1">
              {member.position}
            </p>
            {member.specialization && (
              <p className="text-gray-400 text-xs line-clamp-1">
                {member.specialization}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <section id="team" className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neon-magenta"></div>
            <p className="text-gray-300 mt-4">Loading team members...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-magenta/5"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6">
            Meet Our <span className="neon-text">Team</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The brilliant minds driving innovation and building the future of technology
          </p>
        </motion.div>

        {/* Team Carousel */}
        {teamMembers.length > 0 ? (
          <Carousel
            items={teamMembers}
            renderItem={renderTeamCard}
            autoSlide={true}
            slideInterval={5000}
            itemsPerView={{ mobile: 1, tablet: 2, desktop: 4 }} // Increased desktop to 4
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
            <div className="text-6xl mb-6">👥</div>
            <h3 className="text-2xl font-orbitron font-bold text-white mb-4">
              Team members coming soon!
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              We're building an amazing team. Check back soon to meet them!
            </p>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedMember && (
        <DetailModal
          isOpen={true}
          onClose={() => setSelectedMember(null)}
          data={selectedMember}
          type="team"
        />
      )}
    </section>
  );
};

export default TeamSection;
