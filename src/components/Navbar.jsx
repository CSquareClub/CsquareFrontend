import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠', type: 'link' },
    { path: '/events', label: 'Events', icon: '📅', type: 'scroll', section: 'events' },
    { path: '/team', label: 'Team', icon: '👥', type: 'scroll', section: 'team' },
    { path: '/contact', label: 'Contact', icon: '📧', type: 'link' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (item) => {
    if (item.type === 'scroll' && item.section) {
      // If we're not on homepage, navigate to homepage first
      if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          scrollToSection(item.section);
        }, 100);
      } else {
        // If we're already on homepage, just scroll
        scrollToSection(item.section);
      }
    } else {
      // For regular links (Home and Contact)
      navigate(item.path);
    }
    closeMobileMenu();
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header
        className={`fixed w-full z-40 transition-all duration-300`}
        style={{
          top: '0px',
          height: '72px',
          padding: '0 48px',
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '3px solid transparent',
          borderImage: 'linear-gradient(90deg, transparent, #00ffff, #ff00ff, transparent) 1',
          boxShadow: '0 8px 32px rgba(0, 255, 255, 0.15)'
        }}
      >
        <nav className="flex justify-between items-center h-full">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative flex items-center cursor-pointer"
          >
            <Link to="/" className="flex items-center">
              <div className="logo relative">
                {/* <img
                  src="/CSquareClubLogo.png"
                  alt="C-Square Club"
                  className="w-12 h-12 object-contain"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.8))',
                    transition: 'all 0.3s ease',
                    animation: 'logoGlow 3s ease infinite'
                  }}
                /> */}
                <h2 className='text-2xl font-bold text-white'>C Square</h2>
              </div>
            </Link>
          </motion.div>

          {/* Navigation Right Section */}
          <div className="nav-right flex items-center">
            {/* Desktop Navigation */}
            <ul className="nav-links hidden lg:flex items-center">
              {navItems.map((item, index) => (
                <li key={item.path} style={{ margin: '0 24px' }}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className="nav-link relative font-medium transition-all duration-300 text-white hover:text-neon-cyan bg-transparent border-none cursor-pointer"
                    style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle lg:hidden text-lg cursor-pointer p-2.5 border-2 rounded transition-all duration-300"
              style={{
                color: '#00ffff',
                borderColor: '#00ffff',
                marginLeft: '16px'
              }}
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={closeMobileMenu} 
        navItems={[...navItems, { path: '/admin', label: 'Admin', icon: '🛠️', isAdmin: true, type: 'link' }]}
        onNavigate={handleNavigation}
      />
    </>
  );
};

export default Navbar;
