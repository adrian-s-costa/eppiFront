"use client";

import { MdArrowBackIos } from "react-icons/md";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface OfferHeaderProps {
  dealershipName?: string;
}

export default function OfferHeader({ dealershipName }: OfferHeaderProps) {
  const router = useRouter();

  return (
    <div className="w-full flex justify-between items-center relative">
      <div className="flex h-full items-center">
        <MdArrowBackIos 
          className='text-2xl top-[17px] left-0 cursor-pointer text-black' 
          onClick={() => router.push("/tab")} 
        />
        <h1 className="xxs:text-sm xs:text-lg font-bold">{dealershipName}</h1>
      </div>
      
      <Image 
        src={"https://res.cloudinary.com/dmo7nzytn/image/upload/v1757886696/Logo_Horizontal_164x48_-_A_AGENCIA_logo_rvbbq5.svg"} 
        alt=""
        width={70}
        height={1160}          
      />
    </div>
  );
}
