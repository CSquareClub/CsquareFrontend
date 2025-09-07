import { useState, useEffect } from 'react';
import api from '../utils/api';

const PhotoGallery = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback images in case no gallery items exist
  const fallbackImages = [
    {
      src: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop',
      caption: 'Hackathon 2024 - Innovation in Action'
    },
    {
      src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
      caption: 'Team Collaboration Workshop'
    },
    {
      src: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800&h=600&fit=crop',
      caption: 'AI/ML Conference 2024'
    },
    {
      src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      caption: 'Open Source Contribution Day'
    }
  ];

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const response = await api.get('/gallery?active=true');
      const dbImages = response.data.data || [];
      
      // Transform database images to match expected format
      const transformedImages = dbImages.map(item => ({
        src: item.imageUrl,
        caption: item.title
      }));
      
      // Use database images if available, otherwise use fallback
      setGalleryImages(transformedImages.length > 0 ? transformedImages : fallbackImages);
    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
      // Use fallback images on error
      setGalleryImages(fallbackImages);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-advance slides every 3.5 seconds (desktop only)
  useEffect(() => {
    if (galleryImages.length > 1 && window.innerWidth >= 768) {
      const interval = setInterval(nextSlide, 3500);
      return () => clearInterval(interval);
    }
  }, [galleryImages.length]);

  if (loading) {
    return (
      <div 
        className="photo-gallery-container relative"
        // style={{ minHeight: '500px' }}
      >
        <div className="flex items-center justify-center h-96">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="photo-gallery-container relative"
      // style={{ marginBottom: '80px', minHeight: '500px' }}
    >
      <div className="gallery-slider-wrapper relative flex items-center gap-8">
        {/* Previous Button - Hidden on mobile */}
        <button
          onClick={prevSlide}
          className="gallery-btn hidden md:flex"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            border: '2px solid #00ffff',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            color: '#00ffff',
            fontSize: '2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          ‹
        </button>

        {/* Gallery Container */}
        <div 
          className="photo-gallery overflow-hidden flex-1 relative"
          style={{
            borderRadius: '20px',
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)',
            border: '2px solid transparent',
            background: 'linear-gradient(45deg, #00ffff, #ff00ff) border-box'
          }}
        >
          {/* Mobile Touch Scroll Gallery */}
          <div className="md:hidden flex overflow-x-auto gap-0" style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full relative"
                style={{ scrollSnapAlign: 'start' }}
              >
                <img
                  src={image.src}
                  alt={image.caption}
                  className="gallery-image w-full h-64 object-cover"
                  style={{
                    borderRadius: '18px',
                    transition: 'transform 0.3s ease'
                  }}
                />
                <div 
                  className="gallery-caption absolute bottom-0 left-0 right-0"
                  style={{
                    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.9))',
                    color: '#ffffff',
                    padding: '20px 15px 15px',
                    fontFamily: 'Orbitron, monospace',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
                    borderRadius: '0 0 18px 18px'
                  }}
                >
                  {image.caption}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Slideshow */}
          <div className="hidden md:block">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`gallery-slide relative ${index === currentSlide ? 'active' : ''}`}
                style={{
                  display: index === currentSlide ? 'block' : 'none',
                  animation: index === currentSlide ? 'gallerySlideIn 0.6s ease-in-out' : 'none'
                }}
              >
                <img
                  src={image.src}
                  alt={image.caption}
                  className="gallery-image"
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '18px',
                    transition: 'transform 0.3s ease'
                  }}
                />
                <div 
                  className="gallery-caption absolute bottom-0 left-0 right-0"
                  style={{
                    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.9))',
                    color: '#ffffff',
                    padding: '30px 25px 20px',
                    fontFamily: 'Orbitron, monospace',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
                    borderRadius: '0 0 18px 18px'
                  }}
                >
                  {image.caption}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Button - Hidden on mobile */}
        <button
          onClick={nextSlide}
          className="gallery-btn hidden md:flex"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            border: '2px solid #00ffff',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            color: '#00ffff',
            fontSize: '2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          ›
        </button>
      </div>

      {/* Gallery Dots - Always visible */}
      <div 
        className="gallery-dots flex justify-center gap-4"
        style={{ marginTop: '30px' }}
      >
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`gallery-dot ${index === currentSlide ? 'active' : ''}`}
            style={{
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              background: index === currentSlide ? '#00ffff' : 'rgba(0, 255, 255, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: index === currentSlide ? '2px solid rgba(255, 255, 255, 0.3)' : '2px solid transparent',
              transform: index === currentSlide ? 'scale(1.3)' : 'scale(1)',
              boxShadow: index === currentSlide ? '0 0 15px rgba(0, 255, 255, 0.8)' : 'none'
            }}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gallerySlideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .photo-gallery::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 768px) {
          .photo-gallery {
            scroll-behavior: smooth;
          }
        }
      `}</style>
    </div>
  );
};

export default PhotoGallery;
