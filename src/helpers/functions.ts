import ReactNativeHapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback'
import { DateTime } from 'luxon';
import { Alert } from 'react-native';
import { IGeolocCity } from '@Type/auth';
import { RoleEnum } from '@Type/profile';
import { INavigateRoom, IRoom } from '@Type/chat';
import { IUser } from '@Type/users';

String.prototype.cap = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

export const cap = (str: string) => {
	return str.replace(str[0], str[0].toUpperCase())
}

export const haptic = (type: string | HapticFeedbackTypes) => {
	return ReactNativeHapticFeedback.trigger(type, {
		enableVibrateFallback: true,
		ignoreAndroidSystemSettings: false
	})
}

export const dateFormat = (date: string, locale: string = 'fr') => {
	const fullDatetime = DateTime.fromISO(date);

	return fullDatetime.setLocale(locale.substring(0, 2)).toLocaleString(DateTime.DATE_FULL);
}

export const phoneFormat = (separator: string, data: string) => {
	const e = new RegExp('(..)(..)(..)(..)(..)', 'g');
	return data.replace(e, '$1'+separator+'$2'+separator+'$3'+separator+'$4'+separator+'$5');
}

export const alertServerError = (onPress1?: () => void, onPress2?: () => void) => {
	return Alert.alert('Une erreur est survenue', 'L\'équipe de maintenance corrige actuellement le problème.\n\nExcusez-nous pour la gêne occasionnée.', [
		{ text: 'Voir l\'état du serveur', onPress: onPress1 }, { text: 'OK', style: 'cancel', onPress: onPress2 }
	])
}

export const filterAlphabeticCity = (suggestionsCity: IGeolocCity[]) => {
	return suggestionsCity.sort((a, b) => {
		const cityA = a.placeName.toUpperCase();
		const cityB = b.placeName.toUpperCase();

		return cityA.localeCompare(cityB, 'fr', { sensitivity: 'base' });
	});
}

export const randomLatLng = (latitude: number, longitude: number, radius = 0.5) => {
	const degreesToRadians = (degrees: number) => {
		return degrees * (Math.PI / 180);
	};

	const radiansToDegrees = (radians: number) => {
		return radians * (180 / Math.PI);
	};

	const latRad = degreesToRadians(latitude);
	const lonRad = degreesToRadians(longitude);

	const earthRadius = 6371;
	const latDegrees = radius / earthRadius;
	const lonDegrees = radius / (earthRadius * Math.cos(latRad));

	const randomLat = Math.random() * 2 * latDegrees - latDegrees;
	const randomLon = Math.random() * 2 * lonDegrees - lonDegrees;

	const newLat = radiansToDegrees(latRad + randomLat);
	const newLon = radiansToDegrees(lonRad + randomLon);

	return {
		newLat,
		newLon
	}
}

export const formatUsersChat = (users: INavigateRoom, toSearchProfile: boolean) => {
	const isPetowner = users.current_user.profile.role == RoleEnum.PETOWNER

	let {
		from_firstname, from_name, to_firstname, to_name, navigation, current_user, last_message, created_at,
		...rest
	} = users

	const headerParam = {
		headerTitle: isPetowner ? users.to_firstname.cap()+' '+users.to_name.cap() : users.from_firstname.cap()+' '+users.from_name.cap(),
		avatar: isPetowner ? users.to_avatar_url : users.from_avatar_url
	}
	const invertedUser = users.current_user.profile.role == RoleEnum.PETOWNER
	const filterUsers = {
		...rest,
		to_id: invertedUser ? users.to_id : users.from_id
	}

	const room = {
		petowner: users.from_id,
		petsitter: users.to_id
	}
	const startChat = {
		...filterUsers,
		room,
		from_id: toSearchProfile ? users.from_id : users.current_user.id,
		to_id: filterUsers.to_id
	}

	return {
		headerParam, startChat
	}
}
