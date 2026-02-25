"use client";

import Image from "next/image";
import Link from "next/link";

interface Dealership {
  id: string;
  name: string;
  image: string;
  address: string;
  rating: number;
  reviews: number;
  distance: string;
  storeCode: string;
}

interface DealershipsListProps {
  dealerships: Dealership[];
  onUpdateId: (id: string) => void;
}

export default function DealershipsList({ dealerships, onUpdateId }: DealershipsListProps) {
  return (
    <div className="space-y-4">
      {dealerships.slice(0, 3).map((dealership) => (
        <div key={dealership.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4 hover:shadow-md transition-shadow">
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
            <div className="flex items-center mt-1">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4" fill={star <= 4 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">{dealership.rating.toFixed(1)} ({dealership.reviews})</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500 block">{dealership.distance}</span>
            <Link
              href={{
                pathname: `/offer`,
                query: { id: dealership.id, storeCode: dealership.storeCode },
              }}
            >
              <button
                className="mt-2 px-3 py-1 bg-[#8609A3] text-white text-xs rounded-full hover:bg-[#6e0885] transition-colors"
                onClick={() => onUpdateId(dealership.id)}
              >
                Ver ofertas
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
