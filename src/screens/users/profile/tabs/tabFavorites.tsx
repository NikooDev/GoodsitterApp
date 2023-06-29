import React from 'react';
import Animated from 'react-native-reanimated';
import { View } from 'react-native';
import { ITabProps } from '@Type/profile';
import Text from '@Component/ui/text';
import { TabLoader } from '@Screen/users/profile/tabs/index';

const TabFavorites = ({ navigation, scroll, scrollRef }: ITabProps) => {
	const isLoading = false

	return (
		<Animated.ScrollView ref={scrollRef} scrollEventThrottle={16} onScroll={scroll} scrollEnabled={!isLoading} scrollIndicatorInsets={{top: 40, left: 0, bottom: 0, right: 0}}>
			<View className="my-5">
				<View className="mb-3 bg-white shadow px-5 py-4">
					<Text className="font-semibold text-2xl text-darkText mb-3">Mes favoris</Text>
					{
						isLoading ? (
							<TabLoader/>
						) : (
							<>

							</>
						)
					}
				</View>
			</View>
		</Animated.ScrollView>
	);
};

export default TabFavorites;
