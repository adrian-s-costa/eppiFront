"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  const router = useRouter();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full max-w-md bg-white rounded-2xl p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
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
                onClick={onClose}
              >
                Fechar
              </button>
              <button
                className="w-full py-3 rounded-xl bg-[#8609A3] text-white font-semibold"
                onClick={() => { 
                  onClose(); 
                  router.push('/tab'); 
                }}
              >
                Ir para início
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
