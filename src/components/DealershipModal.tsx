"use client";

import { useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DealershipsMap from "./DealershipsMap";

interface Dealership {
  id: string;
  name: string;
  image: string;
  address: string;
  rating: number;
  reviews: number;
  distance: string;
  storeCode: string;
  coordinates: google.maps.LatLng | google.maps.LatLngLiteral;
  offerId?: string;
}

interface DealershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealerships: Dealership[];
  mainDealership?: Dealership;
  isUnique?: boolean;
  onUpdateId: (id: string) => void;
}

export default function DealershipModal({ 
  isOpen, 
  onClose, 
  dealerships, 
  mainDealership,
  isUnique = false,
  onUpdateId 
}: DealershipModalProps) {
  const router = useRouter();
  const [modalView, setModalView] = useState<'list' | 'map'>('list');

  const handleDealershipClick = (dealership: Dealership) => {
    if (dealership.offerId) {
      router.push(`/offer?id=${dealership.offerId}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-white"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 260 }}
        >
          <div className="p-5 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center">
              <MdArrowBackIos
                className="text-2xl cursor-pointer text-black"
                onClick={onClose}
              />
              <h2 className="ml-2 text-base font-bold">
                {mainDealership?.name || 'BYD Itavema'}
              </h2>
            </div>
            <Image 
              src={"https://res.cloudinary.com/dmo7nzytn/image/upload/v1757886696/Logo_Horizontal_164x48_-_A_AGENCIA_logo_rvbbq5.svg"} 
              alt=""
              width={70}
              height={1160}          
            />
          </div>

          <div className="px-5 pt-4">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setModalView('list')}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm ${modalView === 'list' ? 'bg-white shadow-sm text-[#8609A3]' : 'text-gray-500'}`}
              >
                <span>Lista</span>
              </button>
              <button
                onClick={() => setModalView('map')}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm ${modalView === 'map' ? 'bg-white shadow-sm text-[#8609A3]' : 'text-gray-500'}`}
              >
                <span>Mapa</span>
              </button>
            </div>
          </div>

          <div className="mt-4 h-[calc(100vh-150px)]">
            {modalView === 'list' ? (
              <div className="h-full overflow-y-auto px-5 pb-6 space-y-4">
                {dealerships.map((dealership) => (
                  <div
                    key={dealership.id}
                    className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-4 cursor-pointer"
                    onClick={() => handleDealershipClick(dealership)}
                  >
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={dealership.image}
                        alt={dealership.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{dealership.name}</h3>
                      <p className="text-sm text-gray-600">{dealership.address}</p>
                      <span className="text-xs text-gray-500">{dealership.distance}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <DealershipsMap
                dealerships={dealerships}
                mainDealership={mainDealership}
                isUnique={isUnique}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
