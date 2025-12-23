"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Import your images here
import onboarding1 from "../assets/onboarding1.png";
import onboarding2 from "../assets/onboarding2.png";
import onboarding3 from "../assets/onboarding3.png";
import logo from "../assets/logo.png";

type Screen = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: any;
  bgColor: string;
  shapeColor: string;
  buttonText: string;
  buttonColor: string;
  highlight1?: string;
  highlight2?: string;
  highlightColor1?: string;
  highlightColor2?: string;
  skipButton?: boolean;
};

export default function Onboarding() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const localStorageLength = typeof window !== "undefined" ? window.localStorage.length : 0;
    if (localStorageLength > 0) {
      router.push('/tab');
    }
  }, [router]);

  const screens: Screen[] = [
    {
      id: 1,
      title: "O fim das ",
      subtitle: "O começo das ",
      highlight1: "buscas.",
      highlight2: "descobertas.",
      description: "Ative sua localização e o éppi encontra os melhores serviços, lugares e cupons de desconto onde você estiver.",
      image: onboarding1,
      bgColor: "bg-[#FFF5F1]",
      shapeColor: "#FFE8E0",
      buttonText: "Continuar",
      buttonColor: "bg-[#7A229D] hover:bg-[#7B1FA2]",
      highlightColor1: "text-[#7A229D]",
      highlightColor2: "text-[#DF794D]",
      skipButton: true
    },
    {
      id: 2,
      title: "Entretenimento ",
      subtitle: "Indicações ",
      highlight1: "útil.",
      highlight2: "inteligentes.",
      description: "Creators locais, embaixadores nacionais e marcas convidadas. Nada aleatório. Tudo pensado pra facilitar sua vida.",
      image: onboarding2,
      bgColor: "bg-[#F9F6FF]",
      shapeColor: "#F0E8FF",
      buttonText: "Continuar",
      buttonColor: "bg-[#7A229D] hover:bg-[#7B1FA2]",
      highlightColor1: "text-[#DF794D]",
      highlightColor2: "text-[#7A229D]",
      skipButton: true
    },
    {
      id: 3,
      title: "Curtiu? ",
      subtitle: "Chama no ",
      highlight1: "whatsapp",
      highlight2: "",
      description: "O Éppi conecta você ao WhatsApp da marca ou empresa num toque. Pesquisar, combinar ou comprar é rápido e sem enrolação.",
      image: onboarding3,
      bgColor: "bg-[#F0FAFF]",
      shapeColor: "#E0F7FF",
      buttonText: "Fazer parte",
      buttonColor: "bg-[#DF794D] hover:bg-[#E65100]"
    }
  ];

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      router.push('/login');
    }
  };

  const handleSkip = () => {
    router.push('/login');
  };

  const current = screens[currentScreen];

  return (
    <div className={`h-screen w-full flex flex-col ${current.bgColor} relative overflow-hidden`}>
      {/* <div className=" absolute h-[450px] w-[350px] rotate-[-10deg] top-[-38px]   bg-black rounded-b-full">a</div> */}
      

      {/* Main Content */}
      <div className="flex flex-col justify-start z-10">
        {/* Logo */}
        {/* <div className="w-24 h-12 relative mb-12">
          <Image
            src={logo}
            alt="éppi"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div> */}

        {/* Illustration */}
        <div className="w-full flex justify-center mb-8">
          <Image
            src={current.image}
            alt="Onboarding"
            // layout="fill"
            // objectFit="contain"
            priority
            className="drop-shadow-lg w-full"
          />
        </div>
        
        {
          current.id == 3 ?   
          <div className="text-left mb-2 px-8">
            <h1 className="text-2xl font-black text-[#7A229D]">
              Curtiu?
            </h1>

             <h2 className="text-[24px] font-black ">
              Chama no <span className="text-[#08B65F]">WhatsApp.</span>
            </h2>
          </div> 
        :  
          <div className="text-left mb-2 px-8">
            <h1 className="text-2xl font-black">
              {current.title}
              {current.highlight1 && (
                <span className={current.highlightColor1}>
                  {current.highlight1}
                </span>
              )}
            </h1>
            <h2 className="text-[24px] font-black">
              {current.subtitle}
              {current.highlight2 && (
                <span className={current.highlightColor2}>
                  {current.highlight2}
                </span>
              )}
            </h2>
          </div>
        }
        <p className="text-left text-gray-700 text-sm px-8 mb-4">
          {current.description}
        </p>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-2 mb-4 z-10">
        {screens.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentScreen ? 'w-6 bg-[#DF794D]' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="px-6 pb-8 z-10">
        <button
          onClick={handleNext}
          className={`w-full py-2 rounded-full text-white font-bold text-lg ${current.buttonColor} mb-2 transition-colors duration-300 shadow-md`}
        >
          {current.buttonText} &gt;
        </button>
        
        {current.skipButton && (

          <button
          onClick={handleSkip}
          className={`w-full py-2 rounded-full text-white font-bold text-lg bg-[#DF794D] mb-2 transition-colors duration-300 shadow-md`}
        >
          Pular &gt;
        </button>
        )}
      </div>
    </div>
  );
}
