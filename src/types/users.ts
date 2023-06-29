import { IProfile } from '@Type/profile';

export interface IUser {
	id: string
	email: string
	created_at: string
	updated_at: string
	profile: IProfile
}

export interface IUserUpdate {
	email: string
	street: string
	street_complement: string
	city: string
	zip_code: string
	phone_num: string
	name: string
	firstname: string
	birthday: string
	avatar_url: string | undefined
	cover_url: string | undefined
}
