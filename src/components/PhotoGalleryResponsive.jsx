import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Mousewheel } from 'swiper/modules';
import api from '../utils/api';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const PhotoGallery = () => {
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

  if (loading) {
    return (
      <div className="photo-gallery-container relative">
        <div className="flex items-center justify-center h-96">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
        </div>
      </div>
    );
  }

  return (
    // Hide gallery on very small devices, show on md and above
    <div className="hidden md:block">
      <div className="photo-gallery-container relative">
        {/* Swiper Gallery */}
        <div 
          className="photo-gallery overflow-hidden mx-auto max-w-4xl"
          style={{
            borderRadius: '20px',
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)',
            border: '2px solid transparent',
            background: 'linear-gradient(45deg, #00ffff, #ff00ff) border-box'
          }}
        >
        <Swiper
          modules={[Navigation, Pagination, Autoplay, Mousewheel]}
          loop={galleryImages.length > 1} // Only enable loop if we have more than 1 image
          speed={700}
          spaceBetween={0}
          slidesPerView={1}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: false,
          }}
          autoplay={galleryImages.length > 1 ? { // Only enable autoplay if we have more than 1 image
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          } : false}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            el: '.gallery-pagination',
          }}
          navigation={{
            nextEl: '.gallery-button-next',
            prevEl: '.gallery-button-prev',
          }}
          className="h-64"
        >
          {galleryImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image.src}
                alt={image.caption}
                className="gallery-image w-full h-96 sm:h-[32rem] object-cover object-center"
                style={{
                  borderRadius: '18px',
                  aspectRatio: '16/9',
                  maxHeight: '100%',
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  background: '#222',
                }}
              />
              <div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 text-white"
                style={{ borderRadius: '0 0 18px 18px' }}
              >
                <h3 className="text-lg font-bold mb-1">{image.title}</h3>
                <p className="text-sm opacity-90">{image.caption}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows */}
        <button
          className="gallery-button-prev absolute left-1 sm:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/80 border-2 border-neon-cyan rounded-full text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300 z-10 flex items-center justify-center text-lg sm:text-xl font-bold"
        >
          ‹
        </button>
        <button
          className="gallery-button-next absolute right-1 sm:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/80 border-2 border-neon-cyan rounded-full text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300 z-10 flex items-center justify-center text-lg sm:text-xl font-bold"
        >
          ›
        </button>

        {/* Custom Pagination */}
        <div className="gallery-pagination flex justify-center mt-4"></div>
      </div>
      </div>
    </div>
  );
};

export default PhotoGallery;
