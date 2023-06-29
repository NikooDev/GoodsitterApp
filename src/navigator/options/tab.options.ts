import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { headerShown } from '@Navigator/options/screen.options';

export const tabScreen: NativeStackNavigationOptions = {
	...headerShown,
	gestureEnabled: false
};

export const tabModalGestureDisable: NativeStackNavigationOptions = {
	...tabScreen,
	presentation: 'modal',
	gestureEnabled: false
};

export const tabModalGesture: NativeStackNavigationOptions = {
	...headerShown,
	presentation: 'modal',
	gestureEnabled: true
};

export const modalGesture: NativeStackNavigationOptions = {
	presentation: 'modal',
	gestureEnabled: true
}
