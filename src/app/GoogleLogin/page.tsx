declare global {
  interface Window {
    google: any;
  }
}

export {};

import { useEffect } from "react";

export default function GoogleOneTap({ onLogin }: any) {
  useEffect(() => {
    /* Garante que a API do Google está disponível */
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "298281998851-srot2ljcl61gn4bnsja7g1850dr05v9g.apps.googleusercontent.com",
        callback: async (response: { credential: any; }) => {
          // Aqui você recebe o JWT do Google
          onLogin(response.credential);
        },
        auto_select: false,   // força mostrar escolha de conta
        cancel_on_tap_outside: false
      });

      window.google.accounts.id.prompt(); // exibe o One Tap
    }
  }, []);

  return null;
}
