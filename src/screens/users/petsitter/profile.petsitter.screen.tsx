import React, { useCallback, useEffect, useRef, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import MapView, { MapCircle } from 'react-native-maps';
import Modal from 'react-native-modal';
import { Dimensions, Image, Pressable, ScrollView, View, Animated as Anim, ActivityIndicator } from 'react-native';
import { RoleEnum } from '@Type/profile';
import { Api } from '@Config/api';
import Animated, {
	Easing, runOnJS,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated';
import { IRootStackProps } from '@Type/stack';
import { IPetsitterProfile } from '@Type/petsitter';
import { IPetMarker } from '@Type/map';
import { BackIcon, StarIcon, StarOutlinedIcon } from '@Component/icons';
import { petsitterAnimalTypes, petsitterGardenType, petsitterHomeType, serviceContent } from '@Constant/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckIcon, ClearIcon } from '@Component/icons/actions';
import ScreenLayout from '@Component/layouts/screen.layout';
import Text from '@Component/ui/text';
import SvgIcon from '@Component/icons/svg';
import Class from 'classnames';
import Theme from '@Asset/theme';

const ProfilePetsitterScreen = ({ navigation, route }: IRootStackProps<'PetsitterProfile'>) => {
	const [modalDescription, setModalDescription] = useState<boolean>(false);
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [headerFixed, setHeaderFixed] = useState<boolean>(false)
	const petsitter = route.params && JSON.parse(route.params.petsitter) as IPetsitterProfile & IPetMarker
	const carouselRef = useRef<Carousel<string>>(null)
	const width = Dimensions.get('screen').width
	const insets = useSafeAreaInsets()
	const fadeIn = useRef(new Anim.Value(0)).current

	const handleRating = useCallback((count: number, isFilled: boolean) => {
		return Array.from({ length: Number(count) }).map((_, index) => (
			<SvgIcon key={index} viewBox="0 0 24 24" className={Class(isFilled ? 'fill-yellow-400' : 'fill-gray-300')} height={18} width={18}>
				{
					isFilled ? <StarIcon/> : <StarOutlinedIcon/>
				}
			</SvgIcon>
		));
	}, [])

	const carouselY = useSharedValue(0);
	const heightContent = useSharedValue(0);
	const headerOpacity = useSharedValue(0);
	const headerTranslateY = useSharedValue(-100);
	const isScrolling = useSharedValue(false);
	const duration = 300;
	const animConfig = {
		duration,
		easing: Easing.inOut(Easing.ease)
	}

	const handleHeaderFixed = () => {
		headerTranslateY.value = 0
		headerOpacity.value = 1
		setHeaderFixed(true)
	}
	const handleHeaderRelative = () => {
		headerTranslateY.value = -100
		headerOpacity.value = 0
		setHeaderFixed(false)
	}

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			if (event.contentOffset.y <= 0 || event.contentOffset.y < 0 && isScrolling.value) {
				carouselY.value = 0;
				heightContent.value = 0;
			} else {
				carouselY.value = - event.contentInset.top;
			}

			if (event.contentOffset.y > 300) {
				runOnJS(handleHeaderFixed)()
			} else {
				runOnJS(handleHeaderRelative)()
			}
		},
		onBeginDrag: () => {
			isScrolling.value = true;
		},
		onEndDrag: () => {
			isScrolling.value = false;
		}
	})

	const carouselAnim = useAnimatedStyle(() => {
		return {
			transform: [{translateY: withTiming(carouselY.value, animConfig)}]
		};
	});
	const headerAnim = useAnimatedStyle(() => {
		return {
			opacity: withTiming(headerOpacity.value, animConfig),
			transform: [{translateY: withTiming(headerTranslateY.value, animConfig)}]
		}
	})

	useEffect(() => {
		Anim.timing(fadeIn, {
			toValue: 1,
			duration: 150,
			delay: 500,
			useNativeDriver: true
		}).start()
	}, [fadeIn])

	return (!petsitter ? <></> :
		<ScreenLayout profileLayout={!headerFixed} classNames="flex-1" statusBarStyle={!headerFixed ? 'light-content' : 'dark-content'}>
			<Animated.ScrollView scrollEventThrottle={16} onScroll={scrollHandler} contentInset={{ bottom: 65 }} contentContainerStyle={{ paddingBottom: 65 }}>
				<Animated.View style={carouselAnim}>
					<Carousel
						ref={carouselRef}
						autoplay
						autoplayDelay={3000}
						autoplayInterval={3000}
						data={petsitter.photos_url ? petsitter.photos_url : []} vertical={false} layout="stack"
						contentContainerCustomStyle={{paddingBottom: 15}}
						onScrollIndexChanged={(index) => setCurrentIndex(index)}
						itemWidth={width} sliderWidth={width} renderItem={({ item }) => {
						return (
							<View className="bg-white rounded-3xl shadow items-center justify-center">
								<Anim.View style={{ opacity: fadeIn }} className="bg-white shadow z-30 rounded-3xl h-96 justify-center items-center">
									<Image source={{uri: Api+'/static/'+item}} resizeMode="cover" className="rounded-3xl h-96" style={{ width: width }}/>
								</Anim.View>
								<ActivityIndicator className="absolute z-0 pt-10" size="large" color={Theme.colors.primary}/>
							</View>
						)
					}}/>
					{ petsitter.photos_url &&
							<View className="absolute bottom-2 right-0 left-0">
                  <Pagination activeDotIndex={currentIndex} dotColor="#fff" dotStyle={{height: 10, width: 10, borderRadius: 30}}
                              inactiveDotColor="#fff" dotsLength={petsitter.photos_url.length} containerStyle={{paddingTop: 0, paddingBottom: 25}}/>
							</View>
					}
				</Animated.View>
				<View className="px-5 pb-2">
					<View className="flex-row items-center">
						<Pressable onPress={() => navigation.goBack()} className="w-10 py-2">
							<SvgIcon height={24} width={24} viewBox="0 0 24 24">
								<BackIcon/>
							</SvgIcon>
						</Pressable>
						<View className="bg-white rounded-full h-[70px] w-[70px] shadow justify-center items-center">
							<Image source={{ uri: Api+'/static'+petsitter.avatar_url }} className="h-16 w-16 rounded-full"/>
						</View>
						<View className="ml-3 flex-1">
							<Text ellipsizeMode="tail" className="-mb-1" numberOfLines={2}>
								<Text className="text-lg text-slate-800 font-medium">{ petsitter.firstname.cap() }</Text>{' '}
								<Text className="text-lg text-slate-800 font-medium">{ petsitter.name.cap() }</Text>
							</Text>
							<View className={Class('flex-row items-center -ml-0.5', petsitter.role == RoleEnum.PETSITTER && 'mt-1')}>
								{
									petsitter.role && petsitter.role == RoleEnum.PETSITTER && (
										Number(petsitter.rating) > 0.0 && (
											<>
												{ petsitter.fullStar ? handleRating(petsitter.fullStar, true) : null }
												{ petsitter.emptyStar ? handleRating(petsitter.emptyStar, false) : null }
												{
													petsitter.rating && petsitter.rating == '5.0' ? (
														<Text className="ml-1.5 text-xs top-[1.5px]">5/5</Text>
													) : (
														<Text className="ml-1.5 text-xs top-[1.5px]">{ petsitter.rating.toFixed(1) }/5</Text>
													)
												}
											</>
										)
									)
								}
							</View>
						</View>
					</View>
					<View className="py-3 mt-3">
						<Text className="text-2xl font-medium text-center">{ petsitter.title }</Text>
					</View>
					<View className={Class(
							'bg-white shadow rounded-3xl mb-5 mt-5 pt-3 px-5 max-h-[320px]', petsitter.description && petsitter.description.length > 150 ? 'pb-10' : 'pb-4')}>
						<Text className="text-slate-800 text-lg font-medium" numberOfLines={1}>À propos de { petsitter.firstname.cap() }</Text>
						<Text className="text-[15px] mt-3">{ petsitter.description }</Text>
						{
							petsitter.description && petsitter.description.length > 150 && (
								<>
									<Pressable onPress={() => setModalDescription(true)} className="z-50 absolute left-0 right-0 bottom-4">
										<Text className="text-center font-medium">Lire la suite</Text>
									</Pressable>
									<LinearGradient start={{x: 0, y: -.4}} end={{x: 0, y: .6}} colors={['rgba(255, 255, 255, .5)', 'rgba(255, 255, 255, 1)']}
																	className="h-20 w-full absolute bottom-0 z-40 rounded-b-3xl" style={{ width: width - 40 }}/>
								</>
							)
						}
					</View>
					<Text className="text-slate-800 text-lg font-medium mb-2">Service{ petsitter.services.length > 1 && 's' }</Text>
					<View className="mb-3">
						{
							petsitter.services && petsitter.services.map((service, index) => (
								<View className={Class(
									'bg-white shadow mb-2 p-5 px-5 rounded-lg',
									index === 0 && 'border-b-[1px] border-b-slate-200 rounded-t-3xl rounded-b-lg',
									index === petsitter.services.length - 1 && 'rounded-b-3xl rounded-t-lg',
									index === 0 && petsitter.services.length === 1 && 'rounded-3xl'
								)} key={index}>
									<View className="flex-row items-start justify-between">
										<View className="w-[77%]">
											<Text className="font-medium text-base text-slate-800">{ service.name.cap() }</Text>
											<Text className="text-slate-400">{ serviceContent(service.name) }</Text>
											{
												Number(service.price_additional_animal) !== 0 && (
													<Text className="mt-2">
														<Text className="text-slate-800">Animal supplémentaire : </Text>
														<Text className="text-slate-800 font-medium text-base">+{ service.price_additional_animal }€</Text>
													</Text>
												)
											}
											<Pressable className="mt-4 bg-primary w-2/4 py-3 rounded-3xl">
												<Text className="text-white font-medium text-center">Réserver</Text>
											</Pressable>
										</View>
										<View className="">
											<Text className="text-slate-800 font-medium text-base">{ service.price }€</Text>
											<Text className="text-xs text-slate-400">/nuit</Text>
										</View>
									</View>
								</View>
							))
						}
					</View>
					<Text className="text-slate-800 text-lg font-medium mb-2">Habitation</Text>
					<View className="bg-white shadow mb-5 p-5 px-5 rounded-3xl">
						<View className="flex-row items-center justify-between border-b-2 border-b-slate-200 pb-3">
							<Text className="text-base text-slate-800">Type d'habitation</Text>
							<Text className="text-slate-800 font-medium text-base">{ petsitter.home_type && petsitterHomeType(petsitter.home_type, petsitter.other_home_type) }</Text>
						</View>
						<View className="flex-row items-center justify-between pt-3">
							<Text className="text-base text-slate-800">Jardin</Text>
							<Text className="text-slate-800 font-medium text-base">{ petsitter.type_garden && petsitterGardenType(petsitter.type_garden) }</Text>
						</View>
					</View>
					<Text className="text-slate-800 text-lg font-medium mb-2">Détails</Text>
					<View className="bg-white shadow mb-5 p-5 px-5 rounded-3xl">
						<View className="flex-row items-center justify-between border-b-2 border-b-slate-200 pb-3">
							<Text className="text-base text-slate-800">Expériences avec{'\n'}les animaux</Text>
							<Text className="text-slate-800 font-medium text-base">
								{
									petsitter.number_experiences == '0' ? (
										'Moins d\'un an'
									) : (
										<>{ petsitter.number_experiences } an{ Number(petsitter.number_experiences) > 1 && 's' }</>
									)
								}
							</Text>
						</View>
						<View className="flex-row items-center justify-between border-b-2 border-b-slate-200 pb-3 pt-3">
							<Text className="text-base text-slate-800">Nombres d'animaux{'\n'}acceptés</Text>
							<Text className="text-slate-800 font-medium text-base">
								{
									petsitter.how_many_animals === 10 ? (
										'10 ou plus'
									) : (
										<>{ petsitter.how_many_animals }</>
									)
								}
							</Text>
						</View>
						<View className="justify-between pt-3">
							<Text className="text-base text-slate-800">Types d'animaux acceptés :</Text>
							<View className="mt-3">
								{
									petsitter.animal_types && petsitter.animal_types.map((type, index) => (
										<View key={index} className="flex-row px-2 mb-1">
											<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-green-500 mr-2">
												<CheckIcon/>
											</SvgIcon>
											<Text className="text-slate-800 font-medium text-base">{ petsitterAnimalTypes(type) }</Text>
										</View>
									))
								}
							</View>
						</View>
					</View>
					<Text className="text-slate-800 text-lg font-medium mb-2">Disponibilités</Text>
					<View className="bg-white shadow mb-5 p-5 rounded-3xl">
						<View className="pb-5 border-b-2 border-b-slate-200">
							{
								petsitter.weekdays.map((day, index) => (
									<View key={index}>
										<View className="flex-row justify-around">
											<View className={Class(day.lun ? 'bg-primary': 'bg-white', 'shadow rounded-lg h-10 w-10 items-center justify-center')}>
												<Text className={Class(day.lun ? 'text-white' : 'text-slate-800', 'text-xs font-medium')}>Lun</Text>
											</View>
											<View className={Class(day.mar ? 'bg-primary': 'bg-white', 'shadow rounded-lg h-10 w-10 items-center justify-center')}>
												<Text className={Class(day.mar ? 'text-white' : 'text-slate-800', 'text-xs font-medium')}>Mar</Text>
											</View>
											<View className={Class(day.mer ? 'bg-primary': 'bg-white', 'shadow rounded-lg h-10 w-10 items-center justify-center')}>
												<Text className={Class(day.mer ? 'text-white' : 'text-slate-800', 'text-xs font-medium')}>Mer</Text>
											</View>
											<View className={Class(day.jeu ? 'bg-primary': 'bg-white', 'shadow rounded-lg h-10 w-10 items-center justify-center')}>
												<Text className={Class(day.jeu ? 'text-white' : 'text-slate-800', 'text-xs font-medium')}>Jeu</Text>
											</View>
											<View className={Class(day.ven ? 'bg-primary': 'bg-white', 'shadow rounded-lg h-10 w-10 items-center justify-center')}>
												<Text className={Class(day.ven ? 'text-white' : 'text-slate-800', 'text-xs font-medium')}>Ven</Text>
											</View>
											<View className={Class(day.sam ? 'bg-primary': 'bg-white', 'shadow rounded-lg h-10 w-10 items-center justify-center')}>
												<Text className={Class(day.sam ? 'text-white' : 'text-slate-800', 'text-xs font-medium')}>Sam</Text>
											</View>
											<View className={Class(day.dim ? 'bg-primary': 'bg-white', 'shadow rounded-lg h-10 w-10 items-center justify-center')}>
												<Text className={Class(day.dim ? 'text-white' : 'text-slate-800', 'text-xs font-medium')}>Dim</Text>
											</View>
										</View>
									</View>
								))
							}
						</View>
						<View className="flex-row items-center justify-between pt-3">
							<Text className="text-base text-slate-800">Pet-sitter à plein temps</Text>
							<View className="flex-row">
								{
									petsitter.full_time ? (
										<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-green-500">
											<CheckIcon/>
										</SvgIcon>
									) : (
										<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-red-500">
											<ClearIcon/>
										</SvgIcon>
									)
								}
							</View>
						</View>
					</View>
					<Text className="text-slate-800 text-lg font-medium mb-2">Localisation</Text>
					<View className="h-72 w-full rounded-3xl bg-white shadow">
						<View className="h-72 w-full overflow-hidden rounded-3xl">
							<MapView
								className="h-72 w-full"
								zoomEnabled={false}
								initialRegion={{
									latitude: petsitter.latitude,
									longitude: petsitter.longitude,
									latitudeDelta: .1, longitudeDelta: .1
								}} scrollEnabled={false} userInterfaceStyle="light">
								<MapCircle center={{ latitude: petsitter.latitude, longitude: petsitter.longitude }}
													 radius={2000} fillColor="rgba(49, 124, 246, .3)" strokeColor="#fff" strokeWidth={2} />
							</MapView>
						</View>
					</View>

				</View>
			</Animated.ScrollView>
			<Animated.View style={headerAnim} className="bg-white rounded-b-3xl h-40 shadow -mt-6 z-50 absolute w-full flex-1 top-0 right-0 left-0">
				<View style={{ paddingTop: insets.top }} className="mt-8 px-5">
					<View className="flex-row items-center">
						<Pressable onPress={() => navigation.goBack()} className="w-10 py-2">
							<SvgIcon height={24} width={24} viewBox="0 0 24 24">
								<BackIcon/>
							</SvgIcon>
						</Pressable>
						<Image source={{ uri: Api+'/static'+petsitter.avatar_url }} className="h-16 w-16 rounded-full"/>
						<View className="ml-3 flex-1">
							<Text ellipsizeMode="tail" numberOfLines={1}>
								<Text className="text-lg text-slate-800 font-medium">{ petsitter.firstname.cap() }</Text>{' '}
								<Text className="text-lg text-slate-800 font-medium">{ petsitter.name.cap() }</Text>
							</Text>
							<Text className="-mt-0.5 text-slate-500">{ petsitter.city && petsitter.city.cap() }</Text>
						</View>
					</View>
				</View>
			</Animated.View>
			<Modal isVisible={modalDescription} scrollHorizontal useNativeDriver hideModalContentWhileAnimating>
				<View className="bg-white rounded-3xl py-3 px-4 max-h-96">
					<Text className="text-slate-800 text-lg font-medium pb-3" numberOfLines={1}>À propos de { petsitter.firstname.cap() }</Text>
					<ScrollView>
						<Text className="text-[15px]">{ petsitter.description }</Text>
					</ScrollView>
					<Pressable onPress={() => setModalDescription(false)} className="mt-4 bg-primary py-2 px-5 rounded-3xl ml-auto">
						<Text className="text-white font-medium text-center">Fermer</Text>
					</Pressable>
				</View>
			</Modal>
		</ScreenLayout>
	)
}

export default ProfilePetsitterScreen
