"use client"

import Image from "next/image"
import logo from './Logo.png'
import { GoBell, GoSearch } from "react-icons/go";
import { IoCompassOutline } from "react-icons/io5";
import { getVideos, getVideoById, getCategories, getCampaigns, getCourses } from "../../../utils/api/service";
import { useEffect, useState } from "react";
import { Button, Checkbox, Label, Modal, TextInput, Toast } from "flowbite-react";
import { ToastContainer, toast } from 'react-toastify';
import { HiX } from "react-icons/hi";
import { Badge } from "flowbite-react";
import { useRouter } from "next/navigation";
import { MdArrowBackIos } from "react-icons/md";
import Link from "next/link";
import ClockComponent from "../_components/clock/clock";
import { RatingComponent } from "../_components/rating/rating";

export default function Courses({setTabIndex}: any){

  const [videos, setVideos] = useState<any>()
  const [categories, setCategories] = useState<any>()
  const [activeTag, setActiveTag] = useState<string>('Todos')
  const [searchBar, setSearchBar] = useState<string>('')
  const [searchBarState, setSearchBarState] = useState<number>(1)
  const [password, setPassword] = useState<string>('');
  const [hidden, setHidden] = useState<string>('hidden');
  const [hasAcess, setHasAcess] = useState<boolean>(false);
  const [courses, setCourses] = useState<any>()

  const hasAcessToCourses = typeof window !== "undefined" ? window.localStorage.getItem("hasAcess") : false;  

  const router = useRouter();

  const changeState = (n: number) => {
    return setSearchBarState( searchBarState * -1);
  }

  useEffect(()=>{
    try {
      getCourses().then((res) => {
        setCourses(res);
      });
    } catch (error) {
      console.error(error);
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
    <div className=" min-h-screen h-auto bg-white dark:bg-black overflow-y-hidden pb-[4.5rem]">
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
      <div className="w-full min-h-screen h-full bg-gray-100 p-5">
        <div className="w-full flex justify-center relative">
          <Link href="/tab">
            <MdArrowBackIos className='text-2xl left-0 top-[17px] cursor-pointer absolute text-black' onClick={() => {localStorage.setItem('page', "2")}} />
          </Link>
          
          <Image 
            src={"https://storage.googleapis.com/videos-grupo-fera/static/logos/logo.webp"} 
            alt={""}
            width={70}
            height={1160}          
          />  
          
        </div>
        
        {/* <div className="xxs:h-[15rem] my-5">
          <Carousel draggable={true}>
            {
              content && content.secondaryImgs.map((img: any, index: any)=>{
                return <img src={img.imgSrc} alt="..." key={index} />
              })
            }
          </Carousel>
        </div> */}
        <div className="w-full relative pt-5">
          <div className="bg-white w-full p-2 mb-5 rounded-md">
            <p className="font-medium font-bold text-lg text-black dark:text-black">
              Cursos
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col">
          <div className="xs:mt-1 xxs:mt-1">
            <h1 className="xxs:text-sm xs:text-sm font-medium mb-2">Carros híbridos</h1>
            <div className="flex overflow-x-scroll gap-3 w-full flex-col flex-wrap lg:flex-row lg:justify-between lg:pt-5">
              {courses && courses
              // .filter((carro: any) => carro.uf.includes(uf))
              .map((course: any, index: number)=>{
                return <Link
                  href={{
                    pathname: `/courses/${course.id}`,
                    // query: { id: course.id },
                  }}
                  key={index}
                  className="relative"
                >
                  <Badge color="warning" size="sm" className={ course.title.includes('Dolphin') ? `block absolute right-2 top-2` : `hidden`}>Dolphin Day!</Badge>
                  <Image quality={100} priority={true} className="xxs:w-[202px] xxs:h-[117px] xs:w-[232px] xs:h-[147px] rounded-lg mb-2 xs:min-w-[232px] xs:min-h-[117px] xxs:min-w-[202px] xxs:min-h-[117px] bg-cover" src={course.imageUrl!} alt={""} width={230} height={125}/>
                  <div className="flex flex-col gap-1 xxs:w-[202px] xs:w-[232px]">
                    <span className="xs:text-base xxs:text-sm font-semibold">{course.title}</span>
                    <RatingComponent />
                    <ClockComponent value={course.totalDuration}/>
                  </div>
                </Link>
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}