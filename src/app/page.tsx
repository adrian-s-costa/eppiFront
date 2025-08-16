"use client";

import { IoIosArrowForward } from "react-icons/io";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import image1 from "../assets/intro1.png"
import image2 from "../assets/intro2.png"
import image3 from "../assets/intro3.png"

export default function Carousel() {

  const [counter, setCounter] = useState<number>(0)
  const router = useRouter();

  const localStorageLength = typeof window !== "undefined" ? window.localStorage.length : 0

  if(localStorageLength > 0){
    router.push('/tab');
  }

  const handleChange = () =>{
    if (counter < 2 ) setCounter(counter + 1)
  }

  const pages = [
    {
      id: 1,
      imageUrl: image3,
      title: 'Conecte-se com pessoas incriveis'
    },
    {
      id: 2,
      imageUrl: image2,
      title: 'Faça compras inteligentes'
    },
    {
      id: 3,
      imageUrl: image1,
      title: 'E aproveite benefícios exclusivos que só nossos membros tem acesso'
    }
  ]
  
  return (
    <div className="h-screen w-full bg-[#202226] relative">
      {counter == 0 ? <Image priority={true} className="w-full" src={image3} alt={"intro"} width={428} height={545}></Image> : counter == 1 ? <Image className="w-full" priority={true} src={image2} alt={"intro"} width={428} height={545}></Image> : <Image priority={true} className="w-full" src={image1} alt={"intro"} width={428} height={545}></Image>}
      <p className="text-white text-[1.8rem] font-bold mt-10 ml-5">{pages[counter].title}</p>
      
      <div className="flex ml-5 gap-2 mt-5">
        <div className={`${counter == 0 ? 'w-14' : 'w-2'} h-2 ${counter == 0 ? 'bg-white' : 'bg-slate-600'} rounded-full`}></div>
        <div className={`${counter == 1 ? 'w-14' : 'w-2'} h-2 ${counter == 1 ? 'bg-white' : 'bg-slate-600'} rounded-full`}></div>
        <div className={`${counter == 2 ? 'w-14' : 'w-2'} h-2 ${counter == 2 ? 'bg-white' : 'bg-slate-600'} rounded-full`}></div>
      </div>

      <button onClick={()=>{ handleChange() }} className={`absolute ${counter == 2 ? 'hidden' : null} right-5 bottom-5 w-[3.5rem] h-[3.5rem] bg-white rounded-full flex justify-center items-center`}><IoIosArrowForward className="text-3xl text-black dark:text-black"/></button>

      {counter == 2 ? <div className="absolute bottom-5 w-full h-[2.80rem] flex justify-center px-8"><button onClick={()=>{router.push('/login')}} className="bg-white rounded-3xl w-full text-black dark:text-black">Vamos?</button></div> : null}
    </div>

  );
}
