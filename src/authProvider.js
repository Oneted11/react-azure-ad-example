// authProvider.js
import { MsalAuthProvider, LoginType } from "react-aad-msal";
//env variables
// const { TENANT_ID, SECRET, APP_ID } = process.env
const TENANT_ID = "f4468adf-2fb0-4f3f-aceb-0500f3a9de15";

const APP_ID = "6d4a0ad7-6519-4ff7-a1b6-8bfbb20b83bb";
// Msal Configurations
export const config = {
  auth: {
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    clientId: APP_ID,
    postLogoutRedirectUri: window.location.origin,
    redirectUri: window.location.origin,
    validateAuthority: true,
    // After being redirected to the "redirectUri" page, should user
    // be redirected back to the Url where their login originated from?
    navigateToLoginRequestUrl: true,
  },
  cache: { cacheLocation: "localStorage", storeAuthStateInCookie: true },
};
// Authentication Parameters
export const authenticationParameters = {
  scopes: [`${APP_ID}`],
};
export const authenticationParametersGraph = {
  scopes: ["openid"],
};
// Options
export const options = {
  loginType: LoginType.Redirect,
  tokenRefreshUri: window.location.origin + "/main",
};
export const authProvider = new MsalAuthProvider(
  config,
  authenticationParameters,
  options
);
