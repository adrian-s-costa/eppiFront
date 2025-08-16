'use client'

import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdArrowBackIos } from "react-icons/md";
import { useRouter, useSearchParams } from 'next/navigation';
import PasswordInput from '../_components/passwordInput/passInput';
import { config } from '../../../config';
import Loader from '../loader/page';

export default function PinCode(){

  const [registerInfo, setRegisterInfo] = useState<any>({credential: "", code: "", password: "123456789", confirmPassword: "123456789"})
  const router = useRouter();
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [passwordInfo, setPasswordInfo] = useState<any>({first: "", second: ""})
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setRegisterInfo({...registerInfo, credential: email})
  }, []);

  const notify = (message: string) => toast.error(message, {
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

  const verifyPassword = async (e: any) => {
    setLoading(true);

    e.preventDefault();

    if (passwordInfo.first !== passwordInfo.second){
      setLoading(false);
      return notify('As senhas não coincidem')
    }

    try {
      const response = await fetch(`${config.API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({ credential: email, password: passwordInfo.first, confirmPassword: passwordInfo.second })
      });
      
      if (!response.ok) {
        setLoading(false);
        const resp = await response.json()
        if (await resp.error.length !== 0 ) {
          throw new Error("Sua senha deve ter no mínimo 8 caracteres");
        }
        throw new Error('Failed to log in');
      }

      notify2();

      try {
        const response = await fetch(`${config.API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "ngrok-skip-browser-warning": "69420"
          },
          body: JSON.stringify({credential: email, password: passwordInfo.first})
        });
    
        if (!response.ok) {
          setLoading(false);
          notify("Erro no login");
          throw new Error('Failed to log in');
        }
    
        const userData = await response.json();
  
        localStorage.setItem('user', userData.account.name)
        localStorage.setItem('token', userData.token)
        localStorage.setItem('id', userData.account.id)
        localStorage.setItem('email', userData.account.email)
        localStorage.setItem('number', userData.account.cellphone)
        localStorage.setItem('cep', userData.account.cep)
        localStorage.setItem('pfpUrl', userData.account.pfpUrl)
  
        setLoading(false);
        router.push(userData.account.name == "Sem Nome" ? '/user-info' : '/tab')
      } catch (error) {
        setLoading(false);
        console.error('Error logging in:', error);
      }
    } catch (error: any) {
      setLoading(false);
      notify(error.message)
    }
  };
  
  return (
    <>{loading ? <Loader /> : null}<div className="w-full h-screen bg-white p-5 lg:flex lg:justify-center lg:items-center">
      <div className='lg:w-96 lg:border-solid lg:border-[1px] lg:rounded-xl p-10 lg:border-gray-500 relative'>  
      <MdArrowBackIos className='text-2xl cursor-pointer absolute left-5 top-5' onClick={() => { router.back(); } } />

      <h1 className="text-3xl font-bold mb-2 mt-[2.5rem] text-black dark:text-black">Criar uma senha</h1>

      <span className='text-sm text-[#838383]'>Para proteger melhor a segurança da sua conta, crie uma senha para {email}</span>
      <form onSubmit={(e) => { verifyPassword(e); } } className='mt-5'>
        <div className="grid gap-6">
          <div>
            <PasswordInput setPasswordInfo={setPasswordInfo} passwordInfo={passwordInfo} specificVar={'first'} />
          </div>
          <div>
            <PasswordInput setPasswordInfo={setPasswordInfo} passwordInfo={passwordInfo} specificVar={'second'} />
          </div>
        </div>

        <div className="mt-4 flex flex-col">
          <span className="text-xs text-[#838383]">
            - A senha deve conter no mínimo 8 caracteres
          </span>
          <span className="text-xs text-[#838383]">
            - As senhas devem ser iguais
          </span>
        </div>

        <button type="submit" className="text-white mt-5 h-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Entrar</button>
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
    </div>
    </>
  );
}  



  