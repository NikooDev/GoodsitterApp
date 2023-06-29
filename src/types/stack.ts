import {
	NativeStackNavigationEventMap,
	NativeStackNavigationOptions,
	NativeStackScreenProps
} from '@react-navigation/native-stack';
import { ParamListBase, StackNavigationState, TypedNavigator } from '@react-navigation/native';
import { NativeStackNavigatorProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { IPetsitterProfile } from '@Type/petsitter';
import { IPetMarker } from '@Type/map';

type IRootStackGlobal = {
	MapUsers: undefined
}

type IRootStackUser = {
	Home: undefined,
	Profile: {
		tabIndex: number
	} | undefined
	ProfileUpdate: undefined
	Map: undefined
	Filter: undefined
	Messages: undefined
	Chat: {
		headerTitle: string
		avatar: string
	} | undefined
	Menu: undefined
	AnimalCreate: undefined
	AnimalUpdate: undefined
	Animals: undefined
	PetsitterWelcome: undefined
	PetsitterSteps: undefined
	PetsitterProfile: {
		petsitter: string
	} | undefined
	PetsitterBaseProfile: undefined
	PetsitterDetailsProfile: undefined
	PetsitterIdentityProfile: undefined
	PetsitterPhoneProfile: undefined
	PetsitterPhotoProfile: undefined
	PetsitterServicesProfile: undefined
	PetsitterDisableProfile: undefined
	ConfirmPetsitterScreen: undefined
	Settings: undefined
}

type IRootStackGuest = {
	Guide: undefined
	Welcome: undefined
	Login: { deny: boolean } | undefined
	Signup: undefined
	Recover: undefined
}

export type IRouteUsers = keyof IRootStackUser
export type IRootStackParamList = IRootStackGlobal & IRootStackGuest & IRootStackUser
export type IRootStackProps<T extends keyof IRootStackParamList> = NativeStackScreenProps<IRootStackParamList, T>;
export type INativeStackNavigator = TypedNavigator<IRootStackParamList, StackNavigationState<ParamListBase>, NativeStackNavigationOptions, NativeStackNavigationEventMap, ({id, initialRouteName, children, screenListeners, screenOptions, ...rest}: NativeStackNavigatorProps) => JSX.Element>
