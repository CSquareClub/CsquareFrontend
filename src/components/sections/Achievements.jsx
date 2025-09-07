import { motion } from 'framer-motion';

const Achievements = () => {
  const achievements = [
    {
      icon: '🏆',
      title: 'Competition Winners',
      description: 'Multiple victories in cybersecurity and programming competitions',
      stats: '5+ Awards'
    },
    {
      icon: '👥',
      title: 'Active Members',
      description: 'Growing community of passionate tech enthusiasts',
      stats: '400+ Members'
    },
    {
      icon: '🎯',
      title: 'Projects Completed',
      description: 'Real-world projects solving actual problems',
      stats: '10+ Projects'
    },
    {
      icon: '🎓',
      title: 'Workshops Conducted',
      description: 'Educational sessions covering latest technologies',
      stats: '30+ Sessions'
    },
    {
      icon: '🤝',
      title: 'Industry Partners',
      description: 'Collaborations with leading tech companies',
      stats: '25+ Partners'
    },
    {
      icon: '💡',
      title: 'Innovation Score',
      description: 'Recognition for cutting-edge research and development',
      stats: '95% Rating'
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-magenta/5"></div>
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold mb-4 sm:mb-6">
            <span className="neon-text">Our Achievements</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
            Building the future through innovation, collaboration, and cutting-edge technology
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              className="card group cursor-pointer"
            >
              {/* Icon */}
              <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                {achievement.icon}
              </div>

              {/* Stats */}
              <div className="text-xl sm:text-2xl md:text-3xl font-orbitron font-bold text-neon-cyan mb-1 sm:mb-2 group-hover:text-neon-magenta transition-colors duration-300">
                {achievement.stats}
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-neon-cyan transition-colors duration-300">
                {achievement.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                {achievement.description}
              </p>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20"></div>
                <div className="absolute inset-[1px] rounded-xl bg-black bg-opacity-80"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8"
        >
          {[
            { label: 'Years Active', value: '1+' },
            { label: 'Technologies Mastered', value: '50+' },
            { label: 'Success Rate', value: '98%' }
            
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-orbitron font-bold text-neon-cyan mb-2">
                {stat.value}
              </div>
              <div className="text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div> */}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <a
            href="#contact"
            className="btn-primary text-lg px-8 py-4 inline-block"
          >
            Join Our Success Story
          </a>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-neon-cyan opacity-20 rotate-45"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 border border-neon-magenta opacity-30 rotate-12"></div>
      <div className="absolute top-1/2 left-5 w-2 h-20 bg-gradient-to-b from-transparent via-neon-yellow to-transparent opacity-40"></div>
      <div className="absolute top-1/3 right-5 w-2 h-16 bg-gradient-to-b from-transparent via-neon-cyan to-transparent opacity-30"></div>
    </section>
  );
};

export default Achievements;
