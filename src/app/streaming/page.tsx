"use client"

import Image from "next/image"
import logo from './Logo.png'
import { GoBell, GoSearch } from "react-icons/go";
import { IoCompassOutline } from "react-icons/io5";
import { getVideos, getVideoById, getCategories } from "../../../utils/api/service";
import Thumbs from "./components/thumbs";
import { useEffect, useState } from "react";
import { Button, Checkbox, Label, Modal, TextInput, Toast } from "flowbite-react";
import { ToastContainer, toast } from 'react-toastify';
import { HiX } from "react-icons/hi";
import { Badge } from "flowbite-react";

export default function Streaming({setTabIndex}: any){

  const [videos, setVideos] = useState<any>()
  const [categories, setCategories] = useState<any>()
  const [activeTag, setActiveTag] = useState<string>('Todos')
  const [searchBar, setSearchBar] = useState<string>('')
  const [searchBarState, setSearchBarState] = useState<number>(1)
  const [password, setPassword] = useState<string>('');
  const [hidden, setHidden] = useState<string>('hidden');
  const [hasAcess, setHasAcess] = useState<boolean>(false);


  const hasAcessToCourses = typeof window !== "undefined" ? window.localStorage.getItem("hasAcess") : false;  

  const changeState = (n: number) => {
    return setSearchBarState( searchBarState * -1);
  }

  useEffect(()=>{
    try {
      getCategories().then((res)=>{
        setCategories(res)
      })
    } catch (error){
      console.log(error)
    }

    try {
      getVideos().then((res)=>{
        setVideos(res)
      })
    } catch (error){
      console.log(error)
    }
  }, [hasAcess])

  function onCloseModal() {
    setActiveTag("Todos");
  }

  function submitPassword(password: string) {
    if (password == "teste"){
      setHidden('hidden');
      setHasAcess(true);
      return localStorage.setItem('hasAcess', "true");  
    }
    setHidden('flex mb-5');
  }


  return (
    <>
    <div className=" min-h-screen h-auto bg-white dark:bg-black overflow-y-hidden lg:overflow-auto pb-[4.5rem]">
      <Modal show={activeTag == "Cursos" && !hasAcessToCourses} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
          <Modal.Body>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Acessar aba de cursos</h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password" value="Sua senha" />
                </div>
                <TextInput 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)} 
                  required 
                />
              </div>
              <div className="w-full">
                <Button onClick={() => submitPassword(password)}>Entrar</Button>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
                Receber acesso&nbsp;
                <a href="#" className="text-cyan-700 hover:underline dark:text-cyan-500">
                  Mais informações
                </a>
              </div>
            </div>
          </Modal.Body>
          <div className="w-full flex justify-center">
            <Toast className={`${hidden}`}>
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                <HiX className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">Senha incorreta</div>
              <Toast.Toggle onDismiss={()=>{setHidden('hidden');
              }}/>
            </Toast>
          </div>
      </Modal>

    <div className=" flex px-1 h-16 justify-between items-center bg-black">
      <Image 
        className="xxs:w-[130px] xxs:h-[32.5px]"
        src={'https://res.cloudinary.com/dmo7nzytn/image/upload/v1727832524/n1_1_1_wo6k0x.png'}
        alt="Logo"
        width={160}
        height={40}
        priority={true}
      ></Image>

      <div className="flex gap-4 items-center">
        <GoBell className="xs:text-2xl xxs:text-lg text-white dark:text-white"/>
        <GoSearch className="xs:text-2xl xxs:text-lg text-white dark:text-white cursor-pointer" onClick={()=>{changeState(searchBarState)}} />
        <div
          className={`rounded-full w-[1.875rem] h-[1.875rem] bg-cover`}
          style={{ backgroundImage: `url(https://res.cloudinary.com/dmo7nzytn/image/upload/v1715983820/grupo-fera/images/felipe_fera_to4xne.jpg)` }}
        ></div>
      </div>
    </div>
    <div className={`px-2 bg-black ${searchBarState > 0 ? null : 'py-4'}`}>
      <input type="text" className={`bg-[#CECECE] rounded-full h-[2.15rem] w-full text-black mb-2 ${searchBarState > 0 ? 'hidden' : 'block'} `} value={ searchBar! } placeholder="Pesquise um video pelo título..." onChange={(e)=>{setSearchBar(e.target.value)}}/>
    </div>
    <div className="h-[40px] bg-[#ECECEC] flex items-center px-2">
      <div className="flex items-center overflow-x-scroll w-auto lg:overflow-auto">
        <IoCompassOutline className="text-6xl text-black dark:text-black"></IoCompassOutline>
        <span className="ml-2 font-semibold xs:text-base xxs:text-sm text-black dark:text-black">Explorar</span>

        <div className="border-r-2 border-[#CECECE] mx-2"/>

        <div className="overflow-x-scroll flex gap-4 w-auto items-center lg:overflow-auto">
          {categories && categories.map((category: any, index: number)=>{
            return <button key={index} className="border-2 xs:text-base xxs:text-sm border-[#CECECE] rounded-full w-auto whitespace-nowrap px-5 text-black dark:text-black" onClick={()=>{setActiveTag(category.value)}}>{category.name}</button>          
          })}
        </div>
      </div>
    </div>

    <div className="w-full flex flex-col flex-wrap lg:flex-row lg:justify-between lg:pt-5 lg:px-10">
      {
      videos && videos
      .filter((video: any) => searchBar == '' ? video.tags.includes(activeTag) : video.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(searchBar.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")))
      .map((video: any, indice: number) => {
        
        if (!hasAcessToCourses && video.tags.includes("Cursos")){
          return null;
        }

        return <Thumbs props={video} key={indice} setTabIndex={setTabIndex} />;
      
      })}
    </div>
  </div>
  </>
  )
}