import { blobRequest } from '@Service/fetch';
import SInfo from 'react-native-sensitive-info';
import { Api } from '@Config/api';
import { RoleEnum } from '@Type/profile';

export const createPetsitter = async (formData: { name: string, data: string }[]) => {
	try {
		return await blobRequest('petsitter/create', 'POST', formData);
	} catch (e) {
		console.log(e);
		return {
			message1: e instanceof Error && e.message,
			message2: 'Veuillez réessayer ultérieurement.'
		}
	}
}

export const getPetsitter = async (petsitter_id: string) => {
	try {
		const token = await SInfo.getItem('user', {
			sharedPreferencesName: 'sharedUserToken',
			keychainService: 'keychainUserToken'
		});
		const isToken = token && {
			Authorization: 'Bearer '+token
		}

		const req = await fetch(Api+'/petsitter/get/'+petsitter_id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				...isToken
			}
		})

		return await req.json()
	} catch (e) {
		console.log(e);
	}
}

export const getMarkersProfile = async (user_id: string, role: RoleEnum) => {
	const params = user_id+'/'+role

	try {
		const token = await SInfo.getItem('user', {
			sharedPreferencesName: 'sharedUserToken',
			keychainService: 'keychainUserToken'
		});
		const isToken = token && {
			Authorization: 'Bearer '+token
		}

		const req = await fetch(Api+'/markers/getMarkersProfile/'+params, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				...isToken
			}
		})

		return await req.json()
	} catch (e) {
		console.log(e);
	}
}
