import {
	fetchBaseQuery,
	FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import RNSInfo from 'react-native-sensitive-info';

export function isFetchBaseQueryError(
	error: unknown
): error is FetchBaseQueryError {
	return typeof error === 'object' && error != null && 'status' in error
}

/**
 * Api
 * Mode développement
 * Ip du réseau local de l'ordinateur + port serveur
 *
 * Mode production
 * Remplacer l'ip locale par l'url du serveurs
 */
export const Api = 'http://192.168.1.134:3333'

export const baseQuery = fetchBaseQuery({
	baseUrl: Api,
	timeout: 10000,
	prepareHeaders: async (headers) => {
		const token = await RNSInfo.getItem('user', {
			sharedPreferencesName: 'sharedUserToken',
			keychainService: 'keychainUserToken'
		});

		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}

		return headers;
	}
});
