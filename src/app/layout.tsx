  import type { Metadata, Viewport } from "next";
  import { Inter, Montserrat } from "next/font/google";
  import "./globals.css";
  import Pwa from "@/components/ui/ServiceWorkerRegister";
  import { ThemeContextProvider } from '@telefonica/mistica';
  import { theme } from "../style/theme"
  import { GoogleOAuthProvider } from '@react-oauth/google';

  const inter = Inter({ subsets: ["latin"] });
  const mont = Montserrat({ subsets: ["latin"] });
  const APP_NAME = "Grupo Fera";
  const APP_DEFAULT_TITLE = "Grupo Fera";
  const APP_TITLE_TEMPLATE = "%s - Grupo Fera";
  const APP_DESCRIPTION = "Descrição";

  export const metadata: Metadata = {
    applicationName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: APP_DEFAULT_TITLE,
      // startUpImage: [],
    },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      type: "website",
      siteName: APP_NAME,
      title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
      },
      description: APP_DESCRIPTION,
    },
    twitter: {
      card: "summary",
      title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
      },
      description: APP_DESCRIPTION,
    },
  };

  export const viewport: Viewport = {
    themeColor: "#ffffff",
    width: 'device-width',
    initialScale: 1.0,
    maximumScale: 1.0,
    userScalable: false
  };


  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="pt-br" className="touch-pan-y">
        <ThemeContextProvider theme={theme}>
        <GoogleOAuthProvider clientId="298281998851-srot2ljcl61gn4bnsja7g1850dr05v9g.apps.googleusercontent.com">
          <body className={inter.className}>{children}
            <script src="https://sdk.mercadopago.com/js/v2" async/>
            <script src="https://player.pandavideo.com.br/api.v2.js" async />
            <script src="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1" async />
            <meta name="apple-mobile-web-app-capable" content="yes"/>
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
            <link rel="apple-touch-icon" href="/icons/icon-192.png"></link>
            <Pwa />
          </body>
        </GoogleOAuthProvider>
        </ThemeContextProvider>
      </html>
    );
  }
