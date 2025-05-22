export const generateRandomString = (length: number) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return result
}


export const formatTokenForDisplay = (token: string): string => {
  if (!token) return '';
  return `${token.substring(0, 16)}...${token.substring(token.length - 8)}`;
};