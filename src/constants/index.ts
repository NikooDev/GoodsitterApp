import { TypeAnimal } from '@Type/petsitter';

export const serviceContent = (service: string) => {
	let content = ''

	switch (service) {
		case 'hébergement':
			content = 'Votre animal restera avec le gardien durant la journée et la nuit'
			break
		case 'promenade':
			content = 'Une belle promenade autour de votre quartier'
			break
		case 'garderie':
			content = 'Votre animal restera avec le pet-sitter durant la journée'
			break
		case 'garderie à domicile':
			content = 'Votre animal sera chez vous avec son pet-sitter pendant la journée'
			break
		case 'visite':
			content = 'Votre pet-sitter rendra visite à vos animaux chez vous'
			break
		default:
			break
	}

	return content
}

export const petsitterHomeType = (home_type: string, other_home_type: string | undefined) => {
	let content = ''

	switch (home_type) {
		case 'house':
			content = 'Maison'
			break
		case 'apartment':
			content = 'Appartement'
			break
		case 'other':
			if (other_home_type) {
				content = other_home_type
			}
			break
		default:
			break
	}

	return content
}

export const petsitterGardenType = (garden_type: string) => {
	let content = ''

	switch (garden_type) {
		case 'closed':
			content = 'Clôturé'
			break
		case 'open':
			content = 'Ouvert'
			break
		case 'not_garden':
			content = 'Pas de jardin'
			break
		default:
			break
	}

	return content
}

export const petsitterAnimalTypes = (animals_type: any) => {
	let content = ''

	switch (animals_type) {
		case TypeAnimal.PETIT.toString():
			content = 'Petit chien (0 à 7 kg)'
			break
		case TypeAnimal.MOYEN.toString():
			content = 'Chien moyen (7 à 18 kg)'
			break
		case TypeAnimal.GRAND.toString():
			content = 'Grand chien (18 à 45 kg)'
			break
		case TypeAnimal.TRES_GRAND.toString():
			content = 'Très grand chien (+45 kg)'
			break
		case TypeAnimal.CHAT.toString():
			content = 'Chat'
			break
		default:
			break
	}

	return content
}
