import Class from 'classnames';
import { ActivityIndicator, Animated, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '@Type/state';

const LoaderUpload = () => {
	const [hideElement, setHideElement] = useState<boolean>(true);
	const { app } = useSelector((state: IRootState) => state);
	const animate = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (app.pendingUpload) {
			setHideElement(false)
		} else {
			setTimeout(() => setHideElement(true), 320)
		}
		Animated.timing(animate, {
			toValue: app.pendingUpload ? 1 : 0,
			useNativeDriver: true,
			duration: 300
		}).start()
	}, [app, animate])

	return (
		<Animated.View className={Class('absolute left-0 right-0 -top-0 bottom-0 justify-center items-center z-50', hideElement && 'hidden')} style={{ backgroundColor: 'rgba(0, 0, 0, .85)', opacity: animate }}>
			<View className="h-32 w-32 justify-center rounded-3xl">
				<ActivityIndicator color="#fff" size="large"/>
			</View>
		</Animated.View>
	)
}

export default LoaderUpload
