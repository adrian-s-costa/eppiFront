"use client"

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { LuAirplay } from "react-icons/lu";
import { IoPersonOutline, IoPerson } from "react-icons/io5";
import { RiHome5Fill, RiHome5Line, RiGraduationCapFill, RiGraduationCapLine } from "react-icons/ri";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { PiAirplayFill } from "react-icons/pi";
import LogoLoading from "../_components/logoLoading/logoLoading";
import { ThemeContextProvider } from "@telefonica/mistica";
import { theme } from "@/style/theme";
import { DockDemo } from "../_components/dock/dock";
import { config } from "../../../config";
import { AnimatePresence, motion } from "framer-motion";
import { sentNotificationByLocation } from "../../../utils/api/service";

// Carregamento dinâmico dos componentes
const Home = dynamic(() => import("../home/page"), { ssr: false });
const Streaming = dynamic(() => import("../streaming/page"), { ssr: false });
const CoursesLandpage = dynamic(() => import("../coursesLanding/page"), { ssr: false });
const Profile = dynamic(() => import("../profile/page"), { ssr: false });
const Alloyal = dynamic(() => import("../alloyal/page"), { ssr: false });

export default function HomeTab() {
  const searchParams = useSearchParams();
  const options = searchParams.get("options");
  const [muted, setMuted] = useState<boolean | null>(null);
  const [logo, setLogo] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [prevIndex, setPrevIndex] = useState<number>(0);
  const [coor, setCoord] = useState<{lat: number, long: number} | null>(null);
  // const [userId, setUserId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("id"));
    }
  }, []);

  useEffect(() => {
    const storedPage = typeof window !== "undefined" ? localStorage.getItem("page") : "0";
    setTabIndex(Number(storedPage));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const { hash, origin, pathname, search } = window.location;
    if (!hash || !hash.includes("access_token")) return;

    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    if (!accessToken) return;

    const handleGoogleCallback = async () => {
      try {
        const response = await fetch(`${config.API_URL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: accessToken, register: true }),
        });

        if (!response.ok) {
          console.error("Failed to complete Google login callback");
          return;
        }

        const userData = await response.json();

        localStorage.setItem("user", userData.account.name);
        localStorage.setItem("token", userData.token);
        localStorage.setItem("id", userData.account.id);
        localStorage.setItem("email", userData.account.email);
        localStorage.setItem("number", userData.account.cellphone);
        localStorage.setItem("cep", userData.account.cep);
        localStorage.setItem("pfpUrl", userData.account.pfpUrl);
        localStorage.setItem("cpf", userData.account.initials);

        // Limpa o hash para evitar repetir o fluxo ao recarregar
        const cleanUrl = `${origin}${pathname}${search}`;
        window.history.replaceState(null, "", cleanUrl);
      } catch (error) {
        console.error("Error handling Google callback:", error);
      }
    };

    handleGoogleCallback();
  }, []);

  const handleTabsChange = (index: number) => {
    localStorage.setItem("page", index.toString());
    setPrevIndex(tabIndex);
    setTabIndex(index);
    setMuted(true);
    if (index === 1) {
      setLogo(true);
      setTimeout(() => {
        setLogo(false);
      }, 1500);
    }
  };

  const direction = tabIndex - prevIndex;

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     setUserId(localStorage.getItem("id"));
  //   }
  // }, []);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCoord({
          lat: position.coords.latitude,
          long: position.coords.longitude
        });
      },
      (error) => console.error(error),
      {
        enableHighAccuracy: false,
        maximumAge: 10000,
        timeout: 10000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);


  const lastCoordRef = useRef<{lat:number,long:number} | null>(null);

  useEffect(() => {
    if (!userId || !coor) return;

    if (lastCoordRef.current) {
      const moved =
        Math.abs(lastCoordRef.current.lat - coor.lat) > 0.0003 ||
        Math.abs(lastCoordRef.current.long - coor.long) > 0.0003;

      if (!moved) return;
    }

    lastCoordRef.current = coor;
    sentNotificationByLocation(userId, coor);
  }, [coor, userId]);

          
  const renderPanel = () => {
    if (tabIndex === 0) return <Home setTabIndex={setTabIndex} muted={muted} />;
    if (tabIndex === 1) return (
      <div className="min-h-screen">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={logo ? 'logo' : 'stream'}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {logo ? <LogoLoading /> : <Streaming setTabIndex={setTabIndex} />}
          </motion.div>
        </AnimatePresence>
      </div>
    );
    if (tabIndex === 2) return <CoursesLandpage />;
    if (tabIndex === 3) return <Profile />;
    return <Alloyal setTabIndex={setTabIndex}/>;
  };

  return (
    <ThemeContextProvider theme={theme}>
      <Tabs index={tabIndex} onChange={handleTabsChange} className="relative">
        <div className="min-h-screen">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`tab-${tabIndex}`}
              initial={{ opacity: 0, x: direction >= 0 ? 40 : -40, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction >= 0 ? -40 : 40, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {renderPanel()}
            </motion.div>
          </AnimatePresence>
        </div>

        <DockDemo tabIndex={tabIndex}/>
      </Tabs>
    </ThemeContextProvider>
  );
}