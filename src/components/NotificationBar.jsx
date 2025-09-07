import { useState, useEffect } from 'react';

const NotificationBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  const closeNotification = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-full z-50"
      style={{
        background: 'linear-gradient(90deg, rgba(0,0,0,0.9), rgba(0, 20, 40, 0.9))',
        borderBottom: '2px solid transparent',
        borderImage: 'linear-gradient(90deg, transparent, #00ffff, #ff00ff, transparent) 1',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-12 py-2 flex items-center gap-4">
        <div 
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{
            background: '#00ffff',
            boxShadow: '0 0 10px #00ffff, 0 0 20px #ff00ff inset',
            animation: 'pulse 2s ease infinite'
          }}
        ></div>
        <span 
          className="font-orbitron text-sm tracking-wider whitespace-nowrap overflow-hidden text-ellipsis"
          style={{ 
            color: '#cfffff',
            letterSpacing: '1px',
            fontSize: '0.95rem'
          }}
        >
          🚀 Welcome to C-Square Club — Join our coding community and build the future together!
        </span>
        <button
          onClick={closeNotification}
          className="text-neon-cyan hover:text-white text-lg ml-auto flex-shrink-0"
          style={{ fontFamily: 'Orbitron, monospace' }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default NotificationBar;
