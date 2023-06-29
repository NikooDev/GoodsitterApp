import { postRequest } from '@Service/fetch';
import SInfo from 'react-native-sensitive-info';

export const deleteUser = async (user_id: string) => {
	const token = await SInfo.getItem('user', {
		sharedPreferencesName: 'sharedUserToken',
		keychainService: 'keychainUserToken'
	});

	try {
		return await postRequest('user/delete', { user_id }, token)
	} catch (e) {
		console.log(e);
	}
}
