import React from "react";
import SignInPage from "./pages/SignInPage";
import CanvasesPage from "./pages/CanvasesPage";
import UserSettingsPage from "./pages/UserSettingsPage";
import { AuthProvider } from "./contexts/AuthContext";
import { CanvasProvider } from "./contexts/CanvasContext";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthRouter from "./AuthRouter";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CanvasProvider>
          <Switch>
            <Route exact path="/" component={SignInPage} />
            <AuthRouter>
              <Route exact path="/canvases" component={CanvasesPage} />
              <Route exact path="/settings" component={UserSettingsPage} />
              <Redirect from="/" to="/canvases" />
            </AuthRouter>
          </Switch>
        </CanvasProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
