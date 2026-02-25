"use client";

import Image from "next/image";
import Link from "next/link";

interface Campaign {
  id: string;
  imgSrc: string;
  title: string;
  desc: string;
  price: string;
}

interface CampaignsListProps {
  campaigns: Campaign[] | null;
}

export default function CampaignsList({ campaigns }: CampaignsListProps) {
  if (!campaigns || campaigns.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h1 className="text-lg font-bold mb-4">O que há de novo</h1>
      <div className="flex overflow-x-scroll gap-3">
        {campaigns.map((carro: Campaign, index: number) => (
          <Link
            href={{
              pathname: '/offerProduct',
              query: { id: carro.id },
            }}
            key={index}
            className="relative"
          >
            <Image 
              quality={100} 
              priority={true} 
              className="xxs:w-[202px] xxs:h-[117px] xs:w-[232px] xs:h-[147px] rounded-lg mb-2 xs:min-w-[232px] xs:min-h-[147px] xxs:min-w-[202px] xxs:min-h-[117px] bg-cover" 
              src={carro.imgSrc!} 
              alt="" 
              width={230} 
              height={125}
            />
            <div className="flex flex-col gap-1 xxs:w-[202px] xs:w-[232px]">
              <span className="xs:text-base xxs:text-sm font-semibold">{carro.title}</span>
              <span className="xs:text-sm xxs:text-xs">{carro.desc}</span>
              <span className="text-[#838383] xs:text-base xxs:text-sm dark:text-black">{carro.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
