import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Carousel = ({ 
  items = [], 
  renderItem, 
  autoSlide = true, 
  slideInterval = 4000,
  showDots = true,
  showArrows = true,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
  onItemClick,
  className = ""
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoSlide);
  const [itemsToShow, setItemsToShow] = useState(itemsPerView.desktop);

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsToShow(itemsPerView.mobile);
      } else if (width < 1024) {
        setItemsToShow(itemsPerView.tablet);
      } else {
        setItemsToShow(itemsPerView.desktop);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerView]);

  // Calculate total slides based on items per view
  const totalSlides = Math.max(0, items.length - itemsToShow + 1);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying || totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, slideInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides, slideInterval]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const pauseAutoSlide = () => setIsAutoPlaying(false);
  const resumeAutoSlide = () => setIsAutoPlaying(autoSlide);

  if (!items.length) {
    return (
      <div className={`carousel-container ${className}`}>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-400">No items to display</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`carousel-container relative ${className}`}
      onMouseEnter={pauseAutoSlide}
      onMouseLeave={resumeAutoSlide}
    >
      {/* Main Carousel */}
      <div className="relative overflow-hidden">
        <motion.div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * (100 / itemsToShow)}%)`,
            width: `${(items.length / itemsToShow) * 100}%`
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / items.length}%` }}
            >
              <div
                className="h-full cursor-pointer"
                onClick={() => onItemClick && onItemClick(item, index)}
              >
                {renderItem(item, index)}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/80 border-2 border-neon-cyan rounded-full text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300 z-10 flex items-center justify-center text-xl font-bold"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/80 border-2 border-neon-cyan rounded-full text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300 z-10 flex items-center justify-center text-xl font-bold"
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && totalSlides > 1 && (
        <div className="flex justify-center space-x-3 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-neon-cyan scale-125 shadow-lg shadow-neon-cyan/50'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {isAutoPlaying && totalSlides > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: slideInterval / 1000,
              ease: 'linear',
              repeat: Infinity
            }}
          />
        </div>
      )}

      {/* Pause/Play Control */}
      {autoSlide && totalSlides > 1 && (
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="absolute top-4 right-4 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full text-white text-sm flex items-center justify-center transition-all duration-300"
          title={isAutoPlaying ? 'Pause' : 'Play'}
        >
          {isAutoPlaying ? '⏸️' : '▶️'}
        </button>
      )}
    </div>
  );
};

export default Carousel;