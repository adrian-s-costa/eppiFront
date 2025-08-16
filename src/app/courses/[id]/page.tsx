'use client'

import { useState, useEffect, useRef } from "react";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { FaWhatsapp, FaUserCircle, FaRegClock } from "react-icons/fa";
import { IoArrowUndoOutline, IoSend } from "react-icons/io5";
import { IoMdThumbsUp } from "react-icons/io";
import { config } from "../../../../config";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { RatingComponent } from "@/app/_components/rating/rating";
import ClockComponent from "@/app/_components/clock/clock";
import { Tabs, TabsRef } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdArrowBackIos, MdDashboard } from "react-icons/md";
import { ScrollArea } from "@/components/ui/scroll-area"
import { RiPlayCircleFill, RiStopCircleFill } from "react-icons/ri";
import { FaPaperclip } from "react-icons/fa6";
import { useRouter } from "next/navigation";

type Course = {
  comments: any;
  id: string;
  title: string;
  description: string;
  totalDuration: string;
  imageUrl: string;
  modules: Module[];
  reviews: any;
};

type Module = {
  comments: any[];
  description: string;
  documents: any;
  documentUrl: string;
  documentName: string;
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  imageUrl: String;
}

export default function Video({ params }: { params: { id: string } }) {
  
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [course, setCourse] = useState<Course | null>(null);
  const [comment, setComment] = useState<string | null>(null);
  const [like, setLike] = useState<Boolean>(false);
  const [contact, setContact] = useState<Boolean>(false);
  const [activeCommentId, setActiveCommentId] = useState<any>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<Module | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  
  const router = useRouter();
  const tabsRef = useRef<TabsRef>(null);

  const handleReplyClick = (id: any) => {
    if (activeCommentId === id) {
      setActiveCommentId(null); // Fechar se já estiver aberto
    } else {
      setActiveCommentId(id);
    }
  };

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

  const userName = typeof window !== "undefined" ? window.localStorage.getItem('user') : false;
  const userId = typeof window !== "undefined" ? window.localStorage.getItem('id') : false;
  const pfpUrl = typeof window !== "undefined" ? window.localStorage.getItem("pfpUrl") : false;

  const handleContact = async () => {
    if (contact) return null;
    setContact(true);
    try {
        const response = await fetch(`https://acesso.meets.com.br/oportunidade/salvar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': '8C9DB575-0A8B-7CC5-4389-41D2CC6E9937'
            },
            body: JSON.stringify({
                id_usuario: 37456,
                id_origem: 313,
                razao_cliente: userName,
                fantasia: userName,
                email_cliente: localStorage.getItem('email'), 
                celular_cliente: localStorage.getItem('number'), 
                produtos: `Streaming - ${course?.title}`,
                valor: "0,00",
                descricao: `Streaming - ${course?.title} - 
                ${localStorage.getItem("user")} se interessou pelo curso: ${course?.title}`,
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const responseData = await response.json();
        notify();  // Notifica o usuário em caso de sucesso
    } catch (error) {
        console.error('Error fetching video:', error);
    } finally {
        setContact(false);  
      }
  };


  const handleLike = async (action: string) => {
    try {
      const response = await fetch(`${config.API_URL}/videos/${params.id}/like/${action}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }
      const videoData = await response.json();
      if (action == "add"){
        setLike(true);
      }
      else{
        setLike(false)
      }
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  }

  // const handleView = async () => {
  //   try {
  //     const response = await fetch(`${config.API_URL}/videos/${params.id}/view`,{
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         "ngrok-skip-browser-warning": "69420"
  //       }
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch view');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching view:', error);
  //   }
  // }

  const fetchCourseData = async () => {
    try {
      const response = await fetch(`${config.API_URL}/courses/${params.id}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }
      const videoData = await response.json();
      setCourse(videoData);
      setActiveVideo(videoData.modules[0]);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  const postComment = async () => {
    try {
      const response = await fetch(`${config.API_URL}/courses/${activeVideo?.id}/comment`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({name: userName, time: 'notNull', comment, pfpUrl})
      });
      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }
      fetchCourseData();
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  // const postAnswer = async (commentId: any) => {
  //   try {
  //     const response = await fetch(`${config.API_URL}/videos/${params.id}/comment/${commentId}`,{
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         "ngrok-skip-browser-warning": "69420"
  //       },
  //       body: JSON.stringify({name: "Felipe Fera", time: 'notNull', answer})
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch video');
  //     }
  //     setActiveCommentId(null);
  //     fetchCourseData();
  //   } catch (error) {
  //     console.error('Error fetching video:', error);
  //   }
  // };

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    setViewportWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    
    fetchCourseData();

    //handleView();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    
    // <div>
    // <h1>Meu Vídeo HLS</h1>
    //   <VideoPlayer videoUrl={videoUrl} />
    // </div>


    <div className="w-full h-screen bg-white dark:bg-black relative lg:flex">
      <MdArrowBackIos className='text-3xl left-0 cursor-pointer absolute text-white ml-5 mt-5 z-10 ' onClick={() => {router.push("/courses")} } />
   
   
      {/* <video key={activeVideo?.videoUrl} width={viewportWidth > 1024 ? viewportWidth - 384 : viewportWidth} height={(viewportWidth / 16) * 9} controls={true} autoPlay={true} muted={true} playsInline poster={activeVideo?.videoUrl}>
        {activeVideo && <source src={activeVideo.videoUrl} type="video/mp4"/>}
        Seu navegador não suporta o vídeo
      </video> */}

      <div className="lg:h-screen bg-black lg:flex lg:justify-center lg:items-center">
        <iframe id="panda-addd54b1-6011-4f2c-9f73-c4571dd11e9d"
        src={activeVideo?.videoUrl}
        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen"
        width={viewportWidth > 1024 ? viewportWidth - 384 : viewportWidth} height={viewportWidth > 1024 ? ((viewportWidth / 16) * 9) - 200 : (viewportWidth / 16) * 9} loading="eager"
        />
      </div>
    
      <div className="w-full p-5 lg:w-96 lg:h-screen lg:overflow-y-auto">
        <div className="flex flex-col">
          {course && <span className="font-semibold text-lg text-black dark:text-black mb-2">{activeVideo && activeVideo.title}</span>}
          <div className="w-full flex justify-between">
            <RatingComponent/>
            <ClockComponent value={course?.totalDuration}/>
          </div>
          <span className="text-sm mt-2 text-black dark:text-black">{activeVideo && activeVideo.description}</span>
        </div>
            <Tabs aria-label="Tabs with icons" style={"underline"} ref={tabsRef} onActiveTabChange={(tab) => setActiveTab(tab)}>
                <Tabs.Item active title="Módulos">
                <ScrollArea className="w-full">
                  <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                    {
                      course && course.modules && course.modules.map((module, index)=>{
                        return <>
                          <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6" onClick={()=>{setActiveVideo(module)}}>
                            <div className="flex w-0 flex-1 items-center">
                              {module.id === activeVideo?.id ?
                                <RiStopCircleFill className="shrink-0 text-black text-[25px]"/>
                                :
                                <RiPlayCircleFill className="shrink-0 text-black text-[25px]"/>
                              }

                              <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                <span className="truncate font-medium">{module.title}</span>
                              </div>
                            </div>
                            <div className="ml-4 shrink-0">
                              <a className="font-bold text-gray-500">
                                {module.duration}
                              </a>
                            </div>
                          </li>
                        </>
                      })
                    }
                  </ul>
                </ScrollArea>    
                </Tabs.Item>
                <Tabs.Item title="Material">
                <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                  {
                    activeVideo && activeVideo.documents?.map((document: any) => (
                      <li
                        key={document.id} // Use uma chave única em vez do index
                        className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6"
                      >
                        <div className="flex w-0 flex-1 items-center">
                          <FaPaperclip aria-hidden="true" className="h-5 w-5 shrink-0 text-gray-400" />
                          <div className="ml-4 flex min-w-0 flex-1 gap-2">
                            <span className="truncate font-medium">{document.documentName}</span>
                          </div>
                        </div>
                        <div className="ml-4 shrink-0">
                          <a
                            className="font-medium text-[#1091b2] hover:text-[#5f94b2]"
                            href={document.documentUrl}
                          >
                            Download
                          </a>
                        </div>
                      </li>
                    )
                  )}
                </ul>
                </Tabs.Item>
                <Tabs.Item title="Comentários">
                  <ScrollArea className="h-[100%] w-full mb-8">
                    {
                    activeVideo && activeVideo.comments && activeVideo.comments.map((comment: any, indice: number)=>{
                      return <div className="mb-5" key={indice}>
                        <div className="flex items-center">

                        {comment.pfpUrl == "" || comment.pfpUrl == "." || !comment.pfpUrl ? 
                        <FaUserCircle className="text-gray-400 mr-2"/>
                        : <div
                            className={`rounded-full w-[1.3rem] h-[1.3rem] bg-cover mr-4`}
                            style={{ backgroundImage: `url(${comment.pfpUrl})` }}
                        ></div>}

                        <span className="text-xs mr-1 dark:text-black text-black">{comment.name}</span>
                        <span className="text-xsv text-[#6C6C6C]"> • </span>
                        <span className="text-xs ml-1 text-[#6C6C6C]">{comment.time}</span>
                        </div>
                        <span className="text-sm dark:text-black text-black">{comment.comment}</span>
                        <br/>
                        {
                        userId == '6664b1fda42a8fbb236c3d4a' ? 
                        <a className="text-xs mr-1 dark:text-black text-black hover:underline" onClick={() => handleReplyClick(comment.id)}>reponder</a>
                        : null
                        }
                        {activeCommentId === comment.id && (
                        <div className="flex relative items-center">
                        <input type="text" className="bg-[#CECECE] rounded-full pl-4 pr-10 h-8 w-full text-black" value={ answer! } placeholder="Adicione um comentário..." onChange={(e)=>{setAnswer(e.target.value)}}/>
                        <IoSend className="text-2xl z-2 absolute right-[1rem]  cursor-pointer dark:text-black text-black" onClick={()=>{setAnswer('')}}/>
                        </div>
                    )}
                        {/* {comment.answers.map((answer: any, index: number)=>{
                        if (answer.commentId == comment.id) {
                            return <div className="mb-5 ml-5" key={indice}>
                            <div className="flex items-center mt-2">
                            <div
                                className={`rounded-full w-[1rem] h-[1rem] bg-cover mr-2`}
                                style={{ backgroundImage: `url(https://res.cloudinary.com/dmo7nzytn/image/upload/v1715983820/grupo-fera/images/felipe_fera_to4xne.jpg)` }}
                                ></div>
                            <span className="text-xs mr-1 dark:text-black text-black">{answer.name}</span>
                            <span className="text-xsv text-[#6C6C6C]"> • </span>
                            <span className="text-xs ml-1 text-[#6C6C6C]">{answer.time}</span>
                            </div>
                            <span className="text-sm dark:text-black text-black">{answer.answer}</span>
                            </div>
                        }
                        })} */}
                    </div>
                    })}
                    </ScrollArea>
                </Tabs.Item>
            </Tabs>
      </div>
      <div className={` z-1 bottom-0 flex px-4 xxs:h-12 xs:h-20 w-full items-center bg-white ${activeTab == 2 ? 'fixed' : 'hidden'}`}>
        {pfpUrl == "" || pfpUrl == "." || !pfpUrl ? 
          <FaUserCircle className="text-gray-400 text-4xl"/>
        : <div
            className={`rounded-full w-[2.25rem] h-[2.25rem] bg-cover box-border`}
            style={{ backgroundImage: `url(${pfpUrl})` }}
          ></div>
        }
        
        <input type="text" className=" bg-[#CECECE] w-full rounded-full h-[2.15rem] pl-4 pr-10 ml-4 text-black" value={ comment! } placeholder="Adicione um comentário..." onChange={(e)=>{setComment(e.target.value)}}/>
        <IoSend className="text-2xl z-2 absolute right-[1.7rem] cursor-pointer dark:text-black text-black" onClick={()=>{postComment(); setComment('')}}/>
      </div>
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
  );
}