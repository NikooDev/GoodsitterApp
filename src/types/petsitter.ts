import React from 'react';
import { Asset } from 'react-native-image-picker';
import { Image } from 'react-native-image-crop-picker';
import { IUser } from '@Type/users';
import InputScrollView from 'react-native-input-scroll-view';

export enum TypeAnimal {
	PETIT = 0,
	MOYEN = 1,
	GRAND = 2,
	TRES_GRAND = 3,
	CHAT = 4
}

export enum TypeHome {
	HOUSE = 'house',
	APARTMENT = 'apartment',
	OTHER = 'other'
}

export enum TypeGarden {
	CLOSED = 'closed',
	OPEN = 'open',
	NOT_GARDEN = 'not_garden'
}

export interface IServicesState {
	enable: boolean
	price: string | undefined
	price_additional_animal: string | undefined
}

export interface IPetsitterProfile {
	zip_code: string
	city: string
	street: string
	avatar_url: string | undefined
	number_experiences: string | undefined
	title: string | undefined
	description: string | undefined
	how_many_animals: number
	animal_types: TypeAnimal[]
	home_type: TypeHome | undefined
	other_home_type: string | undefined
	type_garden: TypeGarden | undefined
	full_time: boolean
	rating: string | 0
	services: {
		name: string
		price: string
		price_additional_animal: string | undefined
	}[],
	fullStar: number
	emptyStar: number
	photos_url: string[] | undefined
	weekdays: {
		lun: boolean
		mar: boolean
		mer: boolean
		jeu: boolean
		ven: boolean
		sam: boolean
		dim: boolean
	}[]
	latitude: number
	longitude: number
}

export interface IPetsitter {
	address: {
		number_street: string | undefined
		street_name: string | undefined
		address_comp: string | undefined
		zip: string | undefined
		city: string | undefined
	}
	avatar: string | undefined
	email: string | undefined
	phone: string | undefined
	number_experiences: string | undefined
	title: string | undefined
	description: string | undefined
	how_many_animals: number
	type: TypeAnimal[]
	home_type: TypeHome | undefined
	other_home_type: string | undefined
	type_garden: TypeGarden | undefined
	full_time: boolean
	services: {
		lodging: IServicesState,
		daycare: IServicesState,
		home_daycare: IServicesState,
		walk: IServicesState,
		visit: IServicesState
	},
	photos: Asset[] | undefined
	weekdays: {
		lun: { enable: boolean }
		mar: { enable: boolean }
		mer: { enable: boolean }
		jeu: { enable: boolean }
		ven: { enable: boolean }
		sam: { enable: boolean }
		dim: { enable: boolean }
	}
	type_identity: 'ci' | 'passeport' | 'permis' | undefined
	identity: {
		ci: {
			file: Image[]
		}
		passeport: {
			file: Image[]
		}
		permis: {
			file: Image[]
		}
		[key: string]: { file: Image[] }
	}
	[key: string]: any
}

const initialService = { enable: false, price: undefined, price_additional_animal: undefined } as IServicesState

export const initialPetsitter = {
	address: {
		number_street: undefined,
		street_name: undefined,
		address_comp: undefined,
		zip: undefined,
		city: undefined
	},
	avatar: undefined,
	email: undefined,
	phone: undefined,
	number_experiences: undefined,
	title: undefined,
	description: undefined,
	how_many_animals: 1,
	type: [],
	home_type: undefined,
	other_home_type: undefined,
	type_garden: undefined,
	full_time: false,
	services: {
		lodging: initialService,
		daycare: initialService,
		home_daycare: initialService,
		walk: initialService,
		visit: initialService
	},
	photos: [],
	weekdays: {
		lun: { enable: false },
		mar: { enable: false },
		mer: { enable: false },
		jeu: { enable: false },
		ven: { enable: false },
		sam: { enable: false },
		dim: { enable: false }
	},
	type_identity: undefined,
	identity: {
		ci: {
			file: []
		},
		passeport: {
			file: []
		},
		permis: {
			file: []
		}
	}
} as IPetsitter

export type IPetsitterSubFields = IPetsitter['address'] | IPetsitter['services'] | undefined
export type IPetsitterSubSubFields = keyof IPetsitter[keyof IPetsitterSubFields][string]
export type IHandleChangeValue = string | boolean | number | IPetsitter['photos'] | TypeAnimal[]
export type IPetsitters = {
	petsitter: IPetsitter,
	handleChange: (value: IHandleChangeValue, name: keyof IPetsitter, subName?: string, subSubName?: IPetsitterSubSubFields) => void,
	error: { field: null | string, message: null | string }
	setError: () => void
	scrollRef?: React.MutableRefObject<InputScrollView>
	user?: IUser
}
