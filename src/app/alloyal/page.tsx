"use client";

import { useEffect, useState } from "react";
import { config } from "../../../config";
import Loader from "../loader/page";
import ErrorScreen from "../../components/ErrorScreen";

export default function Alloyal({ token, setTabIndex }: any) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [smartLink, setSmartLink] = useState<{smart_token: string}>();

  const cpf = typeof window !== "undefined" ? window.localStorage.getItem("cpf") : false;

  async function getUser(initials: any) {
    try {
      const res = await fetch(`${config.API_URL}/auth/club/smartlink/${initials}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
      });
      
      if (!res.ok) {
        throw new Error('Erro na requisição');
      }
      
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
  }

  const handleRetry = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getUser(cpf);
      setSmartLink(res);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if (!cpf) return;
    
    setLoading(true);
    setError(false);
    getUser(cpf).then((res) => {
      setSmartLink(res);
    }).catch(()=>{
      setError(true);
    }).finally(() => {
      setLoading(false);
    });
  }, [cpf])


  return (
    <>
      {loading ? <Loader/> : 
        error ? 
          <ErrorScreen 
            onRetry={handleRetry}
            setTabIndex={setTabIndex}
            title="Erro ao carregar dados"
            message="Não foi possível conectar com o serviço. Verifique sua conexão e tente novamente."
          />
        :
          <div className="w-full min-h-screen h-auto">  
            <iframe src={`https://d2h8ge3gfrwdyi.cloudfront.net/login?token=${ smartLink?.smart_token }`} className="w-full min-h-screen h-auto" />
          </div>
      }
    </>
  );
}