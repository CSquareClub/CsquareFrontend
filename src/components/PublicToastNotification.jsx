import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const PublicToastNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchToast = async () => {
      try {
        const response = await api.get('/toast');
        const activeToasts = response.data.data?.filter(t => t.isActive) || [];
        const toastToShow = activeToasts.length > 0 ? activeToasts[0] : null;
        setToast(toastToShow);
        if (toastToShow) {
          setTimeout(() => setIsVisible(true), 2000);
          setTimeout(() => setIsVisible(false), 12000);
        }
      } catch (error) {
        setToast(null);
      }
    };
    fetchToast();
  }, []);

  if (!toast) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="toast-notification fixed z-50 top-8 left-1/2 -translate-x-1/2"
        >
          <div className="bg-black bg-opacity-95 backdrop-blur-lg border-2 border-neon-cyan rounded-xl overflow-hidden shadow-2xl shadow-neon-cyan/20 w-80 sm:w-96 flex flex-col">
            {toast.photo && (
              <img src={toast.photo} alt="Toast" className="w-full h-40 object-cover" />
            )}
            <div className="p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-orbitron font-bold text-white mb-2 line-clamp-2">
                  {toast.message}
                </h4>
                {toast.eventId && (
                  <span className="text-neon-cyan text-xs">Related Event: {toast.eventId.title}</span>
                )}
              </div>
            </div>
          </div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 -z-10 blur-xl"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PublicToastNotification;
