import { RoleEnum } from '@Type/profile';
import { IRootStackProps } from '@Type/stack';
import { IUser } from '@Type/users';

export interface IRoom {
	room_id: string
	from_id: string
	from_name: string
	from_firstname: string
	from_avatar_url: string
	from_role: RoleEnum
	to_id: string
	to_name: string
	to_firstname: string
	to_avatar_url: string
	to_role: RoleEnum
	last_message: string
	created_at: string
}

export interface INavigateRoom extends IRoom {
	current_user: IUser
	navigation: IRootStackProps<'Messages'>['navigation']
	unReadRoom?: {
		room_id: string
		from_id: string
		to_id: string
		unreadCount: number
	}
}

export interface IUsers {
	room_id: string
	from_id: string
	from_avatar_url: string
	from_role: RoleEnum
	to_id: string
	to_avatar_url: string
	to_role: string
	room: {
		petowner: string
		petsitter: string
	}
}

export interface IUsersMessage extends IUsers {
	message: string
	created_at: number
	isNewMessage: boolean
}
