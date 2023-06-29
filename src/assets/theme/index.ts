import { colors, fonts } from './goodsitter'
import { DefaultTheme } from '@react-navigation/native';

const Theme = {
	colors, fonts
}

export const NavigatorTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: '#f0f2f5'
	}
}

export default Theme
