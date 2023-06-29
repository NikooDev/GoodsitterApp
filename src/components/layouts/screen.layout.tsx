import React from 'react';
import { View, StatusBar } from 'react-native';
import ILayout from '@Type/layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Class from 'classnames';

const ScreenLayout: React.FC<ILayout> = ({
	children,
	classNames,
	styles,
	paddingTop,
	paddingBottom,
	profileLayout = false,
	statusBarStyle = 'dark-content',
}) => {
	const insets = useSafeAreaInsets()
	const pt = paddingTop && { paddingTop: insets.top }
	const pb = paddingBottom && { paddingBottom: insets.bottom }
	const isProfile = profileLayout && 'absolute bg-black h-12 w-full z-10 opacity-40'

	return (
		<>
			<View className={Class(isProfile)}>
				<StatusBar barStyle={statusBarStyle} animated/>
			</View>
			<View className={Class(classNames)} style={[styles, pt, pb]}>
				{ children }
			</View>
		</>
	);
};

export default ScreenLayout;
