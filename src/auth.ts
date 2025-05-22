import * as VKID from '@vkid/sdk'
import { APP_ID, REDIRECT_URL } from 'environment'
import type { AuthResponse, LoginResult } from 'types'
import { generateRandomString } from 'utils'

export const STATE = generateRandomString(16)
export const CODE_VERIFIER = generateRandomString(43)

export const initVKAuth = (): void => {
	VKID.Config.init({
		app: APP_ID,
		redirectUrl: REDIRECT_URL,
		state: STATE,
		// codeVerifier: CODE_VERIFIER,
		scope: 'email',
		responseMode: VKID.ConfigResponseMode.Redirect,
		mode: VKID.ConfigAuthMode.Redirect
	})
}

export const loginWithVK = (): void => {
	void VKID.Auth.login()
}

export const exchangeAuthCode = async (
	loginData: LoginResult
): Promise<AuthResponse> => 
	// console.log(CODE_VERIFIER)
	 VKID.Auth.exchangeCode(
		loginData.code,
		loginData.deviceId,
		// loginData.state
		// CODE_VERIFIER
	)


export const getAuthParametersFromURL = (): LoginResult | undefined => {
	const urlParameters = new URLSearchParams(window.location.search)
	const code = urlParameters.get('code')
	const deviceId = urlParameters.get('device_id')
	const state = urlParameters.get('state')

	if (code && deviceId && state) {
		return { code, deviceId, state }
	}

	return undefined
}
