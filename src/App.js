import React, { useEffect, useState } from "react";

import "./App.css";
import { UserAgentApplication } from "msal";
import { getUserDetails } from "./GraphService";
import config from "./Config";

function App() {
  const userAgentApplication = new UserAgentApplication({
    auth: {
      clientId: config.appId,
      redirectUri: config.redirectUri,
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true,
    },
  });

  const [loginState, setLoginState] = useState({
    isAuthenticated: false,
    user: {},
    error: null,
  });

  useEffect(() => {
    let user = userAgentApplication.getAccount();
    console.log("user within useEffect => ", user);
    if (user) {
      // Enhance user object with data from Graph
      getUserProfile();
    }
  }, []);

  // useeffect for diplaying state changes
  useEffect(() => {
    console.dir(loginState, { depth: null });
  }, [loginState]);

  const login = async () => {
    try {
      await userAgentApplication.loginPopup({
        scopes: config.scopes,
        prompt: "select_account",
      });
      await getUserProfile();
    } catch (err) {
      // log the error object
      console.dir(err, { depth: null });

      setLoginState({
        isAuthenticated: false,
        user: {},
        error: err,
      });
    }
  };

  const logout = () => {
    userAgentApplication.logout();
  };

  const getUserProfile = async () => {
    try {
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token

      let accessToken = await userAgentApplication.acquireTokenSilent({
        scopes: config.scopes,
      });

      if (accessToken) {
        // Get the user's profile from Graph
        var user = await getUserDetails(accessToken);
        setLoginState({
          isAuthenticated: true,
          user: {
            displayName: user.displayName,
            email: user.mail || user.userPrincipalName,
            givenName: user.givenName,
            surname: user.surname,
          },
          error: null,
        });
      }
    } catch (err) {
      console.dir(err, { depth: null });

      setLoginState({
        isAuthenticated: false,
        user: {},
        error: err,
      });
    }
  };

  return (
    <div>
      <p>Display name: {loginState.user.displayName}</p>
      <p>Mail: {loginState.user.email}</p>
      <p>First name: {loginState.user.givenName}</p>
      <p>Last name: {loginState.user.surname}</p>
      {loginState.error ? <p>loginState.error</p> : null}
      {loginState.isAuthenticated ? (
        <div>
          <h4>Welcome {loginState.user.displayName}!</h4>
          <button color="primary" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <button color="primary" onClick={login}>
          Click here to sign in
        </button>
      )}
    </div>
  );
}

export default App;
