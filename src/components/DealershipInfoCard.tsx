"use client";

import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import ReadMore from "../app/_components/readMore/readMore";

interface DealershipInfoCardProps {
  dealership: {
    name: string;
    image: string;
    rating: number;
    reviews: number;
    description: string;
  };
  onContact: () => void;
  onMapClick: () => void;
}

export default function DealershipInfoCard({ dealership, onContact, onMapClick }: DealershipInfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mt-6 bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900">{dealership.name}</h2>
        
        {/* Rating */}
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5" fill={i < 4 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-gray-600">{`${dealership.rating} (${dealership.reviews} avaliações)`}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button 
            onClick={onContact}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <FaWhatsapp className="text-xl"/>
            Negocie pelo WhatsApp
          </button>
          <button 
            className="flex items-center justify-center p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onMapClick}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="border-t border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Descrição</h3>
        <ReadMore 
          text={dealership.description || ''}
          maxLength={150}
        />
      </div>
    </motion.div>
  );
}
