import { motion } from 'framer-motion';
import WorkingTerminal from '../WorkingTerminal';

const Hero = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ 
        padding: '140px 20px 48px 20px',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
        position: 'relative'
      }}
    >
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Streaks */}
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-8"
          style={{
            background: `
              linear-gradient(45deg, transparent 0%, rgba(0, 255, 255, 0.1) 25%, transparent 50%),
              linear-gradient(-45deg, transparent 0%, rgba(255, 0, 255, 0.08) 25%, transparent 50%)
            `,
            backgroundSize: '200% 200%',
            animation: 'gradientMove 8s ease infinite'
          }}
        />
        
        {/* Abstract Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              background: `rgba(${Math.random() > 0.5 ? '0, 255, 255' : '255, 0, 255'}, 0.6)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="hero-content flex flex-col lg:flex-row items-center justify-between w-full max-w-screen-2xl mx-auto z-10 gap-8 lg:gap-12">
        
        {/* Left Side - Logo and Title */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-left flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-center sm:text-left"
          style={{ flex: '1 1 auto' }}
        >
          {/* 3D Square Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -45 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="logo-container relative"
            style={{
              width: 'clamp(120px, 15vw, 170px)',
              height: 'clamp(120px, 15vw, 170px)',
              perspective: '1000px'
            }}
          >
            <div 
              className="logo-square relative overflow-hidden flex items-center justify-center"
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #ffffff, #f0f0f0, #e0e0e0, #ffffff)',
                backgroundSize: '300% 300%',
                borderRadius: 'clamp(12px, 2vw, 18px)',
                boxShadow: `
                  0 0 40px rgba(255, 255, 255, 0.4),
                  0 0 80px rgba(0, 255, 255, 0.3),
                  0 20px 40px rgba(0, 0, 0, 0.3),
                  inset 0 0 40px rgba(255, 255, 255, 0.1)
                `,
                animation: 'logoFloat 6s ease-in-out infinite, logoGlow 4s ease infinite',
                border: '2px solid rgba(255, 255, 255, 0.6)',
                transform: 'rotateX(5deg) rotateY(5deg)',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Shine Effect */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  transform: 'rotate(45deg)',
                  animation: 'shine 3s ease-in-out infinite'
                }}
              />
              
              {/* Logo C */}
              <span 
                className="logo-c relative z-10"
                style={{
                  fontFamily: 'Orbitron, monospace',
                  fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                  fontWeight: '900',
                  color: '#000000',
                  textShadow: '3px 3px 6px rgba(0, 0, 0, 0.3)'
                }}
              >
                C
              </span>
            </div>
          </motion.div>

          {/* Club Name */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hero-text flex-1"
            style={{ alignSelf: 'center' }}
          >
            <h1 
              className="club-title"
              style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: 'clamp(2.5rem, 8vw, 60px)',
                fontWeight: '900',
                background: 'linear-gradient(45deg, #00ffff, #ffffff, #ff00ff)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'titleGradient 3s ease infinite',
                textShadow: '0 0 40px rgba(0, 255, 255, 0.5)',
                lineHeight: '1.1',
                marginBottom: '8px',
                letterSpacing: 'clamp(1px, 0.3vw, 2px)'
              }}
            >
              C SQUARE
            </h1>
            <h2 
              className="club-subtitle"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: 'clamp(1rem, 3vw, 22px)',
                fontWeight: '600',
                color: '#cccccc',
                letterSpacing: 'clamp(2px, 1vw, 6px)',
                textTransform: 'uppercase',
                marginLeft: '4px'
              }}
            >
              CLUB
            </h2>
          </motion.div>
        </motion.div>

        {/* Right Side - Interactive Terminal Window */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="hero-right w-full lg:w-auto flex justify-center"
          style={{ flex: '0 0 auto', maxWidth: '100%' }}
        >
          <div className="w-full lg:w-auto flex justify-center">
            <WorkingTerminal />
          </div>
        </motion.div>
      </div>

      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes logoFloat {
          0%, 100% { transform: rotateX(5deg) rotateY(5deg) translateY(0px); }
          50% { transform: rotateX(5deg) rotateY(5deg) translateY(-10px); }
        }
        
        @keyframes logoGlow {
          0%, 100% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.4), 0 0 80px rgba(0, 255, 255, 0.3), 0 20px 40px rgba(0, 0, 0, 0.3), inset 0 0 40px rgba(255, 255, 255, 0.1); }
          50% { box-shadow: 0 0 60px rgba(255, 255, 255, 0.6), 0 0 120px rgba(0, 255, 255, 0.5), 0 20px 40px rgba(0, 0, 0, 0.3), inset 0 0 40px rgba(255, 255, 255, 0.2); }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(200%) rotate(45deg); }
        }
        
        @keyframes titleGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradientMove {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
