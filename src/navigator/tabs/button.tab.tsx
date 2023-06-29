import React, { useEffect } from 'react';
import Theme from '@Asset/theme';
import Svg, { Path } from 'react-native-svg';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { TabIndex } from '@Screen/users/profile/profile.screen';
import Animated, {
	interpolateColor,
	useAnimatedProps,
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated';
import { IButtonTab } from '@Type/button';
import { IRootState } from '@Type/state';
import { IRootStackParamList } from '@Type/stack';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { haptic } from '@Helper/functions';
import { useSelector } from 'react-redux';
import Class from 'classnames';
import Notifications from '@Component/navigation/notifications';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const ButtonTab: React.FC<IButtonTab> = ({
	title,
	iconPath,
	iconPathList,
	mapType = 'map',
	guest,
	routeName,
	notifications,
	currentRoute }) => {
	const navigation = useNavigation<NavigationProp<IRootStackParamList>>();
	const isFocused = routeName === currentRoute;
	const isMapButton = routeName === 'Map';
	const isMapType = isMapButton && mapType === 'map'
	const isListType = isMapButton && mapType === 'list'
	const classNamesSvg = Class(isMapType ? 'top-2 left-0.5 rotate-45' : isListType && 'top-3')
	const pathSvg = isMapButton ? isMapType ? iconPath : iconPathList : iconPath
	const sizeSvg = isMapButton ? 38 : 28
	const { app } = useSelector((state: IRootState) => state);

	const progress = useSharedValue(isFocused ? 1 : 0);

	useEffect(() => {
		progress.value = withTiming(isFocused ? 1 : 0, { duration: 100 });
	}, [progress, isFocused])

	const animatedProps = useAnimatedProps(() => {
		const fillColor = interpolateColor(progress.value, [0, 1], ['#fff', Theme.colors.primary]);
		const strokeColor = interpolateColor(progress.value, [0, 1], [guest ? Theme.colors.lightText : '#a3aac4', Theme.colors.primary]);

		return {
			fill: fillColor,
			stroke: strokeColor
		};
	});

	const animatedText = useAnimatedStyle(() => {
		const textColor = interpolateColor(progress.value, [0, 1], [guest ? Theme.colors.lightText : '#a3aac4', Theme.colors.primary]);

		return {
			color: textColor
		};
	});

	const handleRoute = () => {
		if (routeName !== currentRoute) {
			haptic('impactLight');

			if (routeName === 'Profile') {
				navigation.setParams({ tabIndex: TabIndex.Zero })
			}

			navigation.navigate(routeName);
		}
	};

	return (
		<View className="h-full w-16">
			<Pressable onPress={handleRoute} className="flex items-center justify-center h-full w-full pb-3">
				{
					isMapButton ? (
						<>
							<Svg strokeWidth={.85} height={sizeSvg} width={sizeSvg} viewBox="0 0 24 24" className={classNamesSvg}>
								<AnimatedPath animatedProps={animatedProps} d={pathSvg}/>
							</Svg>
							{
								app.loadingMap && (
									<ActivityIndicator size="large" color={Theme.colors.primary} className="bg-white h-12 w-12 rounded-full top-2 left-2.5 absolute"/>
								)
							}
						</>
					) : (
						<Svg strokeWidth={1.2} height={sizeSvg} width={sizeSvg} viewBox="0 0 24 24" className={classNamesSvg}>
							<AnimatedPath animatedProps={animatedProps} d={pathSvg}/>
						</Svg>
					)
				}
				{ notifications && <Notifications route={routeName}/> }
				{ title && <Animated.Text style={animatedText} className="font-text text-center font-medium text-[9px] mt-1 tracking-wide">{ title }</Animated.Text> }
			</Pressable>
		</View>
	);
};

export default ButtonTab;
