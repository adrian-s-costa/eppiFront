"use client"

import { MdArrowBackIos } from "react-icons/md";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useState, Suspense, useEffect } from "react";
import { Carousel } from "flowbite-react";
import { getOneCategoryContent, handleClick, handleView } from "../../../utils/api/service";
import ReadMore from "../_components/readMore/readMore";

export default function CategoryPage(){
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const [contact, setContact] = useState<Boolean>(false)
  const [content, setContent] = useState<any>()
  
  const router = useRouter();

  useEffect(() => {
    try {
      getOneCategoryContent(id!).then((res)=>{
        setContent(res);
      })

      handleView(id);
    
    } catch (error) {
      console.error(error)
    }
  }, [])

  const notify = () => toast.success('Recebemos o seu contato e em breve um vendedor entrará em contato!', {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const handleContact = async (id: string) => {

    handleClick(id);

    if (contact) return null;
    setContact(true);
    try {
      const response = await fetch(`https://acesso.meets.com.br/oportunidade/salvar`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': '8C9DB575-0A8B-7CC5-4389-41D2CC6E9937'
        },
        body: JSON.stringify({
          id_usuario: 37456,
          id_origem: 313,
          razao_cliente: localStorage.getItem('user'),
          fantasia: localStorage.getItem('user'),
          email_cliente: localStorage.getItem('email'), 
          celular_cliente: localStorage.getItem('number'), 
          descricao: `${localStorage.getItem("user")} se interessou e clicou em ${content.title} `,
          valor: ''
        })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }
      const responseData = await response.json();
      notify();
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  }

  return (
    <>
      <div className="w-full min-h-screen h-full bg-white p-5 pb-20 lg:flex lg:justify-center">
        <div className="lg:w-[60vw]">
        <div className="w-full flex justify-center relative">
          <MdArrowBackIos className='text-2xl left-0 top-[17px] cursor-pointer absolute text-black' onClick={() => {router.back()} } />
          
          <Image 
            src={"https://storage.googleapis.com/videos-grupo-fera/static/logos/logo.webp"} 
            alt={""}
            width={70}
            height={1160}          
          />  
          
        </div>
        
        <div className="xxs:h-[15rem] my-5">
          <Carousel draggable={true}>
            {
              content && content.secondaryImgs.map((img: any, index: any)=>{
                return <img src={img.imgSrc} alt="..." key={index} />
              })
            }
          </Carousel>
        </div>

        {!content ? null : <ReadMore text={content && content.texto!} maxLength={100} />}

        {!content ? null : 
        
        <div className="fixed left-0 bottom-0 w-full flex justify-end p-5 h-20 bg-white">
          <button className="rounded-full xxs:text-[0.6rem] bg-blue-600 font-bold text-white xs:text-sm xs:py-[0.3rem] xs:px-[0.5rem] xxs:px-[0.5rem]" onClick={()=>{handleContact(id)}}>{content.btnText == "" ? "Teste" : content.btnText }</button>
        </div>

        }


        <ToastContainer
          position="top-center"
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
      </div>
      </>
  )   
}