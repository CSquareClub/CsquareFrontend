import { useState, useEffect, useRef } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const idCounter = useRef(0);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const updateCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Update trails with unique ID
      setTrails(prevTrails => {
        idCounter.current += 1;
        const newTrails = [...prevTrails, { x: e.clientX, y: e.clientY, id: idCounter.current }];
        return newTrails.slice(-5); // Keep only last 5 trails
      });
    };

    document.addEventListener('mousemove', updateCursor);

    return () => {
      document.removeEventListener('mousemove', updateCursor);
    };
  }, [isMobile]);

  // Animate trails
  useEffect(() => {
    if (isMobile) return;

    const interval = setInterval(() => {
      setTrails(prevTrails => prevTrails.slice(1));
    }, 100);

    return () => clearInterval(interval);
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div
        className="custom-cursor"
        style={{
          left: `${position.x - 10}px`,
          top: `${position.y - 10}px`,
        }}
      />
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="custom-cursor-trail"
          style={{
            left: `${trail.x - 3}px`,
            top: `${trail.y - 3}px`,
            opacity: (index + 1) / trails.length * 0.7,
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;
