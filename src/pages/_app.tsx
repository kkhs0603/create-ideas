import React, { useEffect } from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { AuthProvider } from "../contexts/AuthContext";
import { CanvasProvider } from "../contexts/CanvasContext";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../../theme";
import CssBaseline from "@material-ui/core/CssBaseline";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Create Ideas</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <AuthProvider>
          <CanvasProvider>
            <Component {...pageProps} />
          </CanvasProvider>
        </AuthProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}
