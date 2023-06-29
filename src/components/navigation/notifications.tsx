import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { IButtonTab } from '@Type/button';

const Notifications = ({ route }: { route: IButtonTab['routeName'] }) => {
	const [unreadMessages, _] = useState<number>(0)

	const containerStyle = useAnimatedStyle(() => {
		return {
			opacity: withTiming(unreadMessages === 0 ? 0 : 1, { duration: 300 }),
			transform: [{
				scale: withTiming(unreadMessages === 0 ? 0 : 1, { duration: 300 })
			}]
		}
	}, [unreadMessages])

	return (
		<Animated.View style={containerStyle} className="absolute top-3 right-3">
			<View className="items-center h-[19px] px-1 min-w-[19px] rounded-full bg-red-500">
				<Text className="font-semibold text-xs text-white top-[1.2px] left-[.5px]">
					{
						route === 'Messages' && unreadMessages !== 0 && unreadMessages
					}
				</Text>
			</View>
		</Animated.View>
	);
};

export default Notifications;
