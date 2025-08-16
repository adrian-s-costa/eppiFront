"use client";

import React from "react";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { Tab, TabList } from "@chakra-ui/react";
import { RiGraduationCapFill, RiGraduationCapLine, RiHome5Fill, RiHome5Line } from "react-icons/ri";
import { PiAirplayFill } from "react-icons/pi";
import { LuAirplay } from "react-icons/lu";
import { IoPerson, IoPersonOutline } from "react-icons/io5";

export type IconProps = React.HTMLAttributes<SVGElement>;

export function DockDemo({ tabIndex }: any) {
  return (
    <div className="fixed w-full z-20 bottom-5">
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
        <DockIcon>
          <Tab className="flex flex-col">
            {tabIndex === 2 ? 
                <RiGraduationCapFill className="text-2xl text-black" /> 
                :   
                <RiGraduationCapLine className="text-2xl text-black" />
            }
            <p className="text-black text-[0.5rem]"> CURSOS </p>
          </Tab>
        </DockIcon>
        <DockIcon>
          <Tab className="flex flex-col">
                {
                    tabIndex === 3 ? 
                        <IoPerson className="text-2xl text-black" /> 
                        :
                        <IoPersonOutline className="text-2xl text-black" />
                }
            <p className="text-black text-[0.5rem]"> PERFIL </p>
          </Tab>
        </DockIcon>
      </Dock>
    </div>
  );
}
