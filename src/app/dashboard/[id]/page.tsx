"use client"

import { MdArrowBackIos } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import { Carousel } from "flowbite-react";
import { getCategoryContent, getCategoryContentCustom, getOneCategoryContent } from "../../../../utils/api/service";
import { Table, Tabs } from "flowbite-react";
import Tables from "@/app/_components/table/table";
import { ChartComponent } from "@/app/_components/chart/Chart";
import Loader from "@/app/loader/page";
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SelectComponent } from "@/app/_components/select/select";
import FixedDate from "@/app/_components/fixedDate/fixedDate";
import { PickDate } from "@/app/_components/pickDate/pickDate";
import React from "react";
import { ChartBarComponent } from "@/app/_components/chart/ChartBar";

export default function Campaign({ params }: { params: { id: string } }){
  const searchParams = useSearchParams();
  const [contact, setContact] = useState<Boolean>(false)
  const [content, setContent] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true);
  const [modoDash, setModoDash] = useState<string>("fixo");
  const [initialDate, setInitialDate] = React.useState<Date>()
  const [finalDate, setFinalDate] = React.useState<Date>()
  const [customValues, setCustomValues] = useState<any>(
    (
      [
        {
          valores: "Valores",
          impressions: 0,
          click: 0,
          ctr: 0
        }
      ]
    )
  )
  const [altLoading, setAltLoading] = useState<boolean>(false);

  const [ activeValues, setActiveValues ] = useState<any>(
  [
    {
      valores: "Valores",
      impressions: 0,
      click: 0,
      ctr: 0
    }
  ])

  const router = useRouter();

  useEffect(() => {
    setLoading(true)
    try {
      getOneCategoryContent(params.id).then((res)=>{
        setContent(res);
        setLoading(false);
      })    
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(()=>{

    if (!initialDate || !finalDate) return

    setAltLoading(true)

    try {
      getCategoryContentCustom(params.id, initialDate!, finalDate!).then((res)=>{
        setCustomValues(res)
        setActiveValues([{ valores: "Valores", impressions: res.viewCount, click: res.clickCount, ctr: res.CTRCount}])
      })    
    } catch (error) {
      console.error(error);
    }

    setAltLoading(false)
    
  }, [initialDate, finalDate])

    
  return (
    <div className="w-full min-h-screen h-full bg-gray-100 p-5 pb-20">
      <div className="w-full flex justify-center relative">
          <MdArrowBackIos
            className="text-2xl left-0 top-[17px] cursor-pointer absolute text-black"
            onClick={() => {
              router.back();
            }}
          />
  
        <Image
          src={"https://storage.googleapis.com/videos-grupo-fera/static/logos/logo.webp"}
          alt={""}
          width={70}
          height={1160}
        />
      </div>
  
      {/* 
      <div className="xxs:h-[15rem] my-5">
        <Carousel draggable={true}>
          {
            content && content.secondaryImgs.map((img: any, index: any)=>{
              return <img src={img.imgSrc} alt="..." key={index} />
            })
          }
        </Carousel>
      </div> 
      */}
  
      <div className="w-full relative pt-5">
        <div className="bg-white w-full p-2 mb-5 flex justify-between items-center rounded-md">
          <p className="font-medium text-black dark:text-black">Relatório</p>
          <SelectComponent setMode={setModoDash}/>
        </div>
        
        {
          modoDash === "fixo" ? 
            <>
              <FixedDate loading={loading} content={content} setActiveValues={setActiveValues}/>
              <ChartBarComponent activeValues={activeValues} mode={modoDash}/>
            </>
          :
          <>
            <div className="mb-5 flex flex-col gap-2">
              <PickDate date={initialDate} setDate={setInitialDate} title={"Escolha a data inicial"}/>
              <PickDate date={finalDate} setDate={setFinalDate} title={"Escolha a data final"}/>
            </div>
            {!altLoading ? <Tables
              impressions={customValues && customValues.viewCount}
              clicks={customValues && customValues.clickCount}
              CTR={customValues && customValues.CTRCount}
            />
            :
            <Skeleton className="h-[92px] w-full rounded-xl bg-white mt-5 mb-3"/>
          }
            <ChartBarComponent activeValues={activeValues} mode={modoDash} initialDate={initialDate} finalDate={finalDate}/>
          </>
        }
      </div>
    </div>
  )}