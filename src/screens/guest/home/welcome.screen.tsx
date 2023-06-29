import React, { useRef } from 'react';
import FastImage from 'react-native-fast-image';
import Theme from '@Asset/theme';
import { View, Pressable, Animated, ActivityIndicator } from 'react-native';
import { IRootStackProps } from '@Type/stack';
import { dog5, cat2, dog4, cat3, home } from '@Screen/guest/home/contents/welcome.content';
import { SvgUri } from 'react-native-svg';
import { useDispatch } from 'react-redux';
import { setAccessGuest } from '@Reducer/app.reducer';
import Text from '@Component/ui/text';
import ScreenLayout from '@Component/layouts/screen.layout';

const WelcomeScreen = ({ navigation }: IRootStackProps<'Welcome'>) => {
	const svgOpacity = useRef(new Animated.Value(0)).current;
	const shadow = { shadowColor: '#000', shadowOffset: {width: 0, height: 0}, shadowOpacity: .3, shadowRadius: 5 };
	const dispatch = useDispatch()

	const handleSvgLoaded = () => {
		Animated.timing(svgOpacity, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true
		}).start()
	}

	return (
		<ScreenLayout paddingTop classNames="flex-1 bg-primary items-center justify-between" statusBarStyle="light-content">
			<View className="flex flex-row w-full justify-between items-center px-5" style={{flex: .1}}>
				<Text title className="font-title font-semibold text-white text-3xl">Good Sitter</Text>
			</View>
			<View className="bg-white rounded-t-3xl items-center w-full pb-10 px-5" style={{flex: .9}}>
				<View className="flex justify-around flex-row w-full -mb-2">
					<View className="flex mt-20 bg-white w-12 h-12 p-1 rounded-full" style={shadow}>
						<FastImage source={dog5()} resizeMode="cover" className="rounded-full w-10 h-10" />
					</View>
					<View className="flex mt-8 bg-white w-14 h-14 p-1 rounded-full" style={shadow}>
						<FastImage source={cat2()} resizeMode="cover" className="rounded-full w-12 h-12" />
					</View>
					<View className="flex mt-9 bg-white w-16 h-16 p-1 rounded-full" style={shadow}>
						<FastImage source={dog4()} resizeMode="cover" className="rounded-full w-14 h-14" />
					</View>
					<View className="flex mt-16 bg-white w-20 h-20 p-1 rounded-full" style={shadow}>
						<FastImage source={cat3()} resizeMode="cover" className="rounded-full w-[72px] h-[72px]" />
					</View>
				</View>
				<View className="flex justify-center items-center h-[300px] w-full">
					<ActivityIndicator size="large" className="absolute" color={Theme.colors.darkText}/>
					<Animated.View className="h-[300px] w-full" style={{opacity: svgOpacity}}>
						<SvgUri uri={home.uri} className="scale-[.95]" onLayout={handleSvgLoaded} />
					</Animated.View>
				</View>
				<View className="flex-1 items-center justify-between -mt-[65px] w-full">
					<Text className="text-center text-[26px] font-title font-medium leading-10">
						<Text title className="text-darkText">Bienvenue sur l'application </Text>
						<Text title className="text-primary">Good Sitter</Text>
						<Text title className="text-darkText"> !</Text>
					</Text>
					<View className="flex w-full">
						<Pressable onPress={() => navigation.navigate('Login')} className="bg-primary items-center justify-center rounded-3xl w-full h-12 mb-4">
							<Text className="text-white text-base font-text font-medium">Se connecter</Text>
						</Pressable>
						<Pressable onPress={() => navigation.navigate('Signup')} className="bg-white border-2 border-darkText items-center justify-center rounded-3xl w-full h-12">
							<Text className="text-darkText text-base font-text font-medium">Créer un compte</Text>
						</Pressable>
						<Pressable onPress={() => {
							dispatch(setAccessGuest(true))
							navigation.navigate('MapUsers')
						}} className="w-full mt-4 mb-1">
							<Text className="text-darkText text-base text-center underline font-text font-medium">Trouver un pet-sitter</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</ScreenLayout>
	);
};

export default WelcomeScreen;
