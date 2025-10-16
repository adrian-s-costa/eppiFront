"use client";

import { motion } from "framer-motion";
import { MdArrowBackIos } from "react-icons/md";
import { IoRefresh } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ErrorScreenProps {
  onRetry: () => void;
  setTabIndex: (number: number) => void;
  title?: string;
  message?: string;
}

export default function ErrorScreen({ 
  onRetry, 
  setTabIndex,
  title = "Ops! Algo deu errado", 
  message = "Não foi possível carregar os dados. Verifique sua conexão e tente novamente." 
}: ErrorScreenProps) {
  const router = useRouter();

  const handleGoBack = () => {
    setTabIndex(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full min-h-screen bg-gradient-to-br from-[#8609A3] to-[#5b056e] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-white/20"
      >
        {/* Logo em círculo com indicador de erro */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, duration: 0.3, type: "spring", stiffness: 200 }}
          className="relative w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-white shadow-xl"
        >
          <motion.div
            animate={{ rotate: [0, -6, 6, -6, 0] }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-20 h-12 relative"
          >
            <Image
              src="https://res.cloudinary.com/dmo7nzytn/image/upload/v1757886696/Logo_Horizontal_164x48_-_A_AGENCIA_logo_rvbbq5.svg"
              alt="Logo éppi"
              fill={false}
              width={160}
              height={48}
              className="object-contain w-full h-full"
              priority
            />
          </motion.div>
          {/* Badge de erro no canto superior direito */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, duration: 0.2 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md"
          >
            <span className="text-white text-xs font-bold">X</span>
          </motion.div>
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="text-2xl font-bold text-white mb-4"
        >
          {title}
        </motion.h1>

        {/* Mensagem */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="text-white/80 text-base mb-8 leading-relaxed"
        >
          {message}
        </motion.p>

        {/* Botões */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          className="flex flex-col gap-4"
        >
          {/* Botão de refazer */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="w-full bg-white text-[#5b056e] font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <IoRefresh className="text-xl" />
            Tentar Novamente
          </motion.button>

          {/* Botão de voltar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="w-full bg-transparent border-2 border-white/30 text-white font-medium py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all duration-200"
          >
            <MdArrowBackIos className="text-lg" />
            Voltar
          </motion.button>
        </motion.div>

        {/* Efeito de partículas animadas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 400 - 200, 
                y: Math.random() * 400 - 200,
                opacity: 0 
              }}
              animate={{ 
                x: Math.random() * 400 - 200, 
                y: Math.random() * 400 - 200,
                opacity: [0, 0.3, 0]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5
              }}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}


