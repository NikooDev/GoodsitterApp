import { IPetsitter, TypeHome } from '@Type/petsitter';

const petsitterValidator = async (petsitter: IPetsitter) => {

	// Adresse complète
	if (!petsitter.address.number_street || !petsitter.address.street_name || !petsitter.address.zip || !petsitter.address.city) {
		return {
			field: 'address',
			message: 'Votre adresse complète est requise',
			validated: false
		}
	}

	// Email valide
	if (petsitter.email && !petsitter.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
		return {
			field: 'email',
			message: 'Votre adresse e-mail n\'est pas valide',
			validated: false
		}
	}

	// Numéro de téléphone
	if (!petsitter.phone) {
		return {
			field: 'phone',
			page: '4',
			scroll: '450',
			message: 'Votre numéro de téléphone est requis',
			validated: false
		}
	} else if (!petsitter.phone.match(/^(0)[1-9]\d{8}$/)) {
		return {
			field: 'phone',
			page: '4',
			scroll: '450',
			message: 'Votre numéro de téléphone n\'est pas valide',
			validated: false
		}
	}

	// Expériences
	if (!petsitter.number_experiences) {
		return {
			field: 'number_experiences',
			page: '3',
			scroll: undefined,
			message: 'Vous devez renseigner vos années d\'expériences',
			validated: false
		}
	}
	if (!petsitter.title) {
		return {
			field: 'title',
			page: '3',
			scroll: undefined,
			message: 'Veuillez renseigner un titre',
			validated: false
		}
	} else if (petsitter.title.length > 50) {
		return {
			field: 'title',
			page: '3',
			scroll: undefined,
			message: 'Votre titre doit comporter 50 caractères maximum',
			validated: false
		}
	}
	if (!petsitter.description) {
		return {
			field: 'description',
			page: '3',
			scroll: undefined,
			message: 'Veuillez ajouter une description',
			validated: false
		}
	} else if (petsitter.description.length > 0) {
		const text = petsitter.description.trim();
		const words = text.split(/\s+/);

		if (words.length < 30) {
			return {
				field: 'description',
				page: '3',
				scroll: undefined,
				message: 'Écrivez au moins 30 mots pour vous présenter',
				validated: false
			}
		}
	}

	// Photos
	if (petsitter.photos && petsitter.photos.length < 3) {
		return {
			field: 'photos',
			page: '2',
			scroll: undefined,
			message: 'Ajouter entre 3 et 8 photos de vous avec vos animaux',
			validated: false
		}
	}

	// Services
	if (
		!petsitter.services.lodging.enable &&
		!petsitter.services.daycare.enable &&
		!petsitter.services.home_daycare.enable &&
		!petsitter.services.walk.enable &&
		!petsitter.services.visit.enable) {
		return {
			field: 'services',
			page: '1',
			scroll: undefined,
			message: 'Ajouter au moins un service',
			validated: false
		}
	}
	/**
	 * Vérifier pour chaque service, si le ou les tarifs sont bien inscrits.
	 * Continuer la validation des options si activé, le jour[] existe au moins un, type_animal[] existe au moins un,
	 * toggle home_type, toggle_garden + garden_custom
	 */
	if (petsitter.services.lodging.enable) {
		if (!petsitter.services.lodging.price) {
			return {
				field: 'lodging.price',
				page: '1',
				scroll: undefined,
				title: 'Hébergement à domicile',
				message: 'Vous devez ajouter un tarif compris entre 10 et 150€',
				validated: false
			}
		} else if (petsitter.services.lodging.price && (Number(petsitter.services.lodging.price) < 10 || Number(petsitter.services.lodging.price) > 150)) {
			return {
				field: 'lodging.price',
				page: '1',
				scroll: undefined,
				title: 'Hébergement à domicile',
				message: 'Le tarif par nuit doit être compris entre 10 et 150€',
				validated: false
			}
		}
		if (petsitter.services.lodging.price_additional_animal  && Number(petsitter.services.lodging.price_additional_animal) > 150) {
			return {
				field: 'lodging.price_additional_animal',
				page: '1',
				scroll: undefined,
				title: 'Hébergement à domicile',
				message: 'Le tarif par nuit ne doit pas dépasser 150€',
				validated: false
			}
		}
	}
	if (petsitter.services.daycare.enable) {
		if (!petsitter.services.daycare.price) {
			return {
				field: 'daycare.price',
				page: '1',
				scroll: undefined,
				title: 'Garderie',
				message: 'Vous devez ajouter un tarif compris entre 10 et 150€',
				validated: false
			}
		} else if (petsitter.services.daycare.price && (Number(petsitter.services.daycare.price) < 10 || Number(petsitter.services.daycare.price) > 150)) {
			return {
				field: 'daycare.price',
				page: '1',
				scroll: undefined,
				title: 'Garderie',
				message: 'Le tarif par jour doit être compris entre 10 et 150€',
				validated: false
			}
		}
		if (petsitter.services.daycare.price_additional_animal  && Number(petsitter.services.daycare.price_additional_animal) > 150) {
			return {
				field: 'daycare.price_additional_animal',
				page: '1',
				scroll: undefined,
				title: 'Garderie',
				message: 'Le tarif par jour ne doit pas dépasser 150€',
				validated: false
			}
		}
	}

	if (petsitter.services.home_daycare.enable) {
		if (!petsitter.services.home_daycare.price) {
			return {
				field: 'home_daycare.price',
				page: '1',
				scroll: undefined,
				title: 'Garderie à domicile',
				message: 'Vous devez ajouter un tarif compris entre 10 et 150€',
				validated: false
			}
		} else if (petsitter.services.home_daycare.price && (Number(petsitter.services.home_daycare.price) < 10 || Number(petsitter.services.home_daycare.price) > 150)) {
			return {
				field: 'home_daycare.price',
				page: '1',
				scroll: undefined,
				title: 'Garderie à domicile',
				message: 'Le tarif par 24h doit être compris entre 10 et 150€',
				validated: false
			}
		}
	}

	if (petsitter.services.walk.enable) {
		if (!petsitter.services.walk.price) {
			return {
				field: 'walk.price',
				page: '1',
				scroll: undefined,
				title: 'Promenade',
				message: 'Vous devez ajouter un tarif compris entre 5 et 150€',
				validated: false
			}
		} else if (petsitter.services.walk.price && (Number(petsitter.services.walk.price) < 5 || Number(petsitter.services.walk.price) > 150)) {
			return {
				field: 'walk.price',
				page: '1',
				scroll: undefined,
				title: 'Promenade',
				message: 'Le tarif doit être compris entre 5 et 150€',
				validated: false
			}
		}
		if (petsitter.services.walk.price_additional_animal  && Number(petsitter.services.walk.price_additional_animal) > 150) {
			return {
				field: 'walk.price_additional_animal',
				page: '1',
				scroll: undefined,
				title: 'Promenade',
				message: 'Le tarif ne doit pas dépasser 150€',
				validated: false
			}
		}
	}

	if (petsitter.services.visit.enable) {
		if (!petsitter.services.visit.price) {
			return {
				field: 'visit.price',
				page: '1',
				scroll: undefined,
				title: 'Visite',
				message: 'Vous devez ajouter un tarif compris entre 10 et 150€',
				validated: false
			}
		} else if (petsitter.services.visit.price && (Number(petsitter.services.visit.price) < 10 || Number(petsitter.services.visit.price) > 150)) {
			return {
				field: 'visit.price',
				page: '1',
				scroll: undefined,
				title: 'Visite',
				message: 'Le tarif doit être compris entre 10 et 150€',
				validated: false
			}
		}
	}

	// Disponibilité
	if (
		!petsitter.weekdays.lun.enable &&
		!petsitter.weekdays.mar.enable &&
		!petsitter.weekdays.mer.enable &&
		!petsitter.weekdays.jeu.enable &&
		!petsitter.weekdays.ven.enable && !petsitter.weekdays.sam.enable && !petsitter.weekdays.dim.enable) {
		return {
			field: 'weekdays',
			page: '1',
			scroll: '750',
			title: 'Disponibilité',
			message: 'Ajouter au moins un jour de disponibilité',
			validated: false
		}
	}

	// Type animaux
	if (petsitter.type.length === 0) {
		return {
			field: 'type',
			page: '1',
			scroll: '1300',
			title: 'Type d\'animaux',
			message: 'Choisissez au moins un type',
			validated: false
		}
	}

	// Type logement
	if (!petsitter.home_type) {
		return {
			field: 'home_type',
			page: '1',
			scroll: '1600',
			title: 'Type de logement',
			message: 'Renseignez un type de logement',
			validated: false
		}
	} else if (petsitter.home_type && petsitter.home_type === TypeHome.OTHER && !petsitter.other_home_type) {
		return {
			field: 'other_home_type',
			page: '1',
			scroll: '1600',
			title: 'Type de logement',
			message: 'Précisez votre type de logement',
			validated: false
		}
	}

	// Type jardin
	if (!petsitter.type_garden) {
		return {
			field: 'type_garden',
			page: '1',
			scroll: '1700',
			title: 'Type de jardin',
			message: 'Renseignez votre type de jardin',
			validated: false
		}
	}

	// Identité
	if (!petsitter.type_identity) {
		return {
			field: 'identity',
			page: undefined,
			scroll: undefined,
			message: 'Choisissez votre document d\'identité à envoyer',
			validated: false
		}
	} else if (petsitter.type_identity === 'ci') {
		if (!petsitter.identity.ci.file[0] || !petsitter.identity.ci.file[1]) {
			return {
				field: 'ci',
				page: undefined,
				scroll: undefined,
				title: 'Carte d\'identité',
				message: 'Veuillez ajouter votre document d\'identité recto/verso',
				validated: false
			}
		}
	} else if (petsitter.type_identity === 'permis') {
		if (petsitter.identity.permis.file.length === 0) {
			return {
				field: 'permis',
				page: undefined,
				scroll: undefined,
				title: 'Permis de conduire',
				message: 'Veuillez ajouter votre document d\'identité',
				validated: false
			}
		}
	} else if (petsitter.type_identity === 'passeport') {
		if (petsitter.identity.passeport.file.length === 0) {
			return {
				field: 'passeport',
				page: undefined,
				scroll: undefined,
				title: 'Passeport',
				message: 'Veuillez ajouter votre document d\'identité',
				validated: false
			}
		}
	}

	return {
		field: null,
		page: '',
		scroll: undefined,
		title: null,
		message: null,
		validated: true
	}
}

export default petsitterValidator
