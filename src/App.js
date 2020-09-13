import React from "react";
import Login from "./pages/LoginPage";
import Main from "./pages/MainPage";
import { AuthProvider } from "./contexts/Auth";
import Router from "./components/Router";
import { LoadPage } from "./pages/LoadPage";

function App() {
  return (
    <AuthProvider>
      <Router
        renderMain={(user) => <Main currentUser={user} />}
        renderLogin={() => <Login />}
        renderLoading={() => <LoadPage />}
      />
    </AuthProvider>
  );
}

export default App;
