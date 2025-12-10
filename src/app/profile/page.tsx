// @ts-nocheck

"use client"

import { IoExit, IoTrashOutline, IoPencil, IoAnalytics, IoNotificationsOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { config } from "../../../config";
import { handleSub } from "../../../utils/api/service";
import { urlB64ToUint8Array } from "@/lib/utils";
import { PushNotifications } from '@capacitor/push-notifications';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export default function Profile (){

  const [log, setLog] = useState<string | null>(null);
  const [coor, setCoord] = useState<{lat: string, long: string} | null>(null);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const cpf = typeof window !== "undefined" ? window.localStorage.getItem("cpf") : false;
  let latitude, longitude

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
        body: JSON.stringify({ credential: userMail, initials: cpf})
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

  useEffect(()=>{

  }, [coor])


  const router = useRouter();

  return (
    <div className="w-full h-screen bg-white p-5 overflow-y-hidden lg:flex lg:justify-center lg:items-center lg:flex-col">
      <div className="w-full max-w-md mx-auto">
        {/* Card topo com avatar e infos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center"
        >
          {pfpUrl == "" || pfpUrl == "." || !pfpUrl || pfpUrl === "null" || pfpUrl === null ? 
            <FaUserCircle className="text-gray-300 text-6xl"/>
            : <div
                className={`rounded-full w-[5rem] h-[5rem] bg-center bg-cover`}
                style={{ backgroundImage: `url(${pfpUrl})` }}
              ></div>
          }
          <p className="text-black dark:text-black font-bold mt-3">{userName}</p>
          <p className="text-slate-500 text-sm">{userMail}</p>
        </motion.div>

        {/* Lista de ações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.35, ease: "easeOut" }}
          className="mt-4 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          {/* Sair */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-4 flex items-center justify-between"
            onClick={()=>{localStorage.clear(); router.push('/login')}}
          >
            <div className="flex items-center">
              <IoExit className="text-xl text-slate-500 mr-3"/>
              <span className="text-black">Sair</span>
            </div>
            <IoIosArrowForward className="text-xl text-slate-400"/>
          </motion.button>
          <hr className="mx-4"/>

          {/* Ativar Loc */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-4 flex items-center justify-between"
          >
            <div className="flex items-center" onClick={()=>{
              if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    setCoord({
                      lat: position.coords.latitude,
                      long: position.coords.longitude
                    })
                    // Use latitude e longitude

                    console.log(coor?.lat, coor?.long)
                    toast()
                  },
                  (error) => {
                    // Lidar com erros (permissão negada, timeout, etc.)
                    console.error("Erro ao obter a localização:", error);
                  },
                  {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                  }
                );
              } else {
                // Geolocation não é suportado
              }
            }}>
              <IoExit className="text-xl text-slate-500 mr-3"/>
              <span className="text-black">Localização</span>
            </div>
            <IoIosArrowForward className="text-xl text-slate-400"/>
            <iframe
              width="600"
              height="450"
              loading="lazy"
              allowfullscreen
              referrerpolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/view?center=${coor?.lat},${coor?.long}&zoom=15&key=AIzaSyB0dQQVgCQwjRzOZb4nCpBtPA1brvFLPHI`}
            ></iframe>
          </motion.button>

          <hr className="mx-4"/>

          {/* Editar informações */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-4 flex items-center justify-between"
            onClick={()=>{router.push('/user-info')}}
          >
            <div className="flex items-center">
              <IoPencil className="text-xl text-slate-500 mr-3"/>
              <span className="text-black">Editar informações</span>
            </div>
            <IoIosArrowForward className="text-xl text-slate-400"/>
          </motion.button>
          <hr className="mx-4"/>

          {/* Éppi Ads */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-4 flex items-center justify-between"
            onClick={()=>{router.push(`/dashboard?id=${id}`)}}
          >
            <div className="flex items-center">
              <IoAnalytics className="text-xl text-slate-500 mr-3"/>
              <span className="text-black">Éppi Ads</span>
            </div>
            <IoIosArrowForward className="text-xl text-slate-400"/>
          </motion.button>
          <hr className="mx-4"/>

          {/* Notificações */}
          {/* <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-4 flex items-center justify-between"
            onClick={()=>{ os === 'Android' || os === 'iOS' ? nativeNotifications() : requestNotificationPermission() }}
          >
            <div className="flex items-center">
              <IoNotificationsOutline className="text-xl text-slate-500 mr-3"/>
              <span className="text-black">Notificações</span>
            </div>
            <IoIosArrowForward className="text-xl text-slate-400"/>
          </motion.button> */}
        </motion.div>

        {/* Excluir conta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35, ease: "easeOut" }}
          className="mt-4 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 pt-4 flex items-center justify-between"
            onClick={()=>{setConfirmOpen(true)}}
          >
            <div className="flex items-center">
              <IoTrashOutline className="text-xl text-red-600 mr-3"/>
              <span className="text-red-600">Excluir conta</span>
            </div>
            <IoIosArrowForward className="text-xl text-slate-400"/>
          </motion.button>
          <div className="px-12 pb-4 text-xs text-slate-500">Esta ação é irreversível</div>
        </motion.div>

        {/* debug opcional */}
        {/* {log} */}
      </div>
      {/* Modal de confirmação de exclusão */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={()=> setConfirmOpen(false)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 12, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl"
              onClick={(e)=> e.stopPropagation()}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9V13" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 17.01L12.01 16.9989" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#DC2626" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">Excluir conta?</h3>
                  <p className="text-slate-600 mt-1">Essa ação é permanente e não poderá ser desfeita.</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  className="w-full py-3 rounded-xl border border-slate-200 text-slate-700"
                  onClick={()=> setConfirmOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold"
                  onClick={()=> { setConfirmOpen(false); deleteUser(); }}
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}