"use client";

import React, { useState } from "react";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { Tab, TabList } from "@chakra-ui/react";
import { RiGraduationCapFill, RiGraduationCapLine, RiHome5Fill, RiHome5Line } from "react-icons/ri";
import { PiAirplayFill } from "react-icons/pi";
import { LuAirplay } from "react-icons/lu";
import { IoPerson, IoPersonOutline } from "react-icons/io5";
import { IoChevronUp } from "react-icons/io5";
import Draggable from "react-draggable";
import { motion, AnimatePresence } from "framer-motion";

export type IconProps = React.HTMLAttributes<SVGElement>;

export function DockDemo({ tabIndex }: any) {
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(true);
  
  const isClubTab = true; // CLUBE tab
  
  const handleExpand = () => {
    setIsManuallyExpanded(true);
  };
  
  const handleCollapse = () => {
    setIsManuallyExpanded(false);
  };
  
  // Reset manual expansion when changing tabs
  React.useEffect(() => {
    // if (tabIndex !== 4) {
    //   setIsManuallyExpanded(false);
    // }
  }, [tabIndex]);

  return (
    <>
      {/* Dock principal */}
      <AnimatePresence>
        {(!isClubTab || isManuallyExpanded) && (
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`fixed w-full z-20 bottom-5`}
          >
            <Dock direction="middle" className="bg-white">
              <DockIcon>
                  <Tab className="flex flex-col">
                      {tabIndex === 0 ? 
                          <RiHome5Fill className="text-2xl text-black" /> 
                          : 
                          <RiHome5Line className="text-2xl text-black" />
                      }
                      <p className="text-black text-[0.5rem]"> HOME </p>
                  </Tab>
              </DockIcon>
              <DockIcon>
                  <Tab className="flex flex-col">
                      {tabIndex === 1 ? 
                          <PiAirplayFill className="text-2xl text-black" /> 
                          : 
                          <LuAirplay className="text-2xl text-black" />
                      }
                      <p className="text-black text-[0.5rem]"> STREAMING </p>
                  </Tab>
              </DockIcon>
              {/* <DockIcon>
                <Tab className="flex flex-col">
                  {tabIndex === 2 ? 
                      <RiGraduationCapFill className="text-2xl text-black" /> 
                      :   
                      <RiGraduationCapLine className="text-2xl text-black" />
                  }
                  <p className="text-black text-[0.5rem]"> CURSOS </p>
                </Tab>
              </DockIcon> */}
              <DockIcon>
                <Tab className="flex flex-col">
                      {
                          tabIndex === 2 ? 
                              <IoPerson className="text-2xl text-black" /> 
                              :
                              <IoPersonOutline className="text-2xl text-black" />
                      }
                  <p className="text-black text-[0.5rem]"> PERFIL </p>
                </Tab>
              </DockIcon>
              {/* <DockIcon>
                <Tab className="flex flex-col">
                      {
                          tabIndex === 4 ? 
                              <IoPerson className="text-2xl text-black" /> 
                              :
                              <IoPersonOutline className="text-2xl text-black" />
                      }
                  <p className="text-black text-[0.5rem]"> CLUBE </p>
                </Tab>
              </DockIcon> */}
            </Dock>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Botão de expansão quando na tab CLUBE */}
      <AnimatePresence>
        {isClubTab && !isManuallyExpanded && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-4 right-4 z-20"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleExpand}
              className="bg-white rounded-full p-3 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-200"
            >
              <IoChevronUp className="text-xl text-black" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Botão para colapsar quando expandido na tab CLUBE */}
      <AnimatePresence>
        {isClubTab && isManuallyExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-20"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCollapse}
              className="bg-slate-100 rounded-full p-2 shadow-md border border-slate-200 hover:bg-slate-200 transition-colors duration-200"
            >
              <IoChevronUp className="text-lg text-slate-600 rotate-180" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
