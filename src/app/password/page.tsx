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
  const [registerInfo, setRegisterInfo] = useState<any>({credential: "", code: "", password: "123456789", confirmPassword: "123456789", cpf: ''})
  const router = useRouter();
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [passwordInfo, setPasswordInfo] = useState<any>({first: "", second: ""})
  const [loading, setLoading] = useState<boolean>(false);

  // Função que valida se um CPF é válido
  function validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, ""); // remove tudo que não é número

    if (cpf.length !== 11) return false;

    // Elimina CPFs inválidos conhecidos (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    // Valida 1º dígito
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;

    // Valida 2º dígito
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }


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

    if (!validarCPF(registerInfo.cpf)) {
      setLoading(false);
      return notify('CPF inválido!')
    }

    try {
      const response = await fetch(`${config.API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({ credential: email, password: passwordInfo.first, confirmPassword: passwordInfo.second, initials: registerInfo.cpf})
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
        
        // const responseAlloyalCreate = await fetch("https://api.lecupon.com/client/v2/sign_in", {
        //   method: "POST",
        //   headers: {
        //     "X-ClientEmployee-Email": "api@aagencia.com.br",
        //     "X-ClientEmployee-Token": "jX_wddT9R14fa1_6zV_m",
        //     "Content-Type": "application/json",
        //     "Accept": "application/json",
        //     "ngrok-skip-browser-warning": "69420"
        //   },
        //   body: JSON.stringify({
        //     cpf: registerInfo.cpf,
        //     email: userData.account.email,
        //     active: true,
        //   }),
        // });
        
        // if (!responseAlloyalCreate.ok) {
        //   return notify('Erro ao criar conta no Alloyal')
        // }

        // console.log(await responseAlloyalCreate.json())
  
        localStorage.setItem('user', userData.account.name)
        localStorage.setItem('token', userData.token)
        localStorage.setItem('id', userData.account.id)
        localStorage.setItem('email', userData.account.email)
        localStorage.setItem('number', userData.account.cellphone)
        localStorage.setItem('cep', userData.account.cep)
        localStorage.setItem('pfpUrl', userData.account.pfpUrl)
        localStorage.setItem('cpf', registerInfo.cpf)
  
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

      <h1 className="text-3xl font-bold mb-2 mt-[2.5rem] text-[#8609A3]">Criar uma senha</h1>

      <span className='text-sm text-[#838383]'>Para proteger melhor a segurança da sua conta, crie uma senha para {email}</span>
      <form onSubmit={(e) => { verifyPassword(e); } } className='mt-5'>
        <div className="grid gap-6">
          <div>
            <PasswordInput setPasswordInfo={setPasswordInfo} passwordInfo={passwordInfo} specificVar={'first'} />
          </div>
          <div>
            <PasswordInput setPasswordInfo={setPasswordInfo} passwordInfo={passwordInfo} specificVar={'second'} />
          </div>
          <div>
            <label htmlFor="cpf" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CPF</label>
            <input id="cpf" onChange={(event) => { setRegisterInfo({ ...registerInfo, cpf: event.target.value });}} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite seu CPF" required />
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

        <button type="submit" className="text-white mt-5 h-10 bg-[#8609A3] focus:outline-none font-medium rounded-sm text-sm w-full sm:w-auto px-5 py-2.5 text-center ">Entrar</button>
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



  