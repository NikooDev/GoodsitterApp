import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import { IRouteUsers } from '@Type/stack';
import Class from 'classnames';

export interface IButton {
	classNames?: Class.Argument
	onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
	styles?: StyleProp<ViewStyle>
}

export interface IButtonTab extends IButton {
	title: string | null
	iconPath: string
	iconPathList?: string
	mapType?: 'map' | 'list'
	guest?: boolean
	routeName: IRouteUsers
	notifications?: boolean
	currentRoute: IRouteUsers
}
