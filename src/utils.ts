export const generateRandomString = (length: number): string => {
	const charset =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
	let result = ''
	for (let index = 0; index < length; index += 1) {
		result += charset.charAt(Math.floor(Math.random() * charset.length))
	}
	return result
}

export const formatTokenForDisplay = (token: string): string => {
	if (!token) return ''
	return `${token.slice(0, 16)}...${token.slice(Math.max(0, token.length - 8))}`
}
