import { Animated } from 'react-native';

const Animations = (paw1: Animated.Value, paw2: Animated.Value, paw3: Animated.Value, paw4: Animated.Value, paw5: Animated.Value) => {
	return [
		Animated.timing(paw1, {
			toValue: 1,
			duration: 350,
			useNativeDriver: true
		}),
		Animated.timing(paw2, {
			toValue: 2,
			duration: 350,
			useNativeDriver: true
		}),
		Animated.timing(paw3, {
			toValue: 3,
			duration: 350,
			useNativeDriver: true
		}),
		Animated.timing(paw4, {
			toValue: 4,
			duration: 350,
			useNativeDriver: true
		}),
		Animated.timing(paw5, {
			toValue: 5,
			duration: 350,
			useNativeDriver: true
		})
	];
};

export default Animations;
