import { LocaleConfig } from 'react-native-calendars';
import { useMemo } from 'react';
import Theme from '@Asset/theme';

LocaleConfig.locales.en = LocaleConfig.locales[''];
LocaleConfig.locales.fr = {
	monthNames: [
		'Janvier',
		'Février',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juillet',
		'Août',
		'Septembre',
		'Octobre',
		'Novembre',
		'Décembre',
	],
	monthNamesShort: [
		'Janv.',
		'Févr.',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juil.',
		'Août',
		'Sept.',
		'Oct.',
		'Nov.',
		'Déc.',
	],
	dayNames: [
		'Dimanche',
		'Lundi',
		'Mardi',
		'Mercredi',
		'Jeudi',
		'Vendredi',
		'Samedi',
	],
	dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
};

export const RANGE = 24;
const now = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris', day: '2-digit', month: '2-digit', year: 'numeric', hour: undefined, minute: undefined, second: undefined })
const [day, month, year] = now.split('/')
export const initialDate = `${year}-${month}-${day}`;
export const horizontalView = true
export const days = (selected: string) => {
	return {
		[selected]: {
			selected: true,
			startingDay: true,
			endingDay: true,
			color: '#334155',
			selectedTextColor: 'white'
		},
		[initialDate]: {
			startingDay: true,
			endingDay: true,
			textColor: '#00adf5'
		},
		'2023-06-16': {startingDay: true, color: '#94a3b8', textColor: 'white'},
		'2023-06-17': {endingDay: true, color: '#94a3b8', textColor: 'white'},
		'2023-06-20': {startingDay: true, endingDay: true, color: '#94a3b8', textColor: 'white'},
		'2023-06-29': {startingDay: true, color: '#22c55e', textColor: 'white'},
		'2023-06-30': {endingDay: true, color: '#22c55e', textColor: 'white'},
		'2023-07-04': {color: Theme.colors.primary, textColor: 'white', startingDay: true, endingDay: true},
		'2023-07-13': {color: Theme.colors.primary, textColor: 'white', startingDay: true},
		'2023-07-14': {color: Theme.colors.primary, textColor: 'white', endingDay: true},
		'2023-07-25': {color: Theme.colors.primary, textColor: 'white', startingDay: true},
		'2023-07-26': {color: Theme.colors.primary, textColor: 'white'},
		'2023-07-27': {color: Theme.colors.primary, textColor: 'white'},
		'2023-07-28': {color: Theme.colors.primary, textColor: 'white'},
		'2023-07-29': {color: Theme.colors.primary, textColor: 'white', endingDay: true}
	};
}

export default LocaleConfig
