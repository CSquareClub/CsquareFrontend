import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const DetailModal = ({ isOpen, onClose, data, type }) => {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!data) return null;

  const renderTeamMember = () => (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Image Section */}
      <div className="flex-shrink-0">
        <div className="w-48 h-48 mx-auto rounded-full border-4 border-neon-cyan overflow-hidden bg-gradient-to-r from-neon-cyan to-neon-magenta">
          {data.photo ? (
            <img
              src={data.photo}
              alt={data.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`${data.photo ? 'hidden' : 'flex'} items-center justify-center w-full h-full text-4xl font-bold text-black`}
          >
            {data.initials}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-white mb-2">
            {data.name}
          </h2>
          <p className="text-xl text-neon-magenta font-medium mb-4">
            {data.position}
          </p>
          <p className="text-gray-300 leading-relaxed text-lg">
            {data.bio}
          </p>
        </div>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div>
            <h4 className="text-lg font-bold text-white mb-3">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-neon-cyan/20 border border-neon-cyan rounded-full text-sm text-neon-cyan"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        <div>
          <h4 className="text-lg font-bold text-white mb-4">Connect</h4>
          <div className="flex space-x-4">
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>📧</span>
                <span>Email</span>
              </a>
            )}
            {data.linkedin && (
              <a
                href={data.linkedin}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>💼</span>
                <span>LinkedIn</span>
              </a>
            )}
            {data.github && (
              <a
                href={data.github}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 rounded-lg transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>💻</span>
                <span>GitHub</span>
              </a>
            )}
            {data.portfolio && (
              <a
                href={data.portfolio}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>🌐</span>
                <span>Portfolio</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFacultyMember = () => (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Image Section */}
      <div className="flex-shrink-0">
        <div className="w-48 h-48 mx-auto rounded-full border-4 border-neon-cyan overflow-hidden">
          {data.photo ? (
            <img
              src={data.photo}
              alt={data.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-neon-cyan to-neon-magenta flex items-center justify-center text-4xl font-bold text-black">
              {data.name?.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-white mb-2">
            {data.name}
          </h2>
          <p className="text-xl text-neon-magenta font-medium mb-2">
            {data.designation}
          </p>
          <p className="text-lg text-gray-300 mb-4">
            {data.department}
          </p>
          {data.bio && (
            <p className="text-gray-300 leading-relaxed text-lg">
              {data.bio}
            </p>
          )}
        </div>

        {/* Experience & Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.experience && (
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Experience</h4>
              <p className="text-gray-300">{data.experience}</p>
            </div>
          )}
          {data.education && (
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Education</h4>
              <p className="text-gray-300">{data.education}</p>
            </div>
          )}
        </div>

        {/* Specialization */}
        {data.specialization && data.specialization.length > 0 && (
          <div>
            <h4 className="text-lg font-bold text-white mb-3">Specialization</h4>
            <div className="flex flex-wrap gap-2">
              {data.specialization.map((spec, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-neon-cyan/20 border border-neon-cyan rounded-full text-sm text-neon-cyan"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Links - Only LinkedIn for Faculty */}
        {(data.email || data.linkedin) && (
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Connect</h4>
            <div className="flex space-x-4">
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>📧</span>
                  <span>Email</span>
                </a>
              )}
              {data.linkedin && (
                <a
                  href={data.linkedin}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>💼</span>
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderEvent = () => (
    <div className="space-y-6">
      {/* Event Image */}
      {data.image && (
        <div className="w-full h-64 rounded-lg overflow-hidden">
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Event Content */}
      <div>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="px-3 py-1 bg-neon-magenta/20 border border-neon-magenta rounded-full text-sm text-neon-magenta">
            {data.type === 'upcoming' ? '🔮 Upcoming' : '📅 Past Event'}
          </span>
          <span className="text-neon-cyan font-medium">
            📅 {data.date}
          </span>
          {data.location && (
            <span className="text-gray-300">
              📍 {data.location}
            </span>
          )}
        </div>

        <h2 className="text-3xl font-orbitron font-bold text-white mb-4">
          {data.title}
        </h2>
        
        <p className="text-gray-300 leading-relaxed text-lg mb-6">
          {data.description}
        </p>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {data.organizer && (
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Organizer</h4>
              <p className="text-gray-300">{data.organizer}</p>
            </div>
          )}
          {data.attendees && (
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Attendees</h4>
              <p className="text-gray-300">{data.attendees} participants</p>
            </div>
          )}
        </div>

        {/* Event Link */}
        {data.link && (
          <a
            href={data.link}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-magenta text-black font-bold rounded-lg hover:shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>🔗</span>
            <span>{data.linkText || 'Learn More'}</span>
          </a>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'team':
        return renderTeamMember();
      case 'faculty':
        return renderFacultyMember();
      case 'event':
        return renderEvent();
      default:
        return <div>Invalid content type</div>;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 backdrop-blur-md border-2 border-gray-700 rounded-2xl p-6 lg:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors"
              title="Close"
            >
              ✕
            </button>

            {/* Content */}
            <div className="pr-12">
              {renderContent()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;