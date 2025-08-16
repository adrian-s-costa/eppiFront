// @ts-nocheck

"use client"

import { IoExit, IoTrashOutline, IoPencil, IoAnalytics } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { config } from "../../../config";
import { handleSub } from "../../../utils/api/service";
import { urlB64ToUint8Array } from "@/lib/utils";
import { PushNotifications } from '@capacitor/push-notifications';
import { useEffect, useState } from "react";

export default function Profile (){

  const [log, setLog] = useState<string | null>(null);

  useEffect(()=>{

  }, [log])

  function getMobileOperatingSystem() {
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent || window.navigator.vendor || window.opera : '';

    if (/android/i.test(userAgent)) {
      return 'Android';
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'iOS';
    }

    if (/Macintosh/.test(userAgent) && 'ontouchend' in document) {
      // iPadOS detectado como Mac
      return 'iOS';
    }

    return 'unknown';
  }
  
  const [os, setOs] = useState<string>('unknown');

  useEffect(() => {
    const detectedOS = getMobileOperatingSystem();
    setOs(detectedOS);
    console.log('Sistema operacional detectado:', detectedOS);
  }, []);

  async function requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('❌ Este navegador não suporta notificações');
      return;
    }
    
    Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log('✅ Permissão concedida');
      subscribeUser();
    } else {
      console.log('❌ Permissão negada');
    }
    });
  }

  const nativeNotifications = () => {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.log('❌ Permissão de push negada');
      }
    });

    PushNotifications.addListener('registration', token => {
      console.log('📱 Token de push:', token.value);
      setLog(token.value)
      
    });

    PushNotifications.addListener('registrationError', error => {
      console.error('❌ Erro no registro de push:', error);
    });


  }

  async function subscribeUser() {
    if (!('serviceWorker' in navigator)) {
      console.log('❌ Service Worker não suportado');
      return;
    }

    try {
      // Verificar se já existe um Service Worker registrado
      let registration = await navigator.serviceWorker.getRegistration();

      if (!registration) {
        console.log('🆕 Registrando novo Service Worker');
        registration = await navigator.serviceWorker.register('/sw.js');
      } else {
        console.log('✔️ Service Worker já registrado');
      }

      // Verificar se já existe uma subscription ativa
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log('🔔 Já existe uma subscription ativa:', existingSubscription);
        handleSub(JSON.stringify(existingSubscription));
        return;
      }

      // Criar uma nova subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(
          'BHpMl9CJn9ZlEDIImkKQv-QFlREKXnYlAqdCBxg_IElNRPth0FDGua819iSDLj9SZhXoOdHRJ9oBJIeliDeOYWo'
        ),
      });

      console.log('✅ Subscription criada:', subscription);
      handleSub(JSON.stringify(subscription));

    } catch (error) {
      console.error('❌ Erro ao criar subscription:', error);
    }
  }

  const deleteUser = async () => {
    try {
      const response = await fetch(`${config.API_URL}/auth/delete-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({ credential: userMail })
      });
  
      if (!response.ok) {
        throw new Error('Failed to log in');
      }
      localStorage.clear();
      router.push('/');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const userName = typeof window !== "undefined" ? window.localStorage.getItem("user") : false;
  const userMail = typeof window !== "undefined" ? window.localStorage.getItem("email") : false;
  const cep = typeof window !== "undefined" ? window.localStorage.getItem("cep") : false;
  const pfpUrl = typeof window !== "undefined" ? window.localStorage.getItem("pfpUrl") : false;
  const id = typeof window !== "undefined" ? window.localStorage.getItem("id") : false;


  const router = useRouter();

  return (
    <div className="w-full h-screen bg-white p-5 overflow-y-hidden lg:flex lg:justify-center lg:items-center lg:flex-col">
      <div className="lg:w-[60vw]">
      <div className="flex items-center">
        {pfpUrl == "" || pfpUrl == "." || !pfpUrl || pfpUrl === "null" || pfpUrl === null ? 
        <FaUserCircle className="text-gray-400 mr-4 text-6xl"/>
        : <div
            className={`rounded-full w-[5rem] h-[5rem] bg-cover mr-4`}
            style={{ backgroundImage: `url(${pfpUrl})` }}
          ></div>}
        <div className="flex flex-col">
          <p className="text-black dark:text-black font-bold">{userName}</p>
          <p className="text-black dark:text-black text-xs font">{userMail}</p>
          <p className="text-black dark:text-black text-xs font">{cep}</p>
        </div>
      </div>
      <div className=" border-[1px] w-full h-56 mt-5 rounded-lg px-2 flex flex-col justify-around">
        <div className="flex items-center h-10 w-full justify-between cursor-pointer" onClick={()=>{localStorage.clear(); router.push('/login')}}>
          <div className="flex items-center ">
            <IoExit className="text-2xl text-slate-400 mr-2"/>
            <span className="text-black dark:text-black">Sair</span>
          </div>
          <IoIosArrowForward className="text-2xl"/>
        </div>
        <hr className="mx-5"/>
        <div className="flex items-center h-10 w-full justify-between cursor-pointer" onClick={()=>{router.push('/user-info')}}>
          <div className="flex items-center ">
            <IoPencil className="text-2xl text-slate-400 mr-2"/>
            <span className="text-black dark:text-black">Editar informações</span>
          </div>
          <IoIosArrowForward className="text-2xl"/>
        </div>
        <hr className="mx-5"/>
        <div className="flex items-center h-10 w-full justify-between cursor-pointer" onClick={()=>{router.push(`/dashboard?id=${id}`)}}>
          <div className="flex items-center ">
            <IoAnalytics className="text-2xl text-slate-400 mr-2"/>
            <span className="text-black dark:text-black">Fera Ads</span>
          </div>
          <IoIosArrowForward className="text-2xl"/>
        </div>
        <hr className="mx-5"/>
        <div className="flex items-center h-10 w-full justify-between cursor-pointer" onClick={()=>{deleteUser()}}>
          <div className="flex items-center">
            <IoTrashOutline className="text-2xl text-red-600 mr-2"/>
            <span className="text-red-600">Excluir minha conta</span>
          </div>
          <IoIosArrowForward className="text-2xl"/>
        </div>
      </div>     
      {log}
      </div>
    </div>
  )
}