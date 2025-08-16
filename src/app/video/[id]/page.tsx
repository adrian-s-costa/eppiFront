// @ts-nocheck

'use client'

import { useState, useEffect } from "react";
import { FiThumbsUp, FiThumbsDown, FiCast } from "react-icons/fi";
import { FaWhatsapp, FaUserCircle } from "react-icons/fa";
import { IoArrowUndoOutline, IoSend } from "react-icons/io5";
import { IoMdThumbsUp } from "react-icons/io";
import { config } from "../../../../config";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Video = {
  comments: any;
  id: string;
  views: number;
  url: string;
  name: string;
  authorId: number;
  description: string;
  likes: number;
  dislikes: number;
  thumbnailUrl: string;
};

declare global {
  interface Window {
    __onGCastApiAvailable: (isAvailable: boolean) => void;
  }

  const cast: any;
  const chrome: any;
}

export default function Video({ params }: { params: { id: string } }) {
  
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [video, setVideo] = useState<Video | null>(null);
  const [comment, setComment] = useState<string | null>(null);
  const [like, setLike] = useState<Boolean>(false);
  const [contact, setContact] = useState<Boolean>(false);
  const [activeCommentId, setActiveCommentId] = useState<any>(null);
  const [answer, setAnswer] = useState<string | null>(null);


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
                produtos: `Streaming - ${video?.name}`,
                valor: "0,00",
                descricao: `Streaming - ${video?.name} - 
                ${localStorage.getItem("user")} se interessou pelo vídeo: ${video?.name} Disponivel em: ${video?.url}`,
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

  const handleView = async () => {
    try {
      const response = await fetch(`${config.API_URL}/videos/${params.id}/view`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch view');
      }
    } catch (error) {
      console.error('Error fetching view:', error);
    }
  }

  const fetchVideoData = async () => {
    try {
      const response = await fetch(`${config.API_URL}/videos/${params.id}`,{
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
      setVideo(videoData);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  const postComment = async () => {
    try {
      const response = await fetch(`${config.API_URL}/videos/${params.id}/comment`,{
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
      fetchVideoData();
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  const postAnswer = async (commentId: any) => {
    try {
      const response = await fetch(`${config.API_URL}/videos/${params.id}/comment/${commentId}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({name: "Felipe Fera", time: 'notNull', answer})
      });
      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }
      setActiveCommentId(null);
      fetchVideoData();
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    setViewportWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    
    fetchVideoData();

    handleView();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 

  const [isCastReady, setIsCastReady] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
    script.async = true;
    document.body.appendChild(script);

    window.__onGCastApiAvailable = function (isAvailable) {
      if (isAvailable) {
        const context = cast.framework.CastContext.getInstance();
        context.setOptions({
          receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
          autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
        });
        setIsCastReady(true);
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const startCasting = (videoUrl) => {
    const context = cast.framework.CastContext.getInstance();
    context.requestSession().then(() => {
      const castSession = context.getCurrentSession();
      const mediaInfo = new chrome.cast.media.MediaInfo(videoUrl, 'video/mp4');
      const request = new chrome.cast.media.LoadRequest(mediaInfo);
      castSession.loadMedia(request);
    });
  };

  const openAirplay = () => {
    const video = document.querySelector('video') as any;
    if (video && video.webkitShowPlaybackTargetPicker) {
      video.webkitShowPlaybackTargetPicker();
    } else {
      alert('AirPlay não suportado');
    }
  };

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


  return (
    <div className="w-full h-screen bg-white dark:bg-black relative lg:flex overflow-y-auto" suppressHydrationWarning>

      <video width={viewportWidth > 1024 ? viewportWidth - 400 : viewportWidth} className="bg-black" height={(viewportWidth / 16) * 9} controls={true} autoPlay={true} muted={true} playsInline={true} poster={video?.thumbnailUrl}>
        {video && <source src={video.url} type="video/mp4"/>}
        Seu navegador não suporta o vídeo
      </video>
      
      <div className="flex gap-4">
        {isCastReady && (
          <google-cast-launcher style={{ height: 48, width: 48 }} />
        )}

      </div>
      <div className="w-full p-5 h-auto">
        <div className="flex flex-col">
          {video && <span className="font-semibold text-lg text-black dark:text-black">{video.name}</span>}
          <span className="text-xs text-[#6C6C6C]">{video && video.views} views</span>
          <span className="text-xs mt-4 text-black dark:text-black">{video && video.description}</span>
        </div>
        <div className="w-full flex justify-around">
          <div className="flex items-center flex-col">
            { !like ? <FiThumbsUp
              className={`text-2xl mb-1 mt-5 cursor-pointer text-black`}
              onClick={()=>{
                handleLike('add')
              }}
            /> 
            :
            <IoMdThumbsUp className={`text-[1.60rem] mb-1 mt-5 cursor-pointer text-black dark:text-black`} 
              onClick={()=>{
                handleLike('remove')
              }}
            />}
            <span className="dark:text-black text-black xxs:text-sm xs:text-base">{video && video.likes + (like ? 1 : 0)}</span>
          </div>
          <div className="flex items-center flex-col">
            <FiThumbsDown className="text-2xl mb-1 mt-5 cursor-pointer dark:text-black text-black"/>
            <span className="dark:text-black text-black xxs:text-sm xs:text-base">{video && video.dislikes}</span>
          </div>
          <div className={`flex items-center flex-col ${contact ? 'text-green-500' : 'text-black'}`} onClick={()=>{handleContact();}}>
            <FaWhatsapp  className="text-2xl mb-1 mt-5 cursor-pointer"/>
            <span className="xxs:text-sm xs:text-base">Tenho interesse</span>
          </div>
          <div className="flex items-center flex-col" onClick={() => os === 'iOS' ? openAirplay() : startCasting(video?.url)}>
            <FiCast className="text-2xl mb-1 mt-5 cursor-pointer dark:text-black text-black"/>
            <span className="dark:text-black text-black xxs:text-sm xs:text-base">Espelhar</span>
          </div>
          <Link href={'/tab?options=1'} onClick={() => {localStorage.setItem('page', "1")}}>
            <div className="flex items-center flex-col">
              <IoArrowUndoOutline  className="text-2xl mb-1 mt-5 cursor-pointer text-black dark:text-black"/>
              <span className="text-black dark:text-black xxs:text-sm xs:text-base">Voltar</span>
            </div>
          </Link>
        </div>
        <div className="flex items-center pt-5 mb-5">
          <div
            className={`rounded-full w-[2.5rem] h-[2.5rem] bg-cover mr-4`}
            style={{ backgroundImage: `url(https://res.cloudinary.com/dmo7nzytn/image/upload/v1715983820/grupo-fera/images/felipe_fera_to4xne.jpg)` }}
          ></div>
          <span className="font-semibold text-lg dark:text-black text-black">Felipe Fera</span>
        </div>
        <div className=" h-auto pb-14 pl-2">
          {video && video.comments && video.comments.map((comment: any, indice: number)=>{
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
              <IoSend className="text-2xl z-2 absolute right-[1rem]  cursor-pointer dark:text-black text-black" onClick={()=>{postAnswer(comment.id); setAnswer('')}}/>
            </div>
          )}
            {comment.answers.map((answer: any, index: number)=>{
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
            })}
          </div>
          })}
        </div>
      <div className="fixed lg:relative z-1 w-full items-center lg:justify-center bottom-0 bg-white">
        <div className="lg:fixed flex xxs:my-3 xxs:h-10 xs:h-16 w-auto items-center mr-5 lg:justify-center lg:bottom-0 bg-white">
        {pfpUrl == "" || pfpUrl == "." || !pfpUrl ? 
          <FaUserCircle className="text-gray-400 text-4xl"/>
        : <div
            className={`rounded-full w-[60px] h-[40px] bg-cover box-border`}
            style={{ backgroundImage: `url(${pfpUrl})` }}
          ></div>
        }
          
            <Input type="email" className="mx-2" placeholder="Adicione um comentário..." value={ comment! } onChange={(e)=>{setComment(e.target.value)}}/>
            <Button type="submit" variant="outline" className="w-auto mr-5 lg:mr-0" disabled={ !comment } onClick={()=>{postComment(); setComment('')}}>
              Comentar
            </Button>
          </div>
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
    </div>
  );
}