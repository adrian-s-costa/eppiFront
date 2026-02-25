"use client";

import { motion } from "framer-motion";

interface FloatingButtonProps {
  show: boolean;
  currentView: 'list' | 'map';
  onClick: () => void;
}

export default function FloatingButton({ show, currentView, onClick }: FloatingButtonProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center"
    >
      <div className="relative max-w-md w-full">
        {/* Brilho roxo sutil */}
        <motion.div 
          className="absolute inset-0 bg-[#9c27b0] rounded-full filter blur-md opacity-20"
          animate={{
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: "easeInOut"
          }}
        />
        <button
          onClick={onClick}
          className="relative w-full bg-[#8609A3] hover:bg-[#6e0885] text-white font-medium py-3 px-6 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
        >
          {currentView === 'list' ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="whitespace-nowrap">Ver lista completa</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="whitespace-nowrap">Ver no mapa</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
