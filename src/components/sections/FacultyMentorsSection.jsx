import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import Carousel from '../ui/Carousel';
import DetailModal from '../DetailModal';

const FacultyMentorsSection = () => {
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  useEffect(() => {
    fetchFacultyMembers();
  }, []);

  const fetchFacultyMembers = async () => {
    try {
      const response = await api.get('/faculty');
      setFacultyMembers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching faculty members:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFacultyCard = (faculty) => (
    <motion.div
      key={faculty._id}
      onClick={() => setSelectedFaculty(faculty)}
      className="flex-shrink-0 w-80 cursor-pointer group h-96 flex flex-col"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl overflow-hidden hover:border-neon-cyan/50 transition-colors duration-300 h-full flex flex-col">
        {/* Faculty Image - Takes 3/4 of the space */}
        <div className="relative h-3/4 overflow-hidden">
          <img
            src={faculty.photo || '/api/placeholder/300/225'}
            alt={faculty.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.src = '/api/placeholder/300/225';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Designation Badge on image */}
          <div className="absolute top-3 left-3">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-neon-cyan/90 text-black text-xs font-medium backdrop-blur-sm">
              👨‍🏫 Faculty
            </div>
          </div>
        </div>

        {/* Text Content - Takes 1/4 of the space */}
        <div className="h-1/4 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-orbitron font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors line-clamp-1">
              {faculty.name}
            </h3>
            <p className="text-neon-cyan text-sm font-medium line-clamp-1">
              {faculty.designation}
            </p>
            {faculty.department && (
              <p className="text-gray-400 text-xs line-clamp-1">
                {faculty.department}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
            <p className="text-gray-300 mt-4">Loading faculty members...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-transparent to-neon-magenta/10"></div>
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6">
            Our <span className="neon-text">Faculty Mentors</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Distinguished educators and researchers who guide our journey toward excellence
          </p>
        </motion.div>

        {/* Faculty Carousel */}
        {facultyMembers.length > 0 ? (
          <Carousel
            items={facultyMembers}
            renderItem={renderFacultyCard}
            autoSlide={true}
            slideInterval={6000}
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
            <div className="text-6xl mb-6">👨‍🏫</div>
            <h3 className="text-2xl font-orbitron font-bold text-white mb-4">
              Faculty information coming soon!
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              We're updating our faculty mentor information. Check back soon!
            </p>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedFaculty && (
        <DetailModal
          isOpen={true}
          onClose={() => setSelectedFaculty(null)}
          data={selectedFaculty}
          type="faculty"
        />
      )}
    </section>
  );
};

export default FacultyMentorsSection;
