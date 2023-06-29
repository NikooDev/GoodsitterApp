import { ISignup } from '@Type/auth';

const signupValidator = (signup: ISignup) => {

	if (signup.firstname === undefined || signup.firstname.length === 0){
		return {
			field: 'firstname',
			message: 'Votre prénom est requis',
			validated: false
		}
	}
	if (signup.firstname.length < 3 || signup.firstname.length > 30) {
		return {
			field: 'firstname',
			message: 'Votre prénom doit contenir entre 3 et 30 caractères alphabétiques',
			validated: false
		}
	}
	if (signup.name === undefined || signup.name.length === 0){
		return {
			field: 'name',
			message: 'Votre nom est requis',
			validated: false
		}
	}
	if (signup.name.length < 3 || signup.name.length > 30) {
		return {
			field: 'name',
			message: 'Votre nom doit contenir entre 3 et 30 caractères alphabétiques',
			validated: false
		}
	}
	if (signup.birthday === undefined || signup.birthday.length === 0){
		return {
			field: 'birthday',
			message: 'Votre date de naissance est requise',
			validated: false
		}
	}
	if (signup.email === undefined || signup.email.length === 0){
		return {
			field: 'email',
			message: 'Une adresse e-mail valide est requise',
			validated: false
		}
	}
	if (signup.email && !signup.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
		return {
			field: 'email',
			message: 'Votre adresse e-mail n\'est pas valide',
			validated: false
		}
	}
	if (signup.password === undefined || signup.password.length === 0){
		return {
			field: 'password',
			message: 'Votre mot de passe n\'est pas défini',
			validated: false
		}
	}
	if (signup.password && signup.password.length < 8 || signup.password.length > 30) {
		return {
			field: 'password',
			message: 'Votre mot de passe doit contenir entre 8 et 30 caractères',
			validated: false
		}
	}
	if (signup.number_street === undefined || signup.number_street.length === 0){
		return {
			field: 'number_street',
			message: 'Votre numéro de rue est requis',
			validated: false
		}
	}
	if (signup.street === undefined || signup.street.length === 0){
		return {
			field: 'street',
			message: 'Votre rue est requise',
			validated: false
		}
	}
	if (signup.zip_code === undefined || signup.zip_code.length === 0){
		return {
			field: 'zip_code',
			message: 'Votre ville et code postal sont requis',
			validated: false
		}
	}
	if (signup.city === undefined || signup.city.length === 0){
		return {
			field: 'city',
			message: 'Votre ville est requise',
			validated: false
		}
	}

	return {
		field: null,
		message: null,
		validated: true,
	}
}

export default signupValidator
