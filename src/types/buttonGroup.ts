import { StyleProp, TextStyle, ViewStyle } from 'react-native';

interface IButtonGroupProps {
	values: string[];
	value: string;
	height?: number
	onSelect: (val: string) => void;
	style?: StyleProp<ViewStyle>;
	highlightBackgroundColor: string;
	highlightTextColor: string;
	inactiveBackgroundColor: string;
	inactiveTextColor: string;
	textStyle?: StyleProp<TextStyle>;
}

export default IButtonGroupProps
