
import { useEffect, useState, type ReactElement } from 'react';
import {  AppState } from './types';
import { formatTokenForDisplay } from './utils';
import { CopyButton } from 'CopyButton';
import { 
  initVKAuth, 
  loginWithVK, 
  exchangeAuthCode, 
  getAuthParamsFromURL
} from "./auth"


initVKAuth();

export default function App(): ReactElement {
  const [state, setState] = useState<AppState>({
    data: undefined,
    token: undefined,
    isLoading: false,
    error: undefined
  });

  useEffect(() => {
    const authParams = getAuthParamsFromURL();
    if (authParams) {
      setState(prev => ({ ...prev, data: authParams }));
    }
  }, []);

  const handleGetToken = async (): Promise<void> => {
    if (!state.data) return;

    setState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const result = await exchangeAuthCode(state.data);
      console.log('Token received:', result);
      setState(prev => ({ 
        ...prev, 
        token: result.access_token,
        isLoading: false
      }));
    } catch (err) {
      console.error('Failed to get token:', err);
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err.message : 'Failed to get token',
        isLoading: false
      }));
    }
  };

  const { data, token, isLoading, error } = state;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
        <h1 className="mb-8 text-center text-2xl font-bold text-blue-600">
          VK User Token
        </h1>

        <div className="space-y-6">
          {!data ? (
            <button
              onClick={loginWithVK}
              className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white transition-colors duration-300 hover:bg-blue-600"
            >
              <span className="mr-2">Connect with</span>
              <span className="font-bold">VK ID</span>
            </button>
          ) : (
            <div className="space-y-6">
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm text-blue-600">
                  Authorization code received
                </p>
                <p className="mt-1 text-xs text-gray-500">
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
                      className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Your access token:
              </h3>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 truncate font-mono text-sm text-gray-700">
                  {formatTokenForDisplay(token)}
                </div>
                <div className="mb-3 text-xs text-gray-500">
                  Your full token is hidden for security. Use the button below
                  to copy it.
                </div>

                <CopyButton text={token} />
              </div>

              <p className="text-xs text-gray-500">
                This token grants access to your VK account. Keep it secure and
                never share it publicly.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded border-l-4 border-red-500 bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center">
          <p className="text-xs text-gray-500">
            This application securely connects to VK using OAuth 2.0.
          </p>
        </div>
      </div>
    </main>
  );
}