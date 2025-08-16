'use client'

import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdArrowBackIos } from "react-icons/md";
import { useRouter, useSearchParams } from 'next/navigation';
import { config } from '../../../config';
import Loader from '../loader/page';
import {useForm} from 'react-hook-form'
import { normalizeCepNumber, normalizePhoneNumber } from '../../../utils/api/masks/masks';
import InputMask from 'react-input-mask';
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';
import { FileInput, Label } from "flowbite-react";
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
//import fs from 'fs';
import crypto from 'crypto'

export default function UserInfo(){

  const [additionalInfo, setAdditionalInfo] = useState<any>({id: "", name: "", secName: "", tel: "", bornDate: "", cep: ""})
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter();
  const [file, setFile] = useState<any>(null);
  const [error, setError] = useState('');
  const [url, setUrl] = useState<any>(null);
  const [pfp, setPfp] = useState<any>('.');

  useEffect(() => {
    setAdditionalInfo({...additionalInfo, 
      id: localStorage.getItem('id'), 
      name: localStorage.getItem("user")?.split(' ')[0],
      secName: localStorage.getItem("user")?.split(' ')[1],
      tel: localStorage.getItem("number"),
      bornDate: localStorage.getItem("bornDate"),
      cep: localStorage.getItem("cep"),
    })

    setUrl(localStorage.getItem('pfpUrl'))

  }, []);

  const handleFileChange = async (event: any) => {
    const selectedFile = event.target.files[0];
    setFile(event.target.files[0])

    if (selectedFile) {
      const fileType = selectedFile.type;
      const allowedTypes = ['image/png', 'image/jpeg' ];

      if (allowedTypes.includes(fileType)) {

        // const response = await fetch(`${config.API_URL}/upload-file`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //     "ngrok-skip-browser-warning": "69420"
        //   },
        //   body: formData
        // });

        const fileURL = URL.createObjectURL(selectedFile);
        setUrl(fileURL);
        setError('');
      } else {
        setError('Por favor, envie um arquivo PNG ou JPEG.');
        setFile(null);
      }
    }
  };

  const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'O nome precisa ter mais de 2 caracteres')
      .max(50, 'Too Long!')
      .required('Required'),
    cep: Yup.string()
      .min(8, 'Digite um cep válido')
      .required('Required'),
    tel: Yup.number().required('Required').max(2),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      cep: '',
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      console.log(formik.errors)
    },
  });

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

  async function uploadFileToSignedUrl(signedUrl: string, file: File) {
    try {
      // Ler o arquivo local
      //const fileData = fs.readFileSync(localFilePath);
  
      // Fazer upload via URL

      console.log(signedUrl);

      const response = await axios.put(signedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
  
      return {message: 'Upload realizado com sucesso:', data: response};

    } catch (error: any) {
      console.log(error)
      console.error('Erro durante o upload:', error.message);
      notify(error.message);
      //setLoading(false);
    }
  }

  function getInitials(name: string): string {
    const words = name.trim().split(/\s+/); // separa as palavras por espaço

    const firstLetter = words[0]?.charAt(0).toUpperCase() || "";

    const secondLetter = words[1]?.charAt(0).toUpperCase() || "";

    return firstLetter + secondLetter;
  }

  const verifyUserData = async (e: any) => {

    setLoading(true);
    e.preventDefault();

    let awsResponse: any;
    let imageUrl = "";

    
    const mimeToExtension: { [key: string]: string } = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/heic': '.heic',
      'image/heif': '.heif',
    };

    if (file) {
      const mimeType = file.type;
      const fileExtension = mimeToExtension[mimeType];
      const uniqueFileName = `profile-pictures/${crypto.randomBytes(16).toString('hex')}${fileExtension}`;
      const res = await axios.get(`${config.API_URL}/upload-file/teste/${encodeURIComponent(uniqueFileName)}/${encodeURIComponent(file.type)}`, { headers: {"ngrok-skip-browser-warning": "69420"} })
      if (file && file !== null && url && url !== null) {
        awsResponse = await uploadFileToSignedUrl(res.data, file)
        
        //awsResponse = await axios.post(`${config.API_URL}/upload-file`, formData, { headers: {'Content-Type': 'multipart/form-data'}})
      }
  
      if (awsResponse && awsResponse.data){
        imageUrl = `https://storage.googleapis.com/videos-grupo-fera/profile-pictures/${uniqueFileName}`
      } else{
        setPfp(".")
      }
    }
  
    const cepResult = await fetch(`https://viacep.com.br/ws/${additionalInfo.cep}/json/`, {
      method: "GET"
    })

    const cepResultJson = await cepResult.json() 

    if (cepResultJson.erro) {
      setLoading(false)
      return notify("CEP inválido")
    }
    
    try {
      const fullName = `${additionalInfo.name} ${additionalInfo.secName}`

      const response = await fetch(`${config.API_URL}/auth/update-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({
          id: additionalInfo.id,
          name: additionalInfo.name,
          secName: additionalInfo.secName,
          tel: additionalInfo.tel,
          bornDate: additionalInfo.bornDate,
          cep: additionalInfo.cep,
          localidade: cepResultJson.localidade, 
          uf: cepResultJson.uf,
          pfpUrl: imageUrl !== "" ? imageUrl 
          : url !== "." ? url : pfp,
        })
      });
  
      if (!response.ok) {
        setLoading(false)
        const resp = await response.json()
        notify(await resp.error)
        throw new Error('Failed to log in');
      }

      const newUser = await response.json()

      localStorage.setItem('user', newUser.name);
      localStorage.setItem('id', newUser.id);
      localStorage.setItem('email', newUser.email);
      localStorage.setItem('bornDate', newUser.bornDate);
      localStorage.setItem('number', newUser.cellphone);
      localStorage.setItem('cep', normalizeCepNumber(newUser.cep));
      localStorage.setItem('localidade', newUser.localidade);
      localStorage.setItem('uf', newUser.uf);
      localStorage.setItem('pfpUrl', newUser.pfpUrl);

      notify2();

      setLoading(false)

      router.push('/tab')
  
    } catch (error) {
      setLoading(false)
      console.error('Error logging in:', error);
    }
  };
  
  return (
    <>{ loading ? <Loader /> : null }<div className="w-full h-full min-h-screen bg-white p-5 lg:flex lg:justify-center lg:items-center">

      <div className='lg:w-[50vw] w-full lg:border-solid lg:border-[1px] lg:rounded-xl lg:p-10 lg:border-black'>

      <MdArrowBackIos className='text-2xl cursor-pointer' onClick={() => { router.back(); } } />

      <h1 className="text-3xl font-bold mb-2 mt-[2.5rem] text-black dark:text-gray-900">Estamos quase lá!</h1>

      <span className='text-sm text-[#838383]'>Para podermos nos comunicar melhor informe nome e sobrenome</span>

      <form onSubmit={(e) => { verifyUserData(e) }} className='mt-5'>

        {
        (url !== 'null') ?
        <div className='w-full flex flex-col items-center'>
          <div
            className={`rounded-full w-[5rem] h-[5rem] bg-cover mr-4`}
            style={{ backgroundImage: `url(${url})` }}
          ></div>
          <button type='button' onClick={()=>{setUrl('null'); setFile(null)}} className="text-white mt-5 h-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Excluir</button>
        </div>
        :
          <div>
            <label htmlFor="dropzone-file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900">Foto de perfil</label>
            <Label
              htmlFor="dropzone-file"
              className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-300 dark:bg-gray-50 dark:hover:border-gray-300 dark:hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <FaUserCircle className="text-gray-400 mr-4 text-5xl"/>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Clique pra enviar</span> ou arraste e solte
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (MAX. 2MB)</p>
              </div>
              <FileInput id="dropzone-file" className="hidden" onChange={(e)=>{handleFileChange(e)}} accept=".png, .jpg, .jpeg"/>
            </Label>
          </div>
        }
        
        <div className="grid gap-6 md:grid-cols-2 pt-5">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900">Nome</label>
            <input type="text" id="name" onChange={(event) => { setAdditionalInfo({ ...additionalInfo, name: event.target.value }); } } value={additionalInfo.name == "Sem" ? '' : additionalInfo.name} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite seu nome" required />
          </div>
          <div>
            <label htmlFor="secName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900">Sobrenome</label>
            <input type="text" id="secName" onChange={(event) => { setAdditionalInfo({ ...additionalInfo, secName: event.target.value }); } } value={additionalInfo.secName == "Nome" ? '' : additionalInfo.secName} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite seu sobrenome" required />
          </div>
          <div>
            <label 
              htmlFor="tel" 
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900"
            >
              Telefone
            </label>
            <input type="text" minLength={11} maxLength={11} id="tel" onChange={(event) => { setAdditionalInfo({ ...additionalInfo, tel: event.target.value }); } } value={additionalInfo.tel === "null" ? '' : additionalInfo.tel } className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="(99) 9 9999-9999" required />
          </div>
          <div>
            <label htmlFor="cep" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900">CEP</label>
            <input type="text" minLength={8} maxLength={8} id="cep" onChange={(event) => { setAdditionalInfo({ ...additionalInfo, cep: event.target.value }); } } value={additionalInfo.cep === "null" ? '' : additionalInfo.cep} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="79300030" required />
          </div>
          <div>
            <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900 placeholder:text-black">Data de nascimento</label>
            <input type="date" id="date" onChange={(event) => { setAdditionalInfo({ ...additionalInfo, bornDate: event.target.value }); } } value={additionalInfo.bornDate} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="DD/MM/AAAA" required />
          </div>
        </div>
        <button type="submit" className="text-white mt-5 h-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Confirma</button>
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
        theme="light" 
      />

    </div>
    </div></>
  );
}  