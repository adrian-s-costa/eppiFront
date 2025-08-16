"use client"

import { MdArrowBackIos } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useState, Suspense, useEffect } from "react";
import ReadMore from "../_components/readMore/readMore";
import { getCategoryContent, getOneCampaign } from "../../../utils/api/service";

export default function SpecificOffer(){
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || '';
  const [contact, setContact] = useState<Boolean>(false);
  const [carOffer, setCarOffer] = useState<any>();

  useEffect(() => {
    try {
      getCategoryContent(name!).then((res)=>{
        setCarOffer(res);
      })
    } catch (error) {
      console.error(error)
    }
  }, [])
  
  const router = useRouter();

  return (
      
      <div className="w-full min-h-screen h-full bg-white p-5 pb-20 lg:flex lg:justify-center">
        <div className="lg:w-[60vw] lg:rounded-xl lg:border-black lg:border-2 lg:p-5">
        <div className="w-full flex justify-center relative">
          <MdArrowBackIos className='text-2xl left-0 cursor-pointer absolute text-black' onClick={() => {router.push("/tab")} } />
          <h1 className="xs:text-xl xxs:text-md font-bold text-black dark:text-black">{name}</h1>          
        </div>

        <div className="flex flex-col pt-5 gap-5">
          {carOffer && carOffer.map((carro: any, index: any)=>{
            return <div className="flex items-center lg:cursor-pointer lg:hover:bg-slate-200 lg:p-2 lg:hover:duration-300 lg:rounded-md lg:mb-1" onClick={()=>{router.push(`/category?id=${carro.id}`)}} key={index}>
              <Image quality={100} priority={true} className="xxs:w-[126px] xxs:h-[81px] xs:w-[126px] xs:h-[81px] xs:min-w-[126px] xs:min-h-[81px] xxs:min-w-[126px] xxs:min-h-[81px] rounded-lg bg-cover" src={carro.imgSrc!} alt={""} width={126} height={81}/>
              <div className="flex flex-col ml-4">
                <span className="text-black font-semibold text-[1rem]">{carro.title}</span>
                <span className="text-[#838383] text-[0.925rem]">{carro.desc}</span>
              </div>
            </div>
          })}
        </div>  
        </div>
      </div>
  )   
}