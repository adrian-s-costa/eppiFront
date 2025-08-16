"use client"

import { Badge } from "flowbite-react"
import Image from "next/image"
import Link from "next/link"

export default function Thumbs({props, setTabIndex}: any){

  return (
    <Link href={`/video/${props.id}`} onClick={()=>{localStorage.setItem('page', "1"); setTabIndex(1)}}>
      <div className="flex flex-col cursor-pointer relative lg:w-80">
        <Image
          priority={true}
          src={props.thumbnailUrl}
          width={1000}
          height={700} 
          alt={props.name}
          className="w-full bg-slate-300 h-auto lg:rounded-lg lg:hover:scale-105 lg:duration-300"></Image>
        <div className="p-5 lg:px-2 flex">
          <div
            className={`rounded-full w-[2.5rem] h-[2.5rem] bg-cover mr-4`}
            style={{ backgroundImage: `url(https://res.cloudinary.com/dmo7nzytn/image/upload/v1715983820/grupo-fera/images/felipe_fera_to4xne.jpg)` }}
          />
          <div className="flex flex-col w-[90%]">
            <span className="text-black xs:text-base xxs:text-sm">{props.name}</span>
            <span className="text-xs text-[#6C6C6C]">{props.views} views</span>
          </div>
        </div>
      </div>
    </Link>
  )
}