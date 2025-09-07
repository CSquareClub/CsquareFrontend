import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import CustomCursor from './components/CustomCursor';
import ParticleBackground from './components/ParticleBackground';
import EnhancedBackground from './components/EnhancedBackground';
import ToastNotification from './components/ToastNotification';
import NotificationBar from './components/NotificationBar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <div className="loading-text">INITIALIZING C-SQUARE NETWORK...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <CustomCursor />
          <ParticleBackground />
          <EnhancedBackground />
          
          <ToastNotification />
          {/* <NotificationBar /> */}
          <Navbar />
          
          <main className="relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
