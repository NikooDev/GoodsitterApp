import React from 'react';
import Animated from 'react-native-reanimated';
import { Pressable, View } from 'react-native';
import { ITabProps } from '@Type/profile';
import { AboutIcon, AddIcon } from '@Component/icons';
import { TabLoader } from '@Screen/users/profile/tabs/index';
import Text from '@Component/ui/text';
import SvgIcon from '@Component/icons/svg';

const TabAnimals = ({ navigation, scroll, scrollRef }: ITabProps) => {
	const isLoading = false

	return (
		<Animated.ScrollView ref={scrollRef} scrollEventThrottle={16} onScroll={scroll} scrollEnabled={!isLoading} scrollIndicatorInsets={{top: 40, left: 0, bottom: 0, right: 0}}>
			<View className="my-5">
				<View className="mb-3 bg-white shadow px-5 py-4">
					<Text className="font-semibold text-2xl text-darkText mb-3">Mes animaux</Text>
					{
						isLoading ? (
							<TabLoader/>
						) : (
							<>
								<Text className="font-normal text-slate-600 text-center mb-3">Vous n'avez pas encore ajouté d'animaux de compagnie.</Text>
								<View className="flex-row" style={{flexShrink: 1}}>
									<View className="items-center justify-center mr-2 rounded-full h-9 w-9">
										<SvgIcon viewBox="0 0 24 24" height={30} width={30} className="fill-slate-400">
											<AboutIcon/>
										</SvgIcon>
									</View>
									<Text className="font-normal text-slate-400" style={{flexShrink: 1}}>Ajouter votre animal de compagnie permet aux petsitters d'avoir un premier visuel sur le profil de votre animal.</Text>
								</View>
								<Pressable onPress={() => navigation && navigation.navigate('AnimalCreate')} className="bg-slate-600 flex-row items-center justify-center rounded-lg mt-4 py-2">
									<SvgIcon height={24} width={24} className="fill-white mr-1" viewBox="0 0 24 24">
										<AddIcon/>
									</SvgIcon>
									<Text className="text-white text-base text-center font-medium">Ajouter un animal</Text>
								</Pressable>
							</>
						)
					}
				</View>
			</View>
		</Animated.ScrollView>
	);
};

export default TabAnimals;
