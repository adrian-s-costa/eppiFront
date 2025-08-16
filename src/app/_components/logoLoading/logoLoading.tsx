import Image from "next/image"

export default function LogoLoading(){

    return <>
        <div className="animate-[wiggle_1s_ease-in-out_infinite] h-screen w-screen fixed bg-black z-10 relative flex items-center justify-center">
        <Image 
        className="pb-8"
        src={'https://res.cloudinary.com/dmo7nzytn/image/upload/v1727832524/n1_1_1_wo6k0x.png'}
        alt="Logo"
        width={300}
        height={180}
        priority={true}
      ></Image>
        </div>
    </>
}