import React, { useEffect, useRef, useState } from 'react';
import Svg, { Ellipse, G, Path } from 'react-native-svg';
import { Animated, View, StyleSheet, StatusBar, Text } from 'react-native';
import Animations from './animations';

enum SplashState {
	WAITFORREADY,
	FADEOUT,
	HIDDEN,
}

export const loaderTimeout = 2000;

const Loader: React.FC<{ appLoading: boolean }> = ({ appLoading }) => {
	const [state, setState] = useState<SplashState>(0);

	const opacity = useRef(new Animated.Value(1)).current;
	const paw1 = useRef(new Animated.Value(0)).current;
	const paw2 = useRef(new Animated.Value(0)).current;
	const paw3 = useRef(new Animated.Value(0)).current;
	const paw4 = useRef(new Animated.Value(0)).current;
	const paw5 = useRef(new Animated.Value(0)).current;

	const AnimatePath = Animated.createAnimatedComponent(Path);
	const AnimateEllipse = Animated.createAnimatedComponent(Ellipse);

	useEffect(() => {
		Animated.loop(
			Animated.sequence(Animations(paw1, paw2, paw3, paw4, paw5))
		).start();
	}, [paw1, paw2, paw3, paw4, paw5]);

	useEffect(() => {
		if (state === SplashState.WAITFORREADY) {
			if (appLoading) {
				setState(1);
			}
		}
	}, [state, appLoading]);

	useEffect(() => {
		if (state === SplashState.FADEOUT) {
			Animated.timing(opacity, {
				toValue: 0,
				duration: 350,
				delay: loaderTimeout,
				useNativeDriver: true
			}).start(() => {
				setState(2);
			});
		}
	}, [state, opacity]);

	if (state === SplashState.HIDDEN) return null;

	return (
		<Animated.View collapsable={false} style={[StyleSheet.absoluteFillObject, { opacity }]} className="bg-primary justify-center items-center">
			<StatusBar barStyle="light-content" animated/>
			<View className="flex items-center justify-center rounded-full bg-white h-20 w-20 shadow-md">
				<Svg viewBox="0 0 128 128" className="fill-primary" height={60} width={60}>
					<G xmlns="http://www.w3.org/2000/svg">
						<AnimatePath opacity={paw1} d="m40,83.82l18.05-18.05c3.32-3.32,8.71-3.32,12.03,0l18.05,18.05c6.65,6.65,6.64,17.42,0,24.07-5.41,5.41-13.53,6.42-19.96,3.03-2.59-1.36-5.63-1.36-8.22,0-6.42,3.39-14.55,2.38-19.96-3.03-6.64-6.64-6.65-17.41,0-24.07Z" />
						<G>
							<AnimateEllipse opacity={paw3} cx="48.38" cy="33.36" rx="12.8" ry="18.57" transform="translate(-6.99 13.66) rotate(-15)" />
							<AnimateEllipse opacity={paw4} cx="78.92" cy="33.36" rx="18.57" ry="12.8" transform="translate(26.27 100.96) rotate(-75)" />
						</G>
						<G>
							<AnimateEllipse opacity={paw2} cx="29.46" cy="58.31" rx="12.8" ry="18.57" transform="translate(-25.21 22.54) rotate(-30)" />
							<AnimateEllipse opacity={paw5} cx="98.54" cy="58.86" rx="18.57" ry="12.8" transform="translate(-1.7 114.77) rotate(-60)" />
						</G>
					</G>
				</Svg>
			</View>
			<Text className="font-title font-semibold text-white text-4xl mt-5">Good Sitter</Text>
		</Animated.View>
	);
};

export default Loader;
