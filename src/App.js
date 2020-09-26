import React from "react";
import SignInPage from "./pages/SignInPage";
import Main from "./pages/MainPage";
import SelectCanvasPage from "./pages/SelectCanvasPage";
import { AuthProvider } from "./contexts/AuthContext";
import { CanvasProvider } from "./contexts/CanvasContext";
import Router from "./components/Router";
import { LoadPage } from "./pages/LoadPage";

function App() {
  return (
    <AuthProvider>
      <CanvasProvider>
        <Router
          renderSignIn={() => <SignInPage />}
          renderSelectCanvas={() => <SelectCanvasPage />}
          renderMain={(user) => <Main currentUser={user} />}
          renderLoading={() => <LoadPage />}
        />
      </CanvasProvider>
    </AuthProvider>
  );
}

export default App;
