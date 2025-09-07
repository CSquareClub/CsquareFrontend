import { useEffect, useRef } from 'react';

function EnhancedBackgroundNew() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system for neural network effect
    const particles = [];
    const maxParticles = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.life = Math.random() * 100 + 100;
        this.maxLife = this.life;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.life = this.maxLife;
        }
      }

      draw() {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = `rgba(74, 144, 226, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    // Matrix rain characters
    const matrixChars = '01001010110010101';
    const matrixColumns = Math.floor(canvas.width / 20);
    const matrixDrops = [];

    for (let i = 0; i < matrixColumns; i++) {
      matrixDrops[i] = 1;
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw matrix rain
      ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.font = '15px monospace';

      for (let i = 0; i < matrixDrops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(text, i * 20, matrixDrops[i] * 20);

        if (matrixDrops[i] * 20 > canvas.height && Math.random() > 0.975) {
          matrixDrops[i] = 0;
        }
        matrixDrops[i]++;
      }

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const alpha = (100 - distance) / 100;
            ctx.strokeStyle = `rgba(74, 144, 226, ${alpha * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* Static Background Container */}
      <div className="bg-container">
        {/* Neural Network Base */}
        <div className="neural-network"></div>
        
        {/* Matrix Rain Background */}
        <div className="matrix-rain"></div>
        
        {/* Holographic Grid */}
        <div className="holo-grid"></div>
        
        {/* Energy Waves */}
        <div className="energy-wave"></div>
        <div className="energy-wave"></div>
        <div className="energy-wave"></div>
        
        {/* Geometric Shapes */}
        <div className="geometric-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
      </div>

      {/* Animated Canvas for Particle Effects */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: -1, opacity: 0.7 }}
      />
    </>
  );
}

export default EnhancedBackgroundNew;
