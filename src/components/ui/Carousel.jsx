import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Mousewheel } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

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
  const swiperRef = useRef(null);
  
  // Calculate safe items per view to prevent loop issues
  const safeItemsPerView = {
    mobile: Math.min(itemsPerView.mobile, items.length),
    tablet: Math.min(itemsPerView.tablet, items.length),
    desktop: Math.min(itemsPerView.desktop, items.length)
  };
  
  // Only enable loop if we have enough items
  const shouldLoop = items.length > Math.max(safeItemsPerView.mobile, safeItemsPerView.tablet, safeItemsPerView.desktop);

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
    <div className={`carousel-container relative ${className}`}>
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Autoplay, Mousewheel]}
        loop={shouldLoop} // Only enable loop if we have enough items
        speed={700}
        spaceBetween={20} // Default 20px spacing
        mousewheel={{
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges: false,
        }}
        autoplay={autoSlide && shouldLoop ? { // Only enable autoplay if we have enough items for loop
          delay: slideInterval,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        } : false}
        pagination={showDots ? {
          clickable: true,
          dynamicBullets: true,
          el: '.custom-pagination',
        } : false}
        navigation={showArrows ? {
          nextEl: '.custom-button-next',
          prevEl: '.custom-button-prev',
        } : false}
        breakpoints={{
          0: {
            slidesPerView: 1, // Always show 1 on very small devices
            spaceBetween: 20, // Ensure minimum 20px gap
            centeredSlides: true,
          },
          550: {
            slidesPerView: Math.min(2, safeItemsPerView.mobile), // Show 2 after 550px
            spaceBetween: 20, // Ensure minimum 20px gap
            centeredSlides: true,
          },
          768: {
            slidesPerView: safeItemsPerView.tablet, // Use safe values
            spaceBetween: 24, // Increased gap for medium devices
            centeredSlides: false,
          },
          1024: {
            slidesPerView: 4, // Force 4 cards on large screens to prevent overlap
            spaceBetween: 24, // Increased spacing for better separation
            centeredSlides: false,
          },
          1280: {
            slidesPerView: 4, // Keep 4 cards on xl screens  
            spaceBetween: 28, // More spacing for xl screens
            centeredSlides: false,
          },
          1536: {
            slidesPerView: 4, // Keep 4 cards even on 2xl screens to prevent overlap
            spaceBetween: 32, // Maximum spacing for 2xl screens
            centeredSlides: false,
          },
        }}
        className="h-full"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index} className="px-2">
            <div
              className="h-full cursor-pointer"
              onClick={() => onItemClick && onItemClick(item, index)}
            >
              {renderItem(item, index)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      {showArrows && (
        <>
          <button
            className="custom-button-prev absolute left-1 sm:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/80 border-2 border-neon-cyan rounded-full text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300 z-10 flex items-center justify-center text-lg sm:text-xl font-bold"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            className="custom-button-next absolute right-1 sm:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/80 border-2 border-neon-cyan rounded-full text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300 z-10 flex items-center justify-center text-lg sm:text-xl font-bold"
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}

      {/* Custom Pagination */}
      {showDots && (
        <div className="custom-pagination flex justify-center space-x-2 sm:space-x-3 mt-6 sm:mt-8"></div>
      )}
    </div>
  );
};

export default Carousel;