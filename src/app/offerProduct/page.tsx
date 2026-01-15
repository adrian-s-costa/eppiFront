"use client"

import { MdArrowBackIos } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
 
import { useState, Suspense, useEffect } from "react";
import ReadMore from "../_components/readMore/readMore";
import { getOneCampaign } from "../../../utils/api/service";
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


export default function SpecificOffer(){
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [contact, setContact] = useState<Boolean>(false);
  const [carOffer, setCarOffer] = useState<any>();
  const [preview, setPreview] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      getOneCampaign(id).then((res)=>{
        setCarOffer(res);
      })
    } catch (error) {
      console.error(error)
    }
  }, [])
  
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
          descricao: `${localStorage.getItem("user")} quer iniciar uma negociação do produto: ${carOffer.title}`,
          valor: carOffer.price,
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

  return (
      <div className="w-full min-h-screen h-full bg-white p-5 pb-20 lg:flex lg:justify-center lg:items-center lg:flex-col">
        <div className="lg:w-[60vw]">
          <div className="w-full flex justify-between items-center  relative">
            <div className="flex h-full items-center">
              <MdArrowBackIos className='text-2xl top-[17px] left-0 cursor-pointer text-black' onClick={() => {router.push("/tab")} } />
              <h1 className="xxs:text-sm xs:text-lg font-bold">{carOffer && carOffer.title}</h1>
            </div>
            
            <Image 
              src={"https://res.cloudinary.com/dmo7nzytn/image/upload/v1757886696/Logo_Horizontal_164x48_-_A_AGENCIA_logo_rvbbq5.svg"} 
              alt={""}
              width={70}
              height={1160}          
            />            
          </div>
          
          <Image
            quality={100}
            priority={true}
            className="rounded-md mt-5"
            src={carOffer && carOffer.imgSrc}
            alt={""}
            width={1920}
            height={1}
          ></Image>

          {!carOffer ? null : 
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="xs:mt-8 xxs:mt-5"
            >
              {(() => {
                const highlights = (carOffer?.texto || '').split('\n').filter(Boolean).slice(0,3);
                return (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
                    {/* Cabeçalho com gradiente e preço flutuante */}
                    <div className="relative bg-gradient-to-r from-[#8609A3] to-[#5b056e] p-5">
                      <h2 className="text-white text-xl font-bold pr-28">{carOffer.title}</h2>
                      <div className="absolute top-4 right-4 bg-white text-[#5b056e] font-bold px-3 py-1 rounded-full shadow-sm">
                        {carOffer.price}
                      </div>
                    </div>

                    {/* Corpo com chips e acordeão */}
                    <div className="p-5">
                      {highlights.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {highlights.map((h: string, idx: number) => (
                            <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                              {h.length > 26 ? h.slice(0, 26) + '…' : h}
                            </span>
                          ))}
                        </div>
                      )}

                      <Accordion type="single" collapsible>
                        <AccordionItem value="specs">
                          <AccordionTrigger>Especificações completas</AccordionTrigger>
                          <AccordionContent>
                            <span className='text-[1rem] text-black whitespace-pre-wrap break-words'>
                              {carOffer.texto}
                            </span>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          }

          <div className="xs:mt-8 xxs:mt-5">
            <div className="flex overflow-x-scroll gap-3">
              {carOffer && carOffer.secondaryImgs.map((carro: any, index: any)=>{
                return <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                  key={carro.id}
                  onClick={()=> setPreview(carro.imgSrc!)}
                >
                  <Image
                    className="xxs:w-[202px] xxs:h-[117px] xs:w-[232px] xs:h-[147px]  xs:min-w-[232px] xs:min-h-[147px] xxs:min-w-[202px] xxs:min-h-[117px] rounded-lg mb-2 object-cover"
                    src={carro.imgSrc!}
                    alt={"Imagem do veículo"}
                    width={232}
                    height={147}
                  />
                </motion.button>
              })}
            </div>
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
                    src={preview}
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

          <div className="fixed left-0 bottom-0 w-full flex justify-between p-5 h-20 bg-white">
            <button className="rounded-full xxs:text-[0.6rem] bg-[#8609A3] w-full font-bold text-white xs:text-sm xs:py-[0.3rem] xs:px-[0.5rem] xxs:px-[0.5rem]" onClick={()=>{handleContact()}}>Comece uma negociação</button>
          </div>

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
        </div>
      </div>
  )   
}