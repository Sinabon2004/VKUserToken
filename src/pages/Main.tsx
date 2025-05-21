import { useEffect, useRef, useState, type ReactElement } from 'react'
import * as VKID from '@vkid/sdk'

interface loginResult {
	code: string
	device_id: string
}


               
const APP_ID = 00000000 //your VK-ID App ID
const REDIRECT_URL = 'http://localhost'
const STATE = "lorem" // your state code
const CODE_VERIFIER = "lorem" // your code verifier

VKID.Config.init({
	app: APP_ID,
	redirectUrl: REDIRECT_URL,
	state: STATE,
	codeVerifier: CODE_VERIFIER,
	scope: 'email',
	responseMode: VKID.ConfigResponseMode.Redirect,
	mode: VKID.ConfigAuthMode.Redirect
})

const handleLogin = () => {
	VKID.Auth.login()
}

const handleExchangeCode = ({
	code,
	device_id
}: loginResult): Promise<Omit<VKID.TokenResult, 'id_token'>> => {
	return VKID.Auth.exchangeCode(code, device_id, CODE_VERIFIER)
}

export default function Main(): ReactElement {
	const [data, setData] = useState<loginResult>()
	const [token, setToken] = useState<string>()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string>()

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const code = urlParams.get('code')
		const device_id = urlParams.get('device_id')
		if (code && device_id) {
			setData({ code: code, device_id: device_id })
		}
	}, [])

	const handleGetToken = async () => {
		if (!data) return

		setIsLoading(true)
		setError(undefined)

		try {
			const result = await handleExchangeCode(data)
			console.log('Token received:', result)
			setToken(result.access_token)
		} catch (err) {
			console.error('Failed to get token:', err)
			setError(err instanceof Error ? err.message : 'Failed to get token')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<main className='flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12'>
			<div className='w-full max-w-md rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl'>
				<h1 className='mb-8 text-center text-2xl font-bold text-blue-600'>
					VK User Token
				</h1>

				<div className='space-y-6'>
					{!data ? (
						<button
							onClick={handleLogin}
							className='flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white transition-colors duration-300 hover:bg-blue-600'
						>
							<span className='mr-2'>Connect with</span>
							<span className='font-bold'>VK ID</span>
						</button>
					) : (
						<div className='space-y-6'>
							<div className='rounded-lg border border-blue-100 bg-blue-50 p-4'>
								<p className='text-sm text-blue-600'>
									Authorization code received
								</p>
								<p className='mt-1 text-xs text-gray-500'>
									Ready to exchange for access token
								</p>
							</div>

							<button
								onClick={handleGetToken}
								disabled={isLoading}
								className={`flex w-full items-center justify-center rounded-lg px-4 py-3 font-semibold transition-all duration-300 ${
									isLoading
										? 'cursor-not-allowed bg-gray-300 text-gray-500'
										: 'bg-green-500 text-white hover:bg-green-600'
								}`}
							>
								{isLoading ? (
									<>
										<svg
											className='-ml-1 mr-3 h-5 w-5 animate-spin text-white'
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'
										>
											<circle
												className='opacity-25'
												cx='12'
												cy='12'
												r='10'
												stroke='currentColor'
												strokeWidth='4'
											></circle>
											<path
												className='opacity-75'
												fill='currentColor'
												d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
											></path>
										</svg>
										Processing...
									</>
								) : (
									'Get Access Token'
								)}
							</button>
						</div>
					)}

					{token && (
						<div className='mt-6 space-y-4'>
							<h3 className='text-lg font-medium text-gray-800'>
								Your access token:
							</h3>

							<div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
								<div className='font-mono mb-2 truncate text-sm text-gray-700'>
									{token.substring(0, 16)}...{token.substring(token.length - 8)}
								</div>
								<div className='mb-3 text-xs text-gray-500'>
									Your full token is hidden for security. Use the button below
									to copy it.
								</div>

								<button
									onClick={() => {
										navigator.clipboard.writeText(token)
										alert('Token copied to clipboard!')
									}}
									className='flex w-full items-center justify-center rounded bg-blue-500 px-4 py-2 font-medium text-white transition-colors duration-300 hover:bg-blue-600'
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='mr-2 h-4 w-4'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3'
										/>
									</svg>
									Copy to Clipboard
								</button>
							</div>

							<p className='text-xs text-gray-500'>
								This token grants access to your VK account. Keep it secure and
								never share it publicly.
							</p>
						</div>
					)}

					{error && (
						<div className='mt-4 rounded border-l-4 border-red-500 bg-red-50 p-4'>
							<div className='flex'>
								<div className='flex-shrink-0'>
									<svg
										className='h-5 w-5 text-red-500'
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 20 20'
										fill='currentColor'
									>
										<path
											fillRule='evenodd'
											d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
											clipRule='evenodd'
										/>
									</svg>
								</div>
								<div className='ml-3'>
									<p className='text-sm text-red-700'>{error}</p>
								</div>
							</div>
						</div>
					)}
				</div>

				<div className='mt-8 border-t border-gray-200 pt-6 text-center'>
					<p className='text-xs text-gray-500'>
						This application securely connects to VK using OAuth 2.0.
					</p>
				</div>
			</div>
		</main>
	)
}
