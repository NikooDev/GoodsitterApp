export interface ILoginState {
	isAuth: boolean | undefined
}

export interface ILogin {
	email: string
	password: string
}

export interface ISignup {
	name: string | undefined
	firstname: string | undefined
	birthday: string | undefined
	email: string | undefined
	password: string | undefined
	number_street: string | undefined
	street: string | undefined
	street_complement: string | undefined
	zip_code: string | undefined
	city: string | undefined
	latitude: number | undefined
	longitude: number | undefined
	avatar_url: string | undefined
	cover_url: string | undefined
}

export interface IGeolocCity {
	lat: number
	lng: number
	placeName: string
	postalCode: string
}

export const initialSignup = {
	name: undefined,
	firstname: undefined,
	birthday: undefined,
	email: undefined,
	password: undefined,
	number_street: undefined,
	street: undefined,
	street_complement: undefined,
	zip_code: undefined,
	city: undefined,
	latitude: undefined,
	longitude: undefined,
	avatar_url: undefined,
	cover_url: undefined
}
