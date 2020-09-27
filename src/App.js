import React from "react";
import SignInPage from "./pages/SignInPage";
import Main from "./pages/MainPage";
import { AuthProvider } from "./contexts/AuthContext";
import Router from "./components/Router";
import { LoadPage } from "./pages/LoadPage";

function App() {
  return (
    <AuthProvider>
      <Router
        renderMain={(user) => <Main currentUser={user} />}
        renderSignIn={() => <SignInPage />}
        renderLoading={() => <LoadPage />}
      />
    </AuthProvider>
  );
}

export default App;
