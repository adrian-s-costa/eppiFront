"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import Image from "next/image";

interface Dealership {
  id: string;
  name: string;
  image: string;
  address: string;
  distance: string;
  coordinates: google.maps.LatLng | google.maps.LatLngLiteral;
  offerId?: string;
}

interface DealershipsMapProps {
  dealerships: Dealership[];
  mainDealership?: Dealership;
  isUnique?: boolean;
}

export default function DealershipsMap({ dealerships, mainDealership, isUnique = false }: DealershipsMapProps) {
  const router = useRouter();
  const [selectedDealershipIndex, setSelectedDealershipIndex] = useState<number | null>(null);

  const { isLoaded: isMapLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyB0dQQVgCQwjRzOZb4nCpBtPA1brvFLPHI",
  });

  const mapDealerships = isUnique && mainDealership ? [mainDealership] : dealerships;
  const mapCenter = selectedDealershipIndex !== null && !isUnique
    ? dealerships[selectedDealershipIndex].coordinates
    : (mainDealership?.coordinates || dealerships[0]?.coordinates);

  if (!isMapLoaded) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-sm">Carregando mapa...</p>
      </div>
    );
  }

  return (
    <div className="relative h-[500px] rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={mapCenter}
        zoom={12}
        options={{
          disableDefaultUI: true,
        }}
      >
        {mapDealerships.map((dealership, index) => (
          <MarkerF
            key={dealership.id}
            position={dealership.coordinates}
            onClick={() => setSelectedDealershipIndex(isUnique ? -1 : index)}
          />
        ))}
      </GoogleMap>

      <AnimatePresence>
        {selectedDealershipIndex !== null && (
          <motion.div
            className="absolute left-0 right-0 bottom-4 px-4"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
          >
            <div
              className="bg-white rounded-2xl shadow-lg p-4 flex space-x-4 cursor-pointer"
              onClick={() => {
                if (selectedDealershipIndex === -1 && mainDealership) {
                  return;
                }
                const d = dealerships[selectedDealershipIndex];
                if (d.offerId) {
                  router.push(`/offer?id=${d.offerId}`);
                }
              }}
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src={
                    selectedDealershipIndex === -1 && mainDealership
                      ? mainDealership.image
                      : dealerships[selectedDealershipIndex].image
                  }
                  alt={
                    selectedDealershipIndex === -1 && mainDealership
                      ? mainDealership.name
                      : dealerships[selectedDealershipIndex].name
                  }
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">
                  {selectedDealershipIndex === -1 && mainDealership
                    ? mainDealership.name
                    : dealerships[selectedDealershipIndex].name}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedDealershipIndex === -1 && mainDealership
                    ? mainDealership.address
                    : dealerships[selectedDealershipIndex].address}
                </p>
                <span className="text-xs text-gray-500">
                  {selectedDealershipIndex === -1 && mainDealership
                    ? mainDealership.distance
                    : dealerships[selectedDealershipIndex].distance}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
