import React from "react";
import SignInPage from "./pages/SignInPage";
import CanvasListPage from "./pages/CanvasListPage";
import UserSettingsPage from "./pages/UserSettingsPage";
import CanvasPage from "./pages/CanvasPage";
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
              <Route exact path="/canvas-list" component={CanvasListPage} />
              <Route exact path="/settings" component={UserSettingsPage} />
              <Route exact path="/canvas" component={CanvasPage} />
            </AuthRouter>
          </Switch>
        </CanvasProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
