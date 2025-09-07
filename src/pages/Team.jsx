import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { LoadingCard } from '../components/LoadingSpinner';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/team');
      setTeamMembers(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-orbitron font-bold text-center mb-16 neon-text">
            OUR TEAM
          </h1>

          {loading ? (
            <LoadingCard count={6} />
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-2xl font-orbitron text-neon-cyan mb-2">
                No team members found
              </h3>
              <p className="text-gray-400">
                Our amazing team will be showcased here soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card text-center hover:scale-105"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-neon-cyan flex items-center justify-center text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-magenta text-black overflow-hidden">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <span 
                      className={member.photo ? 'hidden' : 'flex items-center justify-center w-full h-full'}
                    >
                      {member.initials}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-orbitron font-bold text-white mb-2">
                    {member.name}
                  </h3>
                  
                  <div className="text-neon-magenta font-medium mb-4">
                    {member.position}
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Social Links */}
                  {(member.linkedin || member.github || member.portfolio || member.email) && (
                    <div className="flex justify-center space-x-3 mt-6">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="w-8 h-8 flex items-center justify-center border border-neon-cyan rounded text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300"
                          title="Email"
                        >
                          📧
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 flex items-center justify-center border border-neon-cyan rounded text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300"
                          title="LinkedIn"
                        >
                          💼
                        </a>
                      )}
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 flex items-center justify-center border border-neon-cyan rounded text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300"
                          title="GitHub"
                        >
                          🐱
                        </a>
                      )}
                      {member.portfolio && (
                        <a
                          href={member.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 flex items-center justify-center border border-neon-cyan rounded text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300"
                          title="Portfolio"
                        >
                          🌐
                        </a>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {teamMembers.length === 0 && !loading && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-orbitron text-gray-400 mb-4">
                No team members found
              </h3>
              <p className="text-gray-500">
                Team member profiles will appear here.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Team;
