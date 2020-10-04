import React from "react";
import SignInPage from "./pages/SignInPage";
import SelectCanvasPage from "./pages/SelectCanvasPage";
import UserSettingsPage from "./pages/UserSettingsPage";
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
          renderLoading={() => <LoadPage />}
          renderUserSettings={() => <UserSettingsPage />}
        />
      </CanvasProvider>
    </AuthProvider>
  );
}

export default App;
