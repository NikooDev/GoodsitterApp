import React from 'react';
import { MapType } from 'react-native-maps';
import { IUser } from '@Type/users';

export interface ISettings {
	darkmode: boolean
	enable_notifications: boolean
	hide_email: boolean
	locale: string
	timezone: string
}

export type IMapType = MapType

export interface IMapSettings {
	map_type: MapType
	enable_avatar: boolean
	enable_rotation: boolean
	enable_circle: boolean
	search_distance: number
	search_altitude: number
	darkmode: boolean
}

export interface IMapSettingsBottomSheet {
	exported?: boolean
	isLoading: boolean
	isLoadingHydrateSettings: boolean
	initialMapSettings: IMapSettings
	setInitialMapSettings: React.Dispatch<React.SetStateAction<IMapSettings>>
	user: IUser
}
