import React, { PropsWithChildren, useEffect } from 'react';
import { Animated, Dimensions, Easing, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

interface ISkeletonRect {
	marginBottom?: number
	marginTop?: number
	heightRect: number
	widthRect?: number | string
	radius?: number
	colorContainer: string
	colorGradient: {
		center: string
		between: string
	}
}

const SkeletonRect: React.FC<PropsWithChildren & ISkeletonRect> = ({
	children,
	marginBottom,
	marginTop,
	heightRect,
	widthRect,
	radius,
	colorContainer,
	colorGradient}) => {
	const width = Dimensions.get('window').width;
	const animatedValue = new Animated.Value(0);

	useEffect(() => {
		Animated.loop(
			Animated.timing(animatedValue, {
				toValue: 1,
				duration: 1000,
				easing: Easing.linear,
				useNativeDriver: true,
			}),
		).start();
	}, [animatedValue]);

	const translateX = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: [-width, width],
	});

	return (
		<View className="overflow-hidden" style={[{
			backgroundColor: colorContainer,
			borderRadius: radius ? radius : 0,
			height: heightRect,
			width: widthRect ? widthRect : '100%',
			marginBottom: marginBottom ? marginBottom : 'auto',
			marginTop: marginTop ? marginTop : 'auto'
		}]}>
			<AnimatedGradient
				colors={[colorGradient.between, colorGradient.center, colorGradient.between]}
				start={{ x: 0, y: 1 }}
				end={{ x: 1, y: 1 }}
				style={[{
					transform: [{ translateX: translateX }],
				}, StyleSheet.absoluteFill]}
			/>
			{ children }
		</View>
	);
};

export default SkeletonRect;
