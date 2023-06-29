import { KeyboardTypeOptions, TextInputIOSProps } from 'react-native';

export const stepSignupForm = [
	{
		field: 'firstname',
		fieldName: 'Prénom',
		textContentType: 'nickname' as TextInputIOSProps['textContentType'],
		keyboardType: 'default' as KeyboardTypeOptions | undefined
	},
	{
		field: 'name',
		fieldName: 'Nom',
		textContentType: 'name' as TextInputIOSProps['textContentType'],
		keyboardType: 'default' as KeyboardTypeOptions | undefined
	},
	{
		field: 'birthday',
		fieldName: 'Date de naissance',
		textContentType: 'name' as TextInputIOSProps['textContentType'],
		keyboardType: 'default' as KeyboardTypeOptions | undefined,
		marginBottom: true
	},
	{
		field: 'email',
		fieldName: 'Adresse e-mail',
		textContentType: 'emailAddress' as TextInputIOSProps['textContentType'],
		keyboardType: 'email-address' as KeyboardTypeOptions | undefined,
		capitalize: true
	},
	{
		field: 'password',
		fieldName: 'Mot de passe',
		textContentType: 'password' as TextInputIOSProps['textContentType'],
		keyboardType: 'default' as KeyboardTypeOptions | undefined,
		secure: true
	}
]

export const stepSignupAddress = [
	{
		field: 'number_street',
		fieldName: 'N°',
		textContentType: 'none' as TextInputIOSProps['textContentType'],
		keyboardType: 'number-pad' as KeyboardTypeOptions | undefined,
		marginBottom: false
	},
	{
		field: 'street',
		fieldName: 'Nom de rue',
		textContentType: 'streetAddressLine2' as TextInputIOSProps['textContentType'],
		keyboardType: 'default' as KeyboardTypeOptions | undefined
	},
	{
		field: 'street_complement',
		fieldName: 'Complément d\'adresse (facultatif)',
		textContentType: 'streetAddressLine2' as TextInputIOSProps['textContentType'],
		keyboardType: 'default' as KeyboardTypeOptions | undefined
	},
	{
		field: 'zip_code',
		fieldName: 'Ville ou code postal',
		textContentType: 'none' as TextInputIOSProps['textContentType'],
		keyboardType: 'default' as KeyboardTypeOptions | undefined,
		returnKeyType: 'done'
	},
	{
		field: 'city',
		fieldName: 'Ville',
		textContentType: 'addressCity' as TextInputIOSProps['textContentType'],
		keyboardType: 'default' as KeyboardTypeOptions | undefined
	}
]
