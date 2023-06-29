import { postRequest } from '@Service/fetch';
import SInfo from 'react-native-sensitive-info';

export const createRoom = async (user_id: string, petsitter_id: string) => {
	const token = await SInfo.getItem('user', {
		sharedPreferencesName: 'sharedUserToken',
		keychainService: 'keychainUserToken'
	});

	try {
		return await postRequest('messages/room/create', {user_id, petsitter_id}, token)
	} catch (e) {
		console.log(e);
	}
}
