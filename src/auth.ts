import * as VKID from '@vkid/sdk';
import { APP_ID, REDIRECT_URL } from 'env'
import { AuthResponse, LoginResult } from 'types'
import { generateRandomString } from 'utils'





export const STATE = generateRandomString(16);
export const CODE_VERIFIER = generateRandomString(43);


export const initVKAuth = (): void => {
  VKID.Config.init({
    app: APP_ID,
    redirectUrl: REDIRECT_URL,
    state: STATE,
    codeVerifier: CODE_VERIFIER,
    scope: "email",
    responseMode: VKID.ConfigResponseMode.Redirect,
    mode: VKID.ConfigAuthMode.Redirect
  });
};

export const loginWithVK = (): void => {
  VKID.Auth.login();
};

export const exchangeAuthCode = async (loginData: LoginResult): Promise<AuthResponse> => {
  console.log(CODE_VERIFIER)
  return VKID.Auth.exchangeCode(
    loginData.code,
    loginData.device_id,
    // CODE_VERIFIER
  );
};

export const getAuthParamsFromURL = (): LoginResult | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const device_id = urlParams.get('device_id');
  const state = urlParams.get('state');
  
  if (code && device_id && state) {
    return { code, device_id, state };
  }
  
  return undefined;
};