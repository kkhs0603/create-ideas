import React from "react";
import Top from "./pages/TopPage";
import Main from "./pages/MainPage";
import { AuthProvider } from "./contexts/Auth";
import Router from "./components/Router";
import { LoadPage } from "./pages/LoadPage";

function App() {
  return (
    <AuthProvider>
      <Router
        renderMain={(user) => <Main currentUser={user} />}
        renderLogin={() => <Top />}
        renderLoading={() => <LoadPage />}
      />
    </AuthProvider>
  );
}

export default App;
