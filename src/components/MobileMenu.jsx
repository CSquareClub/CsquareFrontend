import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose, navItems }) => {
  useEffect(() => {
    // Prevent body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    onClose();
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      x: 50,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Mobile Menu */}
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed right-0 top-0 h-full w-80 max-w-full bg-black bg-opacity-95 backdrop-blur-lg border-l-2 border-neon-cyan z-50 lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-lg flex items-center justify-center text-black font-bold">
                  C
                </div>
                <span className="text-xl font-orbitron font-bold text-white">C-Square</span>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-red-500 bg-opacity-20 border border-red-500 text-red-400 rounded-full flex items-center justify-center text-xl font-bold hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                ×
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="p-6">
              <ul className="space-y-4">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.path}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.isAdmin ? (
                      <Link
                        to={item.path}
                        onClick={handleLinkClick}
                        className="block px-4 py-3 rounded-lg text-lg font-medium transition-all duration-300 bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20 border border-neon-magenta text-neon-magenta hover:bg-gradient-to-r hover:from-neon-magenta hover:to-neon-cyan hover:text-black"
                      >
                        <span className="flex items-center gap-3">
                          {item.icon && <span>{item.icon}</span>}
                          {item.label}
                        </span>
                      </Link>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={handleLinkClick}
                        className="block px-4 py-3 rounded-lg text-lg font-medium transition-all duration-300 text-white hover:bg-white hover:bg-opacity-10 hover:text-neon-cyan"
                      >
                        <span className="flex items-center gap-3">
                          {item.icon && <span>{item.icon}</span>}
                          {item.label}
                        </span>
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-center text-gray-400 text-sm">
                <p className="mb-2">Join our community</p>
                <div className="flex justify-center gap-4">
                  <a href="#" className="text-neon-cyan hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-neon-cyan hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-neon-cyan hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-32 right-6 w-20 h-20 border border-neon-cyan opacity-20 rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
            <div className="absolute bottom-32 left-6 w-12 h-12 border border-neon-magenta opacity-30 rotate-12 animate-pulse"></div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
