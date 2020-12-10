import React, { useEffect } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { CanvasProvider } from "../contexts/CanvasContext";

const App = ({ Component, pageProps }) => {
  return (
    <AuthProvider>
      <CanvasProvider>
        <Component {...pageProps} />
      </CanvasProvider>
    </AuthProvider>
  );
};

export default App;
