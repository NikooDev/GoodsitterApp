import React from 'react';
import Animated from 'react-native-reanimated';
import { IRootStackProps } from '@Type/stack';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export enum RoleEnum {
	PETOWNER = 0,
	PETSITTER = 1,
	ADMIN = 2
}

export enum StatusEnum {
	OFFLINE = 0,
	ONLINE = 1,
	BUSY = 2
}

export interface IProfile {
	name: string
	firstname: string
	birthday: string
	avatar_url: string
	cover_url: string
	street: string
	street_complement: string
	city: string
	zip_code: string
	country: string
	phone_num: string
	latitude: number
	longitude: number
	is_geolocation: boolean
	role: RoleEnum
}

export interface ITabProps {
	navigation?: IRootStackProps<'Profile'>['navigation']
	scroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
	scrollRef: React.LegacyRef<Animated.ScrollView>
}
