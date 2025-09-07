import React, { useRef } from "react";

export default function EventsSection() {
  const scrollRef = useRef(null);

  // Navigation functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  const events = [
    {
      id: 1,
      title: "Hackathon 2025",
      date: "Sep 9, 2025",
      tag: "Upcoming",
      desc: "An exciting coding challenge for innovators.",
      img: "https://images.unsplash.com/photo-1593696954577-ab3d39317b97?fm=jpg&q=60&w=3000",
    },
    {
      id: 2,
      title: "AI Workshop",
      date: "Sep 19, 2025",
      tag: "Upcoming",
      desc: "Hands-on learning with AI tools and frameworks.",
      img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=3000",
    },
    {
      id: 3,
      title: "Cybersecurity Talk",
      date: "Sep 28, 2025",
      tag: "Upcoming",
      desc: "Learn the latest in digital defense.",
      img: "https://images.unsplash.com/photo-1556741533-f6acd647d2fb?w=3000",
    },
  ];

  return (
    <section id="events" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta/10 via-transparent to-neon-cyan/10"></div>
      </div>

      <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-orbitron font-bold mb-6">
            <span className="neon-text">Events & Activities</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join us for exciting workshops, competitions, and networking events
            that push the boundaries of technology
          </p>
        </div>

        {/* Toggle buttons */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-4">
            <button className="px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-neon-cyan to-neon-magenta text-black">
              Upcoming Events
            </button>
            <button className="px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black">
              Past Events
            </button>
          </div>
        </div>

        {/* Swipe / scroll instructions */}
        <p className="text-center text-gray-400 mb-8 text-sm">
          <span className="hidden md:inline">
            👆 Drag to explore events
          </span>
          <span className="md:hidden">👆 Swipe to explore events</span>
        </p>

        {/* Events Track */}
        <div 
          ref={scrollRef}
          className="events-track flex gap-4 md:gap-6 overflow-x-scroll overflow-y-hidden py-4 md:pb-8"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              className="event-card flex-shrink-0 relative w-[clamp(240px,80vw,320px)] h-[clamp(360px,55vh,440px)]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
                {/* Image */}
                <div className="relative flex-[3] overflow-hidden">
                  <img
                    src={event.img}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-green-500 text-white">
                    {event.tag}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>

                {/* Details */}
                <div className="flex-[1] p-3 sm:p-4 md:p-6 flex flex-col justify-between">
                  <div className="text-xs sm:text-sm text-gray-600 mb-2 flex justify-between">
                    <span className="font-medium">{event.date}</span>
                    <span className="text-right text-gray-500 truncate ml-2">
                      {event.title.substring(0, 10)}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-700 text-xs sm:text-sm mb-3 line-clamp-2 flex-grow">
                    {event.desc}
                  </p>
                  <div className="mt-auto">
                    <button className="w-full bg-gray-400 text-white rounded-md py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm md:text-base font-semibold cursor-not-allowed">
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-16">
          <a href="/events" className="btn-secondary text-lg px-8 py-4 inline-block">
            View All Events
          </a>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-24 h-24 border border-neon-magenta opacity-20 rotate-45"></div>
      <div className="absolute bottom-20 left-10 w-16 h-16 border border-neon-cyan opacity-30 rotate-12"></div>
      <div className="absolute top-1/2 right-5 w-2 h-24 bg-gradient-to-b from-transparent via-neon-magenta to-transparent opacity-40"></div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .events-track::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}