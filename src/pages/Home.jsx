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
        <div className="container-custom">
          <PhotoGalleryResponsive />
        </div>
      </section>
      
  <EventsSectionHorizontal />
  <FacultyMentorsSection />
  <TeamSectionHorizontal />
    </div>
  );
};

export default Home;
