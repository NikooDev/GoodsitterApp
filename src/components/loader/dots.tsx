import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const DotsLoader = () => {
	const dot1 = useRef(new Animated.Value(0)).current
	const dot2 = useRef(new Animated.Value(0)).current
	const dot3 = useRef(new Animated.Value(0)).current

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.parallel([
					Animated.timing(dot1, {
						toValue: -10,
						duration: 400,
						useNativeDriver: false,
					}),
					Animated.timing(dot2, {
						toValue: -10,
						delay: 200,
						duration: 400,
						useNativeDriver: false,
					}),
					Animated.timing(dot3, {
						toValue: -10,
						delay: 400,
						duration: 400,
						useNativeDriver: false,
					})
				]),
				Animated.parallel([
					Animated.timing(dot1, {
						toValue: 0,
						duration: 400,
						useNativeDriver: false,
					}),
					Animated.timing(dot2, {
						toValue: 0,
						delay: 200,
						duration: 400,
						useNativeDriver: false,
					}),
					Animated.timing(dot3, {
						toValue: 0,
						delay: 400,
						duration: 400,
						useNativeDriver: false,
					})
				]),
			]),
			{
				iterations: -1
			}
		).start(() => {

		});
	}, [dot1, dot2, dot3])

	return (
		<View className="flex flex-row bg-white shadow rounded-2xl h-10 pt-5 px-3">
			<Animated.View className="h-2.5 w-2.5 bg-primary shadow-sm rounded-full mr-1" style={{top: dot1}}/>
			<Animated.View className="h-2.5 w-2.5 bg-primary shadow-sm rounded-full mr-1" style={{top: dot2}}/>
			<Animated.View  className="h-2.5 w-2.5 bg-primary shadow-sm rounded-full" style={{top: dot3}}/>
		</View>
	);
};

export default DotsLoader;
