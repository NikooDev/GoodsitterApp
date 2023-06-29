import { Api } from '@Config/api';
import SInfo from 'react-native-sensitive-info';

export const getCity = async (zipCode: string) => {
	try {
		const req = await fetch('https://secure.geonames.org/postalCodeSearchJSON?placename_startsWith='+zipCode+'&country=FR&lang=FR&username=nicolastual', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			}
		})

		const res = await req.json()

		return res.postalCodes
	} catch (e) {
		console.log(e);
	}
}

export const getMarkers = async (region: { latitudeNorthEast: number, longitudeNorthEast: number, latitudeSouthWest: number, longitudeSouthWest: number }) => {
	const params = region.latitudeNorthEast+'/'+region.longitudeNorthEast+'/'+region.latitudeSouthWest+'/'+region.longitudeSouthWest

	try {
		const token = await SInfo.getItem('user', {
			sharedPreferencesName: 'sharedUserToken',
			keychainService: 'keychainUserToken'
		});
		const isToken = token && {
			Authorization: 'Bearer '+token
		}

		const req = await fetch(Api+'/markers/getMarkers/'+params, {
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
