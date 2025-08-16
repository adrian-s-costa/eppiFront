'use client'

import React, { useEffect, useState } from 'react';
import PricingToggle from "../_components/tab/tab"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import PasswordInput from '../_components/passwordInput/passInput';
import { config } from '../../../config';
import Loader from '../loader/page';
import { GoogleLogin } from '@react-oauth/google';
import { register } from 'node:module';

export default function Login(){

  const [isAnnual, setIsAnnual] = useState(true);
  const [loginInfo, setLoginInfo] = useState<any>({credential: "", password: ""});
  const [registerInfo, setRegisterInfo] = useState<any>({credential: "", register: true});
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const localStorageLength = typeof window !== "undefined" ? window.localStorage.length : 0

  if(localStorageLength > 0){
    router.push('/tab');
  }

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


  const postUser = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    
    try {
      const response = await fetch(`${config.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify(loginInfo)
      });
  
      if (!response.ok) {
        setLoading(false);
        const teste = await response.json()
        notify(teste.error)
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

      setUserData(userData);
      setLoading(false);
      router.push(userData.account.name == "Sem Nome" ? '/user-info' : '/tab')
    } catch (error) {
      setLoading(false);
      console.error('Error logging in:', error);
    }
  };

  const postUserGoogle = async (response: any) => {
    if (!response.ok) {
      setLoading(false);
      const teste = await response.json()
      notify(teste.error)
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

    setUserData(userData);
    setLoading(false);
    router.push(userData.account.name == "Sem Nome" ? '/user-info' : '/tab')
  }
  
  const sendEmailCode = async (e: any) => {
    setLoading(true)
    e.preventDefault();

    try {
      const response = await fetch(`${config.API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify(registerInfo)
      });
  
      if (!response.ok) {
        setLoading(false);
        const teste = await response.json()
        notify(teste.error)
        throw new Error('Failed to log in');
      }
  
      const userData = await response.json();
      setUserData(userData);
      setLoading(false);
      router.push(`/code?email=${registerInfo.credential}`)

    } catch (error) {
      setLoading(false);
      console.error('Error logging in:', error);
    }
  };

  const forgotPassword = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({credential: loginInfo.credential, register: false})
      });
  
      if (!response.ok) {
        setLoading(false)
        const teste = await response.json()
        notify(await teste.error)
        throw new Error('Failed to log in');
      }
  
      const userData = await response.json();
      setUserData(userData);
      setLoading(false);
      router.push(`/code?email=${loginInfo.credential}`)

    } catch (error) {
      setLoading(false);
      console.error('Error logging in:', error);
    }
  };

  const sendEmailCodeGoogle = async (response: any) => {
    setLoading(true)

    if (!response.ok) {
      setLoading(false);
      const teste = await response.json()
      notify(teste.error)
      throw new Error('Failed to log in');
    }

    const userData = await response.json();

    console.log(userData)

    setUserData(userData);
    setLoading(false);
    router.push(`/code?email=${userData.email}`)
  };
  
  return (
    <>{ loading || typeof window == "undefined" ? <Loader/> : null }<div className="w-full lg:flex lg:flex-col lg:justify-center lg:items-center h-screen bg-white p-5 ">
      <div>
      <h1 className="text-3xl font-bold mb-4 text-black lg:hidden">{isAnnual ? "Entrar" : "Registrar"}</h1>
      <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} className="" />
      {isAnnual ? (
        <form onSubmit={(e) => { postUser(e); } }>
          <div className="grid gap-6 lg:w-96">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input type="mail" id="email" onChange={(event) => { setLoginInfo({ ...loginInfo, credential: event.target.value }); setRegisterInfo({ ...registerInfo, credential: event.target.value }); } } className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite seu email" required />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <PasswordInput setPasswordInfo={setLoginInfo} passwordInfo={loginInfo} specificVar={'password'} />
            </div>
          </div>
          <div className='w-full flex justify-end'>
            <span className="pt-2 text-sm cursor-pointer font-medium text-black dark:text-black" onClick={() => { forgotPassword(); } }>Esqueceu a senha?</span>
          </div>
          <button type="submit" className="text-white mt-5 mb-5 h-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Entrar</button>
          <GoogleLogin
            text='signup_with'
            onSuccess={ async (credentialResponse) => {
              const response = await fetch(`${config.API_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential, register: true }),
              });
              postUserGoogle(response)
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </form>
      ) : (
        <form onSubmit={(e) => { sendEmailCode(e); } }>
          <div className="grid gap-6 lg:w-96">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input type="mail" id="email" onChange={(event) => { setRegisterInfo({ ...registerInfo, credential: event.target.value }); setLoginInfo({ ...loginInfo, credential: event.target.value }); } } className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite seu email" required />
            </div>
          </div>
          <button type="submit" className="text-white mt-5 mb-5 h-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Registrar</button>
          <GoogleLogin
            text='signup_with'
            onSuccess={ async (credentialResponse) => {
              const response = await fetch(`${config.API_URL}/auth/forgot-google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential, register: true }),
              });
              sendEmailCodeGoogle(response)
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </form>
      )}

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
