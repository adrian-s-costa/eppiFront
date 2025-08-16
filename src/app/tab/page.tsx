"use client"

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { LuAirplay } from "react-icons/lu";
import { IoPersonOutline, IoPerson } from "react-icons/io5";
import { RiHome5Fill, RiHome5Line, RiGraduationCapFill, RiGraduationCapLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { PiAirplayFill } from "react-icons/pi";
import LogoLoading from "../_components/logoLoading/logoLoading";
import { ThemeContextProvider } from "@telefonica/mistica";
import { theme } from "@/style/theme";
import { DockDemo } from "../_components/dock/dock";

// Carregamento dinâmico dos componentes
const Home = dynamic(() => import("../home/page"), { ssr: false });
const Streaming = dynamic(() => import("../streaming/page"), { ssr: false });
const CoursesLandpage = dynamic(() => import("../coursesLanding/page"), { ssr: false });
const Profile = dynamic(() => import("../profile/page"), { ssr: false });

export default function HomeTab() {
  const searchParams = useSearchParams();
  const options = searchParams.get("options");
  const [muted, setMuted] = useState<boolean | null>(null);
  const [logo, setLogo] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useState<number>(0);

  useEffect(() => {
    const storedPage = typeof window !== "undefined" ? localStorage.getItem("page") : "0";
    setTabIndex(Number(storedPage));
  }, []);

  const handleTabsChange = (index: number) => {
    localStorage.setItem("page", index.toString());
    setTabIndex(index);
    setMuted(true);
    if (index === 1) {
      setLogo(true);
      setTimeout(() => {
        setLogo(false);
      }, 1500);
    }
  };

  return (
    <ThemeContextProvider theme={theme}>
      <Tabs index={tabIndex} onChange={handleTabsChange} className="relative">
        <TabPanels>
          <TabPanel>
            <Home setTabIndex={setTabIndex} muted={muted} />
          </TabPanel>
          <TabPanel>
            {logo ? <LogoLoading /> : <Streaming setTabIndex={setTabIndex} />}
          </TabPanel>
          <TabPanel>
            <CoursesLandpage />
          </TabPanel>
          <TabPanel>
            <Profile />
          </TabPanel>
        </TabPanels>

        <DockDemo tabIndex={tabIndex}/>
      </Tabs>
    </ThemeContextProvider>
  );
}