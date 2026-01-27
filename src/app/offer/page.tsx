"use client"

import { MdArrowBackIos } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
 
import { useState, useEffect, useRef, Key, SetStateAction, AwaitedReactNode, JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import ReadMore from "../_components/readMore/readMore";
import { getCampaignByDealershipId, getCampaigns, getDealershipById, getDealerships, getOneCampaign } from "../../../utils/api/service";
import ModalImage from "react-modal-image";
import { AnimatePresence, motion } from "framer-motion";
import { BoxedAccordion, BoxedAccordionItem, IconAcademicLight, IconInformationRegular } from '@telefonica/mistica';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
import { StaticImport } from "next/dist/shared/lib/get-img-props";


export default function SpecificOffer(){
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'map'>('list');
  const dealershipsSectionRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [contact, setContact] = useState<Boolean>(false);
  //const [carOffer, setCarOffer] = useState<any>();
  const [preview, setPreview] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [ campaigns, setCampaigns ] = useState<any>()
  const [isDealershipModalOpen, setIsDealershipModalOpen] = useState(false);
  const [modalView, setModalView] = useState<'list' | 'map'>('list');
  const [selectedDealershipIndex, setSelectedDealershipIndex] = useState<number | null>(null);
  const [dealerships, setDealerships] = useState<any>(null);
  const [dealership, setDealership] = useState<any>(null);
  

  useEffect(() => {
    try {
      getDealerships().then((res)=>{
        setDealerships(res);
      })
    } catch (error) {
      console.error(error)
    }

    try {
      getDealershipById(id).then((res)=>{
        setDealership(res);
      })
    } catch (error) {
      console.error(error)
    }
  }, [])

  const openDealershipModal = (view: 'list' | 'map') => {
    setModalView(view);
    setIsDealershipModalOpen(true);
  };

  const { isLoaded: isMapLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyB0dQQVgCQwjRzOZb4nCpBtPA1brvFLPHI",
  });

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

  // useEffect(() => {
  //   try {
  //     getCampaigns().then((res) => {
  //       setCampaigns(res);
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [])

  useEffect(()=>{
    try {
      getCampaignByDealershipId(id).then((res) => {
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

  
  const router = useRouter();

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
          descricao: `${localStorage.getItem("user")} quer iniciar uma negociação do produto: ${dealership.name}`,
          valor: dealership.name,
        })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }
      const responseData = await response.json();
      
      const encodedText = encodeURIComponent('Olá! Gostaria de mais informações.');
      const whatsappUrl = `https://wa.me/67992214009?text=${encodedText}`;
      
      openSuccess();
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  }

  function spaceToPlus(text: string): string {
    return text.replace(/ /g, "+");
  }


  return (
      <div className="w-full min-h-screen h-full bg-white p-5 pb-20 lg:flex lg:justify-center lg:items-center lg:flex-col">
        <div className="lg:w-[60vw]">
          <div className="w-full flex justify-between items-center  relative">
            <div className="flex h-full items-center">
              <MdArrowBackIos className='text-2xl top-[17px] left-0 cursor-pointer text-black' onClick={() => {router.push("/tab")} } />
              <h1 className="xxs:text-sm xs:text-lg font-bold">{dealership && dealership.name}</h1>
            </div>
            
            <Image 
              src={"https://res.cloudinary.com/dmo7nzytn/image/upload/v1757886696/Logo_Horizontal_164x48_-_A_AGENCIA_logo_rvbbq5.svg"} 
              alt={""}
              width={70}
              height={1160}          
            />            
          </div>
          
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
                    onClick={handleContact}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <FaWhatsapp className="text-xl"/>
                    Negocie pelo WhatsApp
                  </button>
                  <button 
                    className="flex items-center justify-center p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      // Open map with dealership location
                      window.open(`https://www.google.com/maps/search/?api=1&query=${spaceToPlus(dealership.name)}`, '_blank');
                    }}
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
                  text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                  maxLength={150}
                />
              </div>
            </motion.div>
          )}
          <div className="mt-12">
            <h1 className={`text-lg font-bold mb-4`}>O que há de novo</h1>
            <div className="flex overflow-x-scroll gap-3">
              {campaigns && campaigns
              // .filter((carro: any) => carro.uf.includes(uf))
              .map((carro: any, index: number)=>{
                return <Link
                  href={{
                    pathname: '/offerProduct',
                    query: { id: carro.id },
                  }}
                  key={index}
                  className="relative"
                >
                  <Image quality={100} priority={true} className="xxs:w-[202px] xxs:h-[117px] xs:w-[232px] xs:h-[147px] rounded-lg mb-2 xs:min-w-[232px] xs:min-h-[147px] xxs:min-w-[202px] xxs:min-h-[117px] bg-cover" src={carro.imgSrc!} alt={""} width={230} height={125}/>
                  <div className="flex flex-col gap-1 xxs:w-[202px] xs:w-[232px]">
                    <span className="xs:text-base xxs:text-sm font-semibold">{carro.title}</span>
                    <span className="xs:text-sm xxs:text-xs">{carro.desc}</span>
                    <span className="text-[#838383] xs:text-base xxs:text-sm dark:text-black">{carro.price}</span>
                  </div>
                </Link>
              })}
            </div>
          </div>
          {/* Seção de visualização (Lista/Mapa) */}
          <div ref={dealershipsSectionRef} className="mt-6 sm:mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <h1 className="text-base sm:text-lg font-bold whitespace-nowrap">Concessionárias próximas</h1>
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

            {/* Filtros */}
            <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-4 gap-2">
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                <span className="text-xs xs:text-sm text-gray-600 whitespace-nowrap">3 resultados</span>
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

            {/* Conteúdo da visualização */}
            {currentView === 'list' ? (
              <div className="space-y-4">
                {dealerships && dealerships.slice(0, 3).map((dealership: any) => (
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
                      <button
                        className="mt-2 px-3 py-1 bg-[#8609A3] text-white text-xs rounded-full hover:bg-[#6e0885] transition-colors"
                        onClick={() => {
                          router.push(`/offer?id=${dealership.offerId}`);
                        }}
                      >
                        Ver ofertas
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative h-[500px] rounded-lg overflow-hidden">
                {!isMapLoaded ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500 text-sm">Carregando mapa...</p>
                  </div>
                ) : (
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={
                      selectedDealershipIndex !== null
                        ? dealerships[selectedDealershipIndex].coordinates
                        : dealerships[0].coordinates
                    }
                    zoom={12}
                    options={{
                      disableDefaultUI: true,
                    }}
                  >
                    {dealerships.map((dealership: { id: Key | null | undefined; coordinates: google.maps.LatLng | google.maps.LatLngLiteral; }, index: SetStateAction<number | null>) => (
                      <MarkerF
                        key={dealership.id}
                        position={dealership.coordinates}
                        onClick={() => setSelectedDealershipIndex(index)}
                      />
                    ))}
                  </GoogleMap>
                )}

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
                          const d = dealerships[selectedDealershipIndex];
                          router.push(`/offer?id=${d.offerId}`);
                        }}
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
                          <Image
                            src={dealerships[selectedDealershipIndex].image}
                            alt={dealerships[selectedDealershipIndex].name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {dealerships[selectedDealershipIndex].name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {dealerships[selectedDealershipIndex].address}
                          </p>
                          <span className="text-xs text-gray-500">
                            {dealerships[selectedDealershipIndex].distance}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
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
          <AnimatePresence>
            {successOpen && (
              <motion.div
                className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={()=> setSuccessOpen(false)}
              >
                <motion.div
                  initial={{ y: 24, opacity: 0, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 12, opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="relative w-full max-w-md bg-white rounded-2xl p-6 text-center shadow-2xl"
                  onClick={(e)=> e.stopPropagation()}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 340, damping: 18 }}
                    className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 7L9 18L4 13" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-black">Contato enviado!</h3>
                  <p className="text-slate-600 mt-1">Recebemos seu interesse. Em breve um vendedor falará com você.</p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      className="w-full py-3 rounded-xl border border-slate-200 text-slate-700"
                      onClick={()=> setSuccessOpen(false)}
                    >
                      Fechar
                    </button>
                    <button
                      className="w-full py-3 rounded-xl bg-[#8609A3] text-white font-semibold"
                      onClick={()=> { setSuccessOpen(false); router.push('/tab'); }}
                    >
                      Ir para início
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Modal de concessionárias (lista / mapa) */}
          <AnimatePresence>
            {isDealershipModalOpen && (
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
                      onClick={() => setIsDealershipModalOpen(false)}
                    />
                    <h2 className="ml-2 text-base font-bold">
                      {dealership?.name || 'BYD Itavema'}
                    </h2>
                  </div>
                  <Image 
                    src={"https://res.cloudinary.com/dmo7nzytn/image/upload/v1757886696/Logo_Horizontal_164x48_-_A_AGENCIA_logo_rvbbq5.svg"} 
                    alt={""}
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
                      {dealerships.map((dealership: { id: Key | null | undefined; offerId: any; image: string | StaticImport; name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined; address: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; distance: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }, index: any) => (
                        <div
                          key={dealership.id}
                          className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-4"
                          onClick={() => {
                            router.push(`/offer?id=${dealership.offerId}`);
                          }}
                        >
                          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                            <Image
                              src={dealership.image}
                              alt={dealership.name as string}
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
                    <div className="relative h-full">
                      {!isMapLoaded ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <p className="text-gray-500 text-sm">Carregando mapa...</p>
                        </div>
                      ) : (
                        <GoogleMap
                          mapContainerStyle={{ width: "100%", height: "100%" }}
                          center={
                            selectedDealershipIndex !== null
                              ? dealerships[selectedDealershipIndex].coordinates
                              : dealerships[0].coordinates
                          }
                          zoom={12}
                          options={{
                            disableDefaultUI: true,
                          }}
                        >
                          {dealerships.map((dealership: { id: Key | null | undefined; coordinates: google.maps.LatLng | google.maps.LatLngLiteral; }, index: SetStateAction<number | null>) => (
                            <MarkerF
                              key={dealership.id}
                              position={dealership.coordinates}
                              onClick={() => setSelectedDealershipIndex(index)}
                            />
                          ))}
                        </GoogleMap>
                      )}

                      <AnimatePresence>
                        {selectedDealershipIndex !== null && (
                          <motion.div
                            className="absolute left-0 right-0 bottom-4 px-5"
                            initial={{ y: 80, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 80, opacity: 0 }}
                          >
                            <div
                              className="bg-white rounded-2xl shadow-lg p-4 flex space-x-4 cursor-pointer"
                              onClick={() => {
                                const d = dealerships[selectedDealershipIndex];
                                router.push(`/offer?id=${d.offerId}`);
                              }}
                            >
                              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
                                <Image
                                  src={dealerships[selectedDealershipIndex].image}
                                  alt={dealerships[selectedDealershipIndex].name}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold">
                                  {dealerships[selectedDealershipIndex].name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {dealerships[selectedDealershipIndex].address}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {dealerships[selectedDealershipIndex].distance}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Botão flutuante */}
          <AnimatePresence>
            {showFloatingButton && !isDealershipModalOpen && (
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
                    onClick={() => {
                      if (currentView === 'list') {
                        setSelectedDealershipIndex(null);
                        openDealershipModal('list');
                      } else {
                        setSelectedDealershipIndex(null);
                        openDealershipModal('map');
                      }
                    }}
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
            )}
          </AnimatePresence>
        </div>
      </div>
  )   
}