"use client"

import { Rating } from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { useEffect, useRef, useState } from "react";
import Loader from "../loader/page";
import { getUser } from "../../../utils/api/service";
import { ToastContainer, toast } from 'react-toastify';
import { config } from "../../../config";

export default function CoursesLandpage() {
  const [response, setResponse] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>();
  const link = useRef<any>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(0);

  

  const notify = (text: string) => toast.error(text , {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const userMail = typeof window !== "undefined" ? window.localStorage.getItem("email") : false;
  const userName = typeof window !== "undefined" ? window.localStorage.getItem("user") : false;

  useEffect(()=>{
    !userMail ? null :
    getUser(userMail)
    .then((res)=>{
      setUser(res)
    })
    .catch((err)=>{
      console.error(err)
    })
  }, [userMail])

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    setViewportWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 
  
  useEffect(()=>{
    fetch(config.API_URL + "/process_payment/preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userMail, userName }),
    })
    .then((response) => response.json())
    .then((response) => {
      setResponse(response);
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(()=>{
      setLoading(false);
    })
  }, [])

  const router = useRouter();

  function redirectLogic(usermail: any) {

    getUser(userMail)
    .then((res)=>{
      setUser(res)
      if (!res.lastPaymentStaus) {
        link.current.click();
      }
  
      if (res.lastPaymentStatus == "reproved" || res.lastPaymentStaus == "pending") {
        router.push(`status/${res.lastPaymentId}`)
      }
  
      if (res.lastPaymentStaus == "approved"){
        router.push("/courses")
      }
    })
    .catch((err)=>{
      console.error(err)
    })
  }

  return (<>
    { loading || typeof window == "undefined" || !user || !response ? <Loader/> : null }
    <div className="w-full min-h-screen bg-white text-black dark:text-black xxs:mb-0 relative">
        <Image 
          quality={100}
          src={ 
            viewportWidth > 1024 
            ? "https://storage.googleapis.com/videos-grupo-fera/images/Novo%20Projeto%20(1).png"
            : "https://res.cloudinary.com/dmo7nzytn/image/upload/v1730779961/Pa%CC%81gina_curso_Fera_1_g9bxub.png"
          }
          className="w-full h-screen z-0 absolute pb-[50px] lg:pb-0 bg-cover bg-center"
          alt={""}
          width={1920}
          height={1080}
          priority
          >
        </Image>
        <div className="w-full flex justify-center z-10 absolute bottom-10 lg:bottom-[33%]">
          <div className=" lg:bg-black/40 lg:backdrop-blur-sm lg:p-8 lg:rounded-xl ls:max-w-md lg:text-white lg:shadow-lg">

            <div className="w-full flex flex-col items-center">
              <p className="w-[270px] text-[24px] font-bold text-white text-center">Dominando o Mercado de Carros Híbridos</p>
              <p className="w-[240px] text-[16px] font-medium text-gray-400 text-center mt-3">Conhecendo a Tecnologia Híbrida para uma Venda Eficaz</p>
              <button className= {`font-bold text-white bg-[#04377B] px-[32px] py-[12px] w-[234px] rounded-[30px] mt-[47px] ${user && user.lastPaymentStaus == "approved" ? "mb-[75px]" : ""}`} onClick={()=>{redirectLogic(userMail)}}>Já tenho acesso!</button>
              <a href={response && response.init_point} ref={link} className={`w-[240px] text-[16px] font-medium text-white text-center mt-3 mb-[47px] ${user && user.lastPaymentStaus == "approved" ? "hidden" : ""}`}>Quer adquirir? <b className="text-[#EB4335]">Clique aqui!</b></a>
            </div>
          </div>
        </div>
        <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" />
    </div>
    </>
  );
}