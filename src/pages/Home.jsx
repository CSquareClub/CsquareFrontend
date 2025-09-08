import Hero from '../components/sections/Hero';
import Achievements from '../components/sections/Achievements';
import EventsSectionHorizontal from '../components/sections/EventsSectionHorizontal';
import TeamSectionHorizontal from '../components/sections/TeamSectionHorizontal';
import FacultyMentorsSection from '../components/sections/FacultyMentorsSection';
import PhotoGalleryResponsive from '../components/PhotoGalleryResponsive';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Achievements />
      {/* Photo Gallery Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container-custom flex flex-col items-center justify-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-neon-cyan mb-8 text-center drop-shadow-lg">Photo Gallery</h2>
          <p className="text-base sm:text-lg text-gray-300 mb-6 text-center max-w-2xl">Explore highlights from our events, workshops, and club activities. Click on any photo to view it in full size!</p>
          <div className="w-full max-w-4xl mx-auto">
            <PhotoGalleryResponsive />
          </div>
        </div>
      </section>
      
  <div id="events" className="mb-16 lg:mb-24">
    <EventsSectionHorizontal />
  </div>
  <div className="mb-16 lg:mb-24">
    <FacultyMentorsSection />
  </div>
  <div id="team" className="mb-16 lg:mb-24">
    <TeamSectionHorizontal />
  </div>
    </div>
  );
};

export default Home;
