"use client"

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { getCampaignByDealershipId, getDealershipById, getDealerships } from "../../../utils/api/service";
import LoadingSpinner from "../../components/LoadingSpinner";
import OfferHeader from "../../components/OfferHeader";
import DealershipInfoCard from "../../components/DealershipInfoCard";
import CampaignsList from "../../components/CampaignsList";
import DealershipsList from "../../components/DealershipsList";
import DealershipsMap from "../../components/DealershipsMap";
import SuccessModal from "../../components/SuccessModal";
import DealershipModal from "../../components/DealershipModal";
import FloatingButton from "../../components/FloatingButton";


export default function SpecificOffer(){
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'map'>('list');
  const dealershipsSectionRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const storeCode = searchParams.get('storeCode');
  const [contact, setContact] = useState<Boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [campaigns, setCampaigns] = useState<any>(null);
  const [isDealershipModalOpen, setIsDealershipModalOpen] = useState(false);
  const [selectedDealershipIndex, setSelectedDealershipIndex] = useState<number | null>(null);
  const [dealerships, setDealerships] = useState<any>(null);
  const [isUnique, setIsUnique] = useState<any>(false);
  const [dealership, setDealership] = useState<any>(null);
  const [idForReq, setIdForReq] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  const extendedDealerships = dealership ? [dealership, ...dealerships.filter((d: any) => d.id !== dealership.id)] : dealerships;


  const updateId = (id: any) => {
    setIdForReq(id)
  }

  const openDealershipModal = (view: 'list' | 'map') => {
    setIsDealershipModalOpen(true);
  };

  // Efeito para controlar o scroll e mostrar/ocultar o botão flutuante
  useEffect(() => {
    const handleScroll = () => {
      if (dealershipsSectionRef.current) {
        const rect = dealershipsSectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionHeight = rect.bottom - rect.top;
        const sectionMiddle = rect.top + (sectionHeight / 2);
        
        // Mostrar o botão quando o usuário rolar até a metade da seção
        if (sectionMiddle < windowHeight && rect.bottom > 0) {
          setShowFloatingButton(true);
        } else {
          setShowFloatingButton(false);
        }
      }
    };

    // Adiciona um event listener para o scroll com debounce para melhor performance
    let timeoutId: NodeJS.Timeout;
    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 50);
    };

    window.addEventListener('scroll', debouncedScroll, { passive: true });
    // Verificar na montagem do componente
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const [dealershipsRes, dealershipRes] = await Promise.all([
          getDealerships({storeCode: storeCode || "-1"}),
          getDealershipById(idForReq || id)
        ]);
        setDealerships(dealershipsRes);
        setDealership(dealershipRes);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idForReq, id, storeCode]);

  useEffect(()=>{
    try {
      getCampaignByDealershipId(id).then((res: any) => {
        setCampaigns(res);
      });
    } catch (error) {
      console.error(error);
    }
  }, [dealership])

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isDealershipModalOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isDealershipModalOpen]);

  
  const openSuccess = () => setSuccessOpen(true);

  const handleContact = async () => {
    if (contact) return null;
    setContact(true);
    try {
      const response = await fetch(`https://acesso.meets.com.br/oportunidade/salvar`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': '8C9DB575-0A8B-7CC5-4389-41D2CC6E9937'
        },
        body: JSON.stringify({
          id_usuario: 37456,
          id_origem: 313,
          razao_cliente: localStorage.getItem('user'),
          fantasia: localStorage.getItem('user'),
          email_cliente: localStorage.getItem('email'), 
          celular_cliente: localStorage.getItem('number'), 
          descricao: `${localStorage.getItem("user")} quer iniciar uma negociação do produto: ${dealership?.name}`,
          valor: dealership?.name,
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }
      
      const responseData = await response.json();
      openSuccess();
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  }

  const handleMapClick = () => {
    setIsUnique(true);
    openDealershipModal('map');
  };

  const handleFloatingButtonClick = () => {
    setSelectedDealershipIndex(null);
    setIsUnique(false);
    openDealershipModal(currentView);
  };


  return (
      <div className="w-full min-h-screen h-full bg-white p-5 pb-20 lg:flex lg:justify-center lg:items-center lg:flex-col">
        <div className="lg:w-[60vw]">
          {/* Loading Screen */}
          {isLoading && <LoadingSpinner />}
          
          {/* Header */}
          <OfferHeader dealershipName={dealership?.name} />
          
          {/* Main Image */}
          <div className="relative w-full h-64 rounded-xl overflow-hidden mt-5">
            <Image
              quality={100}
              priority={true}
              className="object-cover w-full h-full"
              src={dealership?.image || ''}
              alt={dealership?.name || 'Carro em oferta'}
              fill
            />
          </div>

          {/* Dealership Info Card */}
          {dealership && (
            <DealershipInfoCard
              dealership={dealership}
              onContact={handleContact}
              onMapClick={handleMapClick}
            />
          )}

          {/* Campaigns List */}
          <CampaignsList campaigns={campaigns} />
          {/* Other Dealerships Section */}
          {dealerships && dealerships.length > 0 && (
            <div ref={dealershipsSectionRef} className="mt-6 sm:mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h1 className="text-base sm:text-lg font-bold whitespace-nowrap">Outras unidades</h1>
                <div className="w-full sm:w-auto flex bg-gray-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setCurrentView('list')}
                    className={`flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base ${currentView === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span className="text-sm sm:text-sm">Lista</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('map')}
                    className={`flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base ${currentView === 'map' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm sm:text-sm">Mapa</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-4 gap-2">
                <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                  <span className="text-xs xs:text-sm text-gray-600 whitespace-nowrap">{extendedDealerships.length + " resultados"}</span>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-xs xs:text-sm text-gray-600 whitespace-nowrap">
                    <span className="hidden sm:inline">Ordenar</span> por:
                  </span>
                  <select className="text-xs xs:text-sm bg-white border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#8609A3] focus:border-transparent">
                    <option>Distância</option>
                    <option>Preço</option>
                    <option>Avaliação</option>
                  </select>
                </div>
              </div>

              {/* Content */}
              {currentView === 'list' ? (
                <DealershipsList 
                  dealerships={extendedDealerships} 
                  onUpdateId={updateId}
                />
              ) : (
                <DealershipsMap 
                  dealerships={extendedDealerships}
                  mainDealership={dealership}
                />
              )}
            </div>
          )}
          {/* Preview Modal */}
          <AnimatePresence>
            {preview && (
              <motion.div 
                className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={()=> setPreview(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="relative w-[90vw] max-w-4xl"
                  onClick={(e)=> e.stopPropagation()}
                >
                  <Image
                    src={preview as string}
                    alt={"Pré-visualização"}
                    width={1600}
                    height={900}
                    className="w-full h-auto rounded-xl object-contain shadow-2xl"
                  />
                  <button
                    className="absolute -top-3 -right-3 bg-white text-black rounded-full w-9 h-9 shadow-md"
                    onClick={()=> setPreview(null)}
                    aria-label="Fechar"
                  >
                    ✕
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Modal */}
          <SuccessModal 
            isOpen={successOpen} 
            onClose={() => setSuccessOpen(false)} 
          />
          
          {/* Dealership Modal */}
          <DealershipModal
            isOpen={isDealershipModalOpen}
            onClose={() => setIsDealershipModalOpen(false)}
            dealerships={dealerships || []}
            mainDealership={dealership}
            isUnique={isUnique}
            onUpdateId={updateId}
          />
          
          {/* Floating Button */}
          <FloatingButton
            show={showFloatingButton && !isDealershipModalOpen}
            currentView={currentView}
            onClick={handleFloatingButtonClick}
          />
        </div>
      </div>
  )   
}