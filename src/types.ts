import { TokenResult } from '@vkid/sdk'

export interface LoginResult {
  code: string;
  device_id: string;
  state?: string
}

export interface AppState {
  data: LoginResult | undefined;
  token: string | undefined;
  isLoading: boolean;
  error: string | undefined;
}

export type AuthResponse = Omit<TokenResult, 'id_token'>;

export interface ClipboardProps {
  text: string;
  onCopy?: () => void;
}