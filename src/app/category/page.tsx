"use client"

import { MdArrowBackIos } from "react-icons/md";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState, Suspense, useEffect } from "react";
import { Carousel } from "flowbite-react";
import { getOneCategoryContent, handleClick, handleView } from "../../../utils/api/service";
import ReadMore from "../_components/readMore/readMore";
import { AnimatePresence, motion } from "framer-motion";

export default function CategoryPage(){
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const [contact, setContact] = useState<Boolean>(false)
  const [content, setContent] = useState<any>()
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  
  const router = useRouter();

  useEffect(() => {
    try {
      getOneCategoryContent(id!).then((res)=>{
        setContent(res);
      })

      handleView(id);
    
    } catch (error) {
      console.error(error)
    }
  }, [])

  const openSuccess = () => setSuccessOpen(true);

  const handleContact = async (id: string) => {

    handleClick(id);

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
          descricao: `${localStorage.getItem("user")} se interessou e clicou em ${content.title} `,
          valor: ''
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

  return (
    <>
      <div className="w-full min-h-screen h-full bg-white p-5 pb-20 lg:flex lg:justify-center">
        <div className="lg:w-[60vw]">
        <div className="w-full flex justify-between items-center relative">
          <MdArrowBackIos className='text-2xl left-0 top-[17px] cursor-pointer text-black' onClick={() => {router.back()} } />
          
          <Image 
            src={"https://res.cloudinary.com/dmo7nzytn/image/upload/v1757886696/Logo_Horizontal_164x48_-_A_AGENCIA_logo_rvbbq5.svg"} 
            alt={""}
            width={70}
            height={1160}          
          />  
          
          <div></div>
        </div>
        
        {/* Hero Section */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="my-5"
          >
            <div className="relative h-[15rem] rounded-2xl overflow-hidden shadow-lg">
              <Carousel draggable={true}>
                {content.secondaryImgs.map((img: any, index: any)=>{
                  return <img src={img.imgSrc} alt="" key={index} className="w-full h-full object-cover" />
                })}
              </Carousel>
              {/* Overlay com gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </motion.div>
        )}

        {/* Content Card */}
        {!content ? null : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35, ease: "easeOut" }}
            className="mb-6"
          >
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
              {/* Header com gradiente */}
              <div className="bg-gradient-to-r from-[#8609A3] to-[#5b056e] p-5">
                <h2 className="text-white text-xl font-bold">{content.title}</h2>
                <p className="text-white/80 text-sm mt-1">{content.desc}</p>
              </div>
              
              {/* Body com conteúdo */}
              <div className="p-5">
                <ReadMore text={content.texto} maxLength={100} />
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA Button */}
        {!content ? null : (
          <div className="fixed left-0 bottom-0 w-full flex justify-center p-5 h-20 bg-white border-t border-slate-200">
            <motion.button 
              whileTap={{ scale: 0.98 }}
              className="w-full max-w-md rounded-2xl bg-[#8609A3] font-bold text-white shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={()=>{handleContact(id)}}
            >
              {content.btnText == "" ? "Tenho interesse" : content.btnText}
            </motion.button>
          </div>
        )}


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
      </>
  )   
}