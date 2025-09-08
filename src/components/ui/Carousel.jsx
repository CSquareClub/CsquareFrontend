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
        loop={true}
        speed={700}
        spaceBetween={20}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges: false,
        }}
        autoplay={autoSlide ? {
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
            slidesPerView: itemsPerView.mobile,
          },
          768: {
            slidesPerView: itemsPerView.tablet,
          },
          1024: {
            slidesPerView: itemsPerView.desktop,
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
            className="custom-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/80 border-2 border-neon-cyan rounded-full text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300 z-10 flex items-center justify-center text-xl font-bold"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            className="custom-button-next absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/80 border-2 border-neon-cyan rounded-full text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300 z-10 flex items-center justify-center text-xl font-bold"
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}

      {/* Custom Pagination */}
      {showDots && (
        <div className="custom-pagination flex justify-center space-x-3 mt-8"></div>
      )}
    </div>
  );
};

export default Carousel;