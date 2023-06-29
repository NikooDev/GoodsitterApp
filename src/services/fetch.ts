import { Api } from '@Config/api';
import { IMethods } from '@Type/app';
import RNFetchBlob from 'react-native-blob-util';
import SInfo from 'react-native-sensitive-info';

export const postRequest = async (url: string, data: {} | null, token?: string) => {
	let header = {}

	if (token && token.length !== 0) {
		header = {
			'Authorization': 'Bearer ' + token,
		}
	}

	try {
		const req = await fetch(Api+'/'+url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				...header
			},
			body: data ? JSON.stringify(data) : null
		})

		return await req.json()
	} catch {
		return {
			error: 0
		}
	}
}

export const blobRequest = async (url: string, method: IMethods, formData: any[]) => {
	const token = await SInfo.getItem('user', {
		sharedPreferencesName: 'sharedUserToken',
		keychainService: 'keychainUserToken'
	});

	const isToken = token && {
		Authorization: 'Bearer '+token
	}

	try {
		const req = await RNFetchBlob.fetch(method, Api+'/'+url, {
			'Cache-Control' : 'no-store',
			'Content-Type': 'multipart/form-data',
			...isToken
		}, formData)

		return await req.json()
	} catch (e) {
		return {
			message1: e instanceof Error && e.message,
			message2: 'Veuillez réessayer ultérieurement.'
		}
	}
}
