// @ts-nocheck

'use client'

import { useState, useEffect } from "react";
import { FiThumbsUp, FiThumbsDown, FiCast } from "react-icons/fi";
import { FaWhatsapp, FaUserCircle } from "react-icons/fa";
import { IoArrowUndoOutline, IoSend } from "react-icons/io5";
import { IoMdThumbsUp } from "react-icons/io";
import { config } from "../../../../config";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AnimatePresence, motion } from "framer-motion";

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
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState<number>(0);

  // Atualiza a contagem de comentários quando o vídeo for carregado
  useEffect(() => {
    if (video?.comments) {
      setCommentCount(video.comments.length);
    }
  }, [video]);


  const handleReplyClick = (id: any) => {
    if (activeCommentId === id) {
      setActiveCommentId(null);
    } else {
      setActiveCommentId(id);
    }
  };

  const openSuccess = () => setSuccessOpen(true);

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
        openSuccess();  // Notifica o usuário em caso de sucesso
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

        {/* Uploader Information */}
        <div className="flex items-center pt-4 pb-3 px-4 mt-4">
          <div
            className="rounded-full w-10 h-10 bg-cover mr-3 flex-shrink-0"
            style={{ backgroundImage: `url(https://res.cloudinary.com/dmo7nzytn/image/upload/v1715983820/grupo-fera/images/felipe_fera_to4xne.jpg)` }}
          ></div>
          <span className="font-semibold text-lg text-gray-900">Felipe Fera</span>
        </div>
        
        {/* Botão Flutuante de Comentários */}
        <div className="fixed bottom-6 right-6 z-40">
          <button 
            onClick={() => setCommentsOpen(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg px-4 py-3 shadow-lg flex items-center space-x-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>Comentários ({commentCount})</span>
          </button>
        </div>
      </div>
      
      {/* Modal de Comentários */}
      <AnimatePresence>
        {commentsOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setCommentsOpen(false)}
          >
            <motion.div 
              className="bg-white flex flex-col h-[90vh] max-h-[800px] w-full max-w-2xl mx-auto rounded-t-2xl overflow-hidden shadow-xl"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 30 }}
            >
              <div className="bg-white flex-shrink-0 py-4 px-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Comentários ({commentCount})</h3>
                <button 
                  onClick={() => setCommentsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 -mr-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {!video?.comments || video.comments.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500 text-center">
                      Seja o primeiro a comentar nesse vídeo!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {video.comments.map((comment: any, index: number) => (
                      <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                            {comment.pfpUrl && comment.pfpUrl !== "." ? (
                              <div 
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${comment.pfpUrl})` }}
                              />
                            ) : (
                              <FaUserCircle className="w-full h-full text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900">{comment.name}</span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{comment.time}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 ml-11">
                          {comment.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Input de Comentário no Modal */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="w-full flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {pfpUrl && pfpUrl !== "." ? (
                      <div 
                        className="w-10 h-10 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${pfpUrl})` }}
                      />
                    ) : (
                      <FaUserCircle className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={comment || ''}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Adicione um comentário..."
                      className="w-full bg-gray-100 rounded-full pl-4 pr-20 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && comment) {
                          postComment();
                          setComment('');
                        }
                      }}
                    />
                    <button
                      onClick={() => { if (comment) { postComment(); setComment(''); }}}
                      disabled={!comment}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                        comment 
                          ? 'bg-[#8609A3] text-white hover:bg-[#6d0785]' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Success Modal */}
      <AnimatePresence>
        {successOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={()=> setSuccessOpen(false)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 12, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full max-w-md bg-white rounded-2xl p-6 text-center shadow-2xl"
              onClick={(e)=> e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 340, damping: 18 }}
                className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 7L9 18L4 13" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              <h3 className="text-lg font-semibold text-black">Contato enviado!</h3>
              <p className="text-slate-600 mt-1">Recebemos seu interesse. Em breve um vendedor falará com você.</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  className="w-full py-3 rounded-xl border border-slate-200 text-slate-700"
                  onClick={()=> setSuccessOpen(false)}
                >
                  Fechar
                </button>
                <button
                  className="w-full py-3 rounded-xl bg-[#8609A3] text-white font-semibold"
                  onClick={()=> { setSuccessOpen(false); localStorage.setItem('page', "1"); window.location.href = '/tab?options=1'; }}
                >
                  Ir para início
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}