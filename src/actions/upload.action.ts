import { blobRequest } from '@Service/fetch';

export const setCoverAvatar = async (formData: { name: string, data: string, filename: string, type: string }[]) => {
	try {
		return await blobRequest('user/set', 'PATCH', formData)
	} catch (e) {
		return {
			message1: e instanceof Error && e.message,
			message2: 'Veuillez réessayer ultérieurement.'
		}
	}
}
