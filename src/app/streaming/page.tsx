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
import { Badge, Drawer } from "flowbite-react";
import { FaUserCircle } from "react-icons/fa";

export default function Streaming({setTabIndex}: any){

  const [videos, setVideos] = useState<any>()
  const [categories, setCategories] = useState<any>()
  const [activeTag, setActiveTag] = useState<string>('Todos')
  const [searchBar, setSearchBar] = useState<string>('')
  const [searchBarState, setSearchBarState] = useState<number>(1)
  const [password, setPassword] = useState<string>('');
  const [hidden, setHidden] = useState<string>('hidden');
  const [hasAcess, setHasAcess] = useState<boolean>(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [filterSearch, setFilterSearch] = useState<string>('');


  const hasAcessToCourses = typeof window !== "undefined" ? window.localStorage.getItem("hasAcess") : false; 
  const pfpUrl = typeof window !== "undefined" ? window.localStorage.getItem("pfpUrl") : false;

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

    <div className=" flex px-3 h-16 justify-between items-center bg-white drop-shadow-md">
      <Image 
        className="xxs:w-[70px] xxs:h-[120px]"
        src={'https://res.cloudinary.com/dmo7nzytn/image/upload/v1758980597/home_e%CC%81ppi_4_w2xqkb.png'}
        alt="Logo"
        width={200}
        height={80}
        priority={true}
      ></Image>

      <div className="flex gap-4 items-center">
        <GoBell className="xs:text-2xl xxs:text-lg text-[#8609A3] dark:text-[#8609A3]"/>
        <GoSearch className="xs:text-2xl xxs:text-lg text-[#8609A3] dark:text-[#8609A3] cursor-pointer" onClick={()=>{changeState(searchBarState)}} />
        {
          pfpUrl == "" || pfpUrl == "." || !pfpUrl || pfpUrl === "null" || pfpUrl === null ?
          <FaUserCircle className="text-gray-400 text-4xl"/>
          :
          <div
            className={`rounded-full w-[1.875rem] h-[1.875rem] bg-cover`}
            style={{ backgroundImage: `url(${pfpUrl})` }}
          ></div>
        }
      </div>
    </div>
    <div
      className={`px-3 bg-white overflow-hidden transition-all duration-200 ease-out ${
        searchBarState > 0 ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100 py-3'
      }`}
    >
      <div className="w-full flex items-center gap-2 bg-[#F3F3F3] rounded-full px-3 py-1 shadow-sm border border-[#CECECE]">
        <GoSearch className="text-base text-[#8609A3]" />
        <input
          type="text"
          className="bg-transparent outline-none border-none focus:outline-none focus:ring-0 h-[2rem] w-full text-sm text-black placeholder:text-gray-500"
          value={searchBar!}
          placeholder="Pesquise um vídeo pelo título..."
          onChange={(e) => {
            setSearchBar(e.target.value);
          }}
        />
      </div>
    </div>
    <div className="h-[40px] bg-[#ECECEC] flex items-center px-2">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center overflow-x-scroll w-auto lg:overflow-visible">
          <IoCompassOutline className="text-6xl text-black dark:text-black"></IoCompassOutline>
          <span className="ml-2 font-semibold xs:text-base xxs:text-sm text-black dark:text-black">Explorar</span>
        </div>

        <Button
          color="light"
          size="xs"
          className="ml-2 border-2 border-[#CECECE] rounded-full text-black dark:text-black text-xs xs:text-sm px-4 py-1 hover:bg-[#8609A3] hover:text-white transition-colors duration-150 ease-out"
          onClick={() => setIsFilterDrawerOpen(true)}
        >
          Filtros
        </Button>
      </div>
    </div>

    <Drawer
      open={isFilterDrawerOpen}
      onClose={() => setIsFilterDrawerOpen(false)}
      position="bottom"
      className="w-full max-w-md mx-auto !rounded-t-2xl"
    >
      <Drawer.Header title="Filtrar vídeos" />
      <Drawer.Items>
        <div className="flex flex-col gap-4">
          <TextInput
            type="text"
            placeholder="Buscar categorias..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
          />
          <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
            <Button
              color="light"
              className={`${activeTag === "Todos" ? "bg-[#8609A3] text-white border-transparent" : "bg-white text-black border border-gray-300"} w-full justify-start`}
              onClick={() => {
                setActiveTag("Todos");
                setIsFilterDrawerOpen(false);
              }}
            >
              Todos
            </Button>
            {categories &&
              categories
                .filter((category: any) =>
                  filterSearch === ""
                    ? true
                    : category.name
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, "")
                        .includes(
                          filterSearch
                            .toLowerCase()
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, "")
                        )
                )
                .map((category: any, index: number) => (
                  <Button
                    key={index}
                    color="light"
                    className={`${activeTag === category.value ? "bg-[#8609A3] text-white border-transparent" : "bg-white text-black border border-gray-300"} w-full justify-start`}
                    onClick={() => {
                      setActiveTag(category.value);
                      setIsFilterDrawerOpen(false);
                    }}
                  >
                    {category.name}
                  </Button>
                ))}
          </div>
        </div>
      </Drawer.Items>
    </Drawer>

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