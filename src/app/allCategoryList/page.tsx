"use client"

import { MdArrowBackIos } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import { getHomeCategories  } from "../../../utils/api/service";

export default function SpecificOffer(){
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || '';
  const [category, setCategory] = useState<any>();

  useEffect(() => {
    try {
      getHomeCategories().then((res)=>{
        setCategory(res);
      })
    } catch (error) {
      console.error(error)
    }
  }, [])
  
  const router = useRouter();

  return (
      
      <div className="w-full min-h-screen h-full bg-white p-5 pb-20 lg:flex lg:justify-center">
        <div className="lg:w-[60vw] lg:rounded-xl lg:border-black lg:border-2 lg:p-5 ">
        <div className="w-full flex justify-center relative">
          <MdArrowBackIos className='text-2xl left-0 cursor-pointer absolute text-black' onClick={() => {router.push("/tab")} } />
          <h1 className="xs:text-xl xxs:text-md font-bold text-black dark:text-black">Categorias</h1>        
        </div>

        <div className="flex flex-col pt-5 gap-5">
          {category && category.map((category: any, index: any)=>{
            return <div className="flex items-center gap-2 lg:hover:bg-slate-200 lg:p-2 lg:hover:duration-300 lg:rounded-md lg:mb-1 hover:cursor-pointer" onClick={()=>{router.push(`/categoryList?name=${category.name}`)}} key={index}>  
            <div className="xs:w-20 xxs:w-[3.5rem] xxs:h-[3.5rem] xs:h-20 flex justify-center items-center max-w-20 bg-[#F3F5F7] rounded-lg">
              <Image
              src={category.imgSrc}
              priority={true}
              width={50}
              height={50}
              className="xxs:w-[2rem] xxs:h-[2rem] xs:w-[3.125rem] xs:h-[3.125rem]"

              alt="category"
              ></Image>  
            </div>
            <span className="text-black font-semibold text-[1rem]">{category.name}</span>
          </div>
          })}
        </div>  
        </div>
      </div>
  )   
}