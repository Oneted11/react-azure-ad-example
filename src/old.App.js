import logo from "./logo.svg";
import { useState, useEffect } from "react";
import "./App.css";
import { AzureAD } from "react-aad-msal";
import { authProvider } from "./authProvider";
import Main from "./Main";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";

const Login = ({ info }) => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {/* <button onClick={loginCallback}>Login</button> */}
        {info}
      </header>
    </div>
  );
};
const MainRouter = () => {
  const [userInfo, setUserInfo] = useState();

  const loginCallback = (login) => {
    console.log("login button clicked");
    return (
      <button
        onClick={() => {
          login();
        }}
      >
        Login with Microsoft
      </button>
    );
  };
  const logoutCallback = (logout) => {
    return (
      <button
        onClick={() => {
          logout();
          setUserInfo(null);
        }}
      >
        Logout
      </button>
    );
  };
  return (
    <AzureAD
      provider={authProvider}
      unauthenticatedFunction={loginCallback}
      userInfoCallback={(info) => setUserInfo(info)}
      authenticatedFunction={logoutCallback}
    >
      <Router>
        <Switch>
          <Route path="/">
            <Login info={userInfo} />
          </Route>
          <Route path="/main">
            <Main />
          </Route>
        </Switch>
      </Router>
    </AzureAD>
  );
};
const LoginPage = () => {
  const History = useHistory();
  return (
    <div style={{ display: "block" }}>
      <button
        style={{ top: "50%" }}
        onClick={() => {
          History.push("/admin");
        }}
      >
        Login with Microsoft
      </button>
    </div>
  );
};
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LoginPage />
        </Route>
        <Route path="/admin">
          <MainRouter />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
