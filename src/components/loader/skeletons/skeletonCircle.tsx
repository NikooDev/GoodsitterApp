import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

interface ISkeletonCircle {
	heightCircle: number
	widthCicle: number
	colorContainer: string
	colorGradient: {
		center: string
		between: string
	}
}

const SkeletonCircle: React.FC<PropsWithChildren & ISkeletonCircle> = ({
	children,
	heightCircle,
	widthCicle,
	colorContainer,
	colorGradient}) => {
	const width = Dimensions.get('window').width / 1.5;
	const animatedValue = useRef(new Animated.Value(0)).current;

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
		<View className="rounded-full overflow-hidden" style={{backgroundColor: colorContainer, height: heightCircle, width: widthCicle}}>
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

export default SkeletonCircle;
