import React, { useState } from 'react';
import FastImage from 'react-native-fast-image'
import GuideContent from '@Screen/guest/home/contents/guide.content';
import Theme from '@Asset/theme';
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { Dimensions, Pressable, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setStorage } from '@Helper/storage';
import { setGuideDone } from '@Reducer/app.reducer';
import LogoIcon from '@Component/icons/logo.icon';
import Text from '@Component/ui/text';
import ScreenLayout from '@Component/layouts/screen.layout';
import SvgIcon from '@Component/icons/svg';

const GuideScreen = () => {
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const { width } = Dimensions.get('screen');
	const dispatch = useDispatch();

	/**
	 * Permet de stocker en mémoire la lecture du guide
	 */
	const handleNext = async () => {
		await setStorage('stepGuide', 'done');
		dispatch(setGuideDone(true));
	};

	return (
		<ScreenLayout paddingBottom classNames="flex-1 bg-white" statusBarStyle="light-content">
			<View className="flex-1 items-center">
				<Carousel
					vertical={false} data={GuideContent} itemWidth={width} sliderWidth={width}
					onScrollIndexChanged={(index) => setCurrentIndex(index)}
					renderItem={({ item, index }) => (
						<View className="flex-1">
							<View className="bg-black overflow-hidden" style={{borderTopLeftRadius: 10, borderTopRightRadius: 10}}>
								<FastImage source={item.image()} className="w-full h-64 opacity-60"/>
							</View>
							<View className="pt-16 px-6 items-center">
								<Text className="mb-5">
									<Text title className="font-title text-2xl font-medium text-center text-darkText leading-9">{ item.title }</Text>
									<Text title className="font-title text-2xl font-bold text-center text-primary">{ item.subtitle }</Text>
									<Text title className="font-title text-2xl font-medium text-center text-darkText">{ item.endtitle }</Text>
								</Text>
								<Text className="font-text text-center text-darkText leading-5 tracking-tight" style={{fontSize: 14}}>{ item.text }</Text>
							</View>
							<View className="absolute bottom-0 w-full">
								<Text className="text-center font-text text-darkText text-xs tracking-tight">{ item.info }</Text>
							</View>
							{
								index === 3 &&
								<View className="absolute bottom-0 px-5 w-full">
									<Pressable onPress={() => handleNext()} className="bg-primary rounded-full h-12 items-center justify-center">
										<Text className="text-white text-base font-medium font-text tracking-tight">Continuer</Text>
									</Pressable>
								</View>
							}
						</View>
					)}/>
				<Pressable onPress={() => handleNext()} className="absolute py-1 px-2 top-5 right-5">
					<Text className="text-white font-text font-semibold">Ignorer</Text>
				</Pressable>
				<View className="absolute flex justify-center items-center rounded-full bg-white top-56 h-16 w-16 shadow-md">
					<SvgIcon height={37} width={37} fill={Theme.colors.primary} viewBox="0 0 128 128">
						<LogoIcon/>
					</SvgIcon>
				</View>
				<View className="-mt-2">
					<Pagination activeDotIndex={currentIndex} dotColor={Theme.colors.primary} dotStyle={{height: 10, width: 10, borderRadius: 30}}
											inactiveDotColor={Theme.colors.primary} dotsLength={GuideContent.length}/>
				</View>
			</View>
		</ScreenLayout>
	);
};

export default GuideScreen;
