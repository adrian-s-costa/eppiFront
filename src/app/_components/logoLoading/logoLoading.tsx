import Image from "next/image"

export default function LogoLoading(){

    return <>
        <div className="animate-[wiggle_1s_ease-in-out_infinite] h-screen w-screen fixed bg-white z-10 relative flex items-center justify-center">
        <Image 
        className="pb-8"
        src={'https://res.cloudinary.com/dmo7nzytn/image/upload/v1758980597/home_e%CC%81ppi_4_w2xqkb.png'}
        alt="Logo"
        width={200}
        height={80}
        priority={true}
      ></Image>
        </div>
    </>
}