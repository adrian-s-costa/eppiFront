'use client'

import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HStack, PinInput, PinInputField } from '@chakra-ui/react'
import { MdArrowBackIos } from "react-icons/md";
import { useRouter, useSearchParams } from 'next/navigation';
import { config } from '../../../config';
import Loader from '../loader/page';
import Image from 'next/image';

export default function PinCode(){

  const [registerInfo, setRegisterInfo] = useState<any>({credential: "", code: "", password: "123456789", confirmPassword: "123456789"})
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const email = searchParams.get('email');

  useEffect(() => {
    setRegisterInfo({...registerInfo, credential: email})
  }, []);

  const notify = () => toast.error('Código inválido, tente novamente', {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const notify2 = () => toast('Sucesso', {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const verifyPinCode = async (e: string) => {
    setLoading(true) 
    try {
      const response = await fetch(`${config.API_URL}/auth/check-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({ code: e, credential: email })
      });
  
      if (!response.ok) {
        setLoading(false)
        notify()
        throw new Error('Failed to log in');
      }
      
      notify2();

      setTimeout(()=>{
        setLoading(false)
        router.push(`/password?email=${email}`)
      }, 3000)

    } catch (error) {
      setLoading(false)
      console.error('Error logging in:', error);
    }
  };
  
  return (
    <>{loading ? <Loader /> : null }<div className="w-full h-screen bg-white p-5 lg:flex lg:justify-center lg:items-center">
      <MdArrowBackIos className='z-10 text-2xl cursor-pointer text-black absolute lg:absolute md:absolute xs:hidden xxs:hidden left-5 top-5' onClick={() => { router.back(); } } />
      <div className='w-full justify-between items-center lg:hidden md:hidden xs:flex xxs:flex'>
        <MdArrowBackIos className='text-2xl cursor-pointer text-black left-5 top-5' onClick={() => { router.back(); } } />
        <Image 
          src={"https://res.cloudinary.com/dmo7nzytn/image/upload/v1757886696/Logo_Horizontal_164x48_-_A_AGENCIA_logo_rvbbq5.svg"}
          className="xxs:w-[3rem] xs:w-[5rem]"
          alt={""}
          width={200}
          height={214}          
        />
      </div>
      <div className='lg:w-96'>
        <h1 className="xs:text-3xl xxs:text-lg font-bold mb-2 mt-[2.5rem] text-[#8609A3] ">Código Validação</h1>
        <span className='xs:text-sm xxs:text-xs text-[#838383]'>Enviamos um código de ativação para o seu email {email}</span>

        <form>
          <HStack className='w-full flex justify-between mt-5'>
            <PinInput autoFocus onComplete={(e) => { verifyPinCode(e); } }>
              <PinInputField className='xs:h-[4.5rem] xs:w-[4rem] xxs:w-[2.5rem] xxs:h-[2.5rem] border-solid border-[#D8DADC] border-[1px] text-center text-black dark:text-black items-center rounded-md xs:text-4xl xxs:text-xl' />
              <PinInputField className='xs:h-[4.5rem] xs:w-[4rem] xxs:w-[2.5rem] xxs:h-[2.5rem] border-solid border-[#D8DADC] border-[1px] text-center text-black dark:text-black items-center rounded-md xs:text-4xl xxs:text-xl' />
              <PinInputField className='xs:h-[4.5rem] xs:w-[4rem] xxs:w-[2.5rem] xxs:h-[2.5rem] border-solid border-[#D8DADC] border-[1px] text-center text-black dark:text-black items-center rounded-md xs:text-4xl xxs:text-xl' />
              <PinInputField className='xs:h-[4.5rem] xs:w-[4rem] xxs:w-[2.5rem] xxs:h-[2.5rem] border-solid border-[#D8DADC] border-[1px] text-center text-black dark:text-black items-center rounded-md xs:text-4xl xxs:text-xl' />
              <PinInputField className='xs:h-[4.5rem] xs:w-[4rem] xxs:w-[2.5rem] xxs:h-[2.5rem] border-solid border-[#D8DADC] border-[1px] text-center text-black dark:text-black items-center rounded-md xs:text-4xl xxs:text-xl' />
            </PinInput>
          </HStack>
        </form>

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
    </div></>
  );
}  
