import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const headerShown: NativeStackNavigationOptions = {
	headerShown: false
};

export const welcomeScreen: NativeStackNavigationOptions = {
	...headerShown,
	animationTypeForReplace: 'pop'
};

export const guideScreen: NativeStackNavigationOptions = {
	...headerShown,
	presentation: 'modal',
	gestureEnabled: false
};

export const loginScreen: NativeStackNavigationOptions = {
	...headerShown,
	presentation: 'modal'
};
