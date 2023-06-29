import { ILogin } from '@Type/auth';
import SInfo from 'react-native-sensitive-info';
import { blobRequest, postRequest } from '@Service/fetch';
import { removeStorage } from '@Helper/storage';

export const Signup = async (formData: { name: string, data: string }[]) => {
	try {
		return await blobRequest('signup', 'POST', formData);
	} catch (e) {
		return {
			message1: e instanceof Error && e.message,
			message2: 'Veuillez réessayer ultérieurement.'
		}
	}
};

export const Login = async (datas: ILogin) => {
	try {
		const res = await postRequest('login', datas);

		if (res.authenticated) {
			await SInfo.setItem('user', res.token, {
				sharedPreferencesName: 'sharedUserToken',
				keychainService: 'keychainUserToken'
			});
		}

		return res;
	} catch (e) {
		console.log(e);
	}
};

export const Logout = async () => {
	try {
		const token = await SInfo.getItem('user', {
			sharedPreferencesName: 'sharedUserToken',
			keychainService: 'keychainUserToken'
		})

		const res = await postRequest('logout', null, token)
		await removeStorage('isAuth')

		return res.revoked
	} catch (e) {
		console.log(e)
	}
};

export const Recover = () => {

};
