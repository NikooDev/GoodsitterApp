import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import Theme from '@Asset/theme';
import { Api } from '@Config/api';
import { profileStyles } from '@Constant/styles';
import { Animated as Anim, Dimensions, Pressable, View, Image } from 'react-native';
import { useGetUserQuery, usersApi } from '@Service/api/users.api';
import Animated, {
	Easing,
	runOnJS,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withTiming
} from 'react-native-reanimated';
import { RoleEnum } from '@Type/profile';
import { IRootStackProps } from '@Type/stack';
import RNFetchBlob from 'react-native-blob-util';
import useUpload, { IUploadType } from '@Hook/useUpload';
import { setCoverAvatar } from '@Action/upload.action';
import { useDispatch } from 'react-redux';
import { useTouchTracker } from 'react-native-touch-tracker';
import { SkeletonCircle, SkeletonRect } from '@Component/loader/skeletons';
import { AvatarIcon, CoverIcon, EditIcon, PhotoIcon } from '@Component/icons';
import { TabBar, TabBarIndicator, TabView } from 'react-native-tab-view';
import { TabAnimals, TabFavorites, TabHome } from '@Screen/users/profile/tabs';
import { haptic } from '@Helper/functions';
import Text from '@Component/ui/text';
import SvgIcon from '@Component/icons/svg';
import ScreenLayout from '@Component/layouts/screen.layout';

export enum TabIndex {
	Zero = 0,
	One = 1,
	Two = 2,
}

/**
 * Créer un createAPI avec useGetProfileQuery(route.params.user_id, role) pour récupérer le profile selon l'id et le role de l'user
 * Coté serveur, si role == 1 alors on precharge la relation petsitter aux données
 * Ensuite on fais la condition pour afficher le profil selon currentUser :
 * const currentUser = user.id === profile.user_id
 */

const ProfileScreen = ({ navigation, route }: IRootStackProps<'Profile'>) => {
	const { data: user, isLoading, isError, refetch } = useGetUserQuery();
	const { width } = Dimensions.get('screen');
	const scrollRef = useRef<Animated.ScrollView>() as React.RefObject<Animated.ScrollView>;
	const bottomSheetRef = useRef<BottomSheet>(null);
	const snapPoints = useMemo(() => ['20%'], []);
	const indexMapping: Record<number, TabIndex> = {
		0: TabIndex.Zero,
		1: TabIndex.One,
		2: TabIndex.Two,
	};
	const [imageLoading, setImageLoading] = useState<boolean>(true);
	const [index, setIndex] = useState(route.params && indexMapping[route.params.tabIndex] || 0);
	const [routes] = useState([
		{ key: 'profil', title: 'Profil' },
		{ key: 'animals', title: 'Mes animaux' },
		{ key: 'favorites', title: 'Favoris' }
	]);
	const opacity = useRef(new Anim.Value(0)).current;
	const { handleUpload } = useUpload();
	const dispatch = useDispatch();

	const handleSetTabsIndex = useCallback(() => {
		if (route.params && route.params.tabIndex) {
			setIndex(route.params.tabIndex)
		}
	}, [route])

	useEffect(() => handleSetTabsIndex(), [handleSetTabsIndex])

	useTouchTracker(() => {
		bottomSheetRef.current && bottomSheetRef.current.close();
	})

	const handleFadeIn = useCallback(() => {
		if (user && (user.profile.avatar_url || user.profile.cover_url)) {
			Image.prefetch(Api+'/static/'+user.profile.avatar_url).then(() => {
				setImageLoading(false)
				Anim.timing(opacity, {
					toValue: 1,
					duration: 400,
					delay: 200,
					useNativeDriver: true,
					easing: Easing.inOut(Easing.ease)
				}).start();
			})
		}
	}, [user, opacity])

	useEffect(() => handleFadeIn(), [handleFadeIn])

	const duration = 300;
	const animConfig = {
		duration,
		easing: Easing.inOut(Easing.ease)
	}

	const lastContentOffset = useSharedValue(100);
	const isScrolling = useSharedValue(false);
	const headerY = useSharedValue(0);
	const avatarXY = useSharedValue(1);
	const avatarY = useSharedValue(-65);
	const avatarX = useSharedValue(0);
	const usernameX = useSharedValue(0);
	const usernameY = useSharedValue(0);
	const widthUsername = useDerivedValue(() => usernameX.value === 95 ? withTiming(width - 120) : withTiming(width));

	const handleInitialValues = () => {
		headerY.value = 0;
		avatarXY.value = 1;
		avatarY.value = -65;
		avatarX.value = 0;
		usernameX.value = 0;
		usernameY.value = 0;
	}

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			if (event.contentOffset.y <= 0 || event.contentOffset.y < 0 && isScrolling.value) {
				runOnJS(handleInitialValues)()
			} else if (lastContentOffset.value < event.contentOffset.y && isScrolling.value) {
				headerY.value = -176;
				avatarXY.value = .7;
				avatarY.value = -21;
				avatarX.value = -24;
				usernameX.value = 95;
				usernameY.value = -35;
			}
			lastContentOffset.value = event.contentOffset.y;
		},
		onBeginDrag: () => {
			isScrolling.value = true;
		},
		onEndDrag: () => {
			isScrolling.value = false;
		}
	});

	const headerAnim = useAnimatedStyle(() => {
		return {
			transform: [{translateY: withTiming(headerY.value, animConfig)}]
		};
	});
	const avatarAnim = useAnimatedStyle(() => {
		return {
			transform: [
				{scale: withTiming(avatarXY.value, animConfig)},
				{translateY: withTiming(avatarY.value, animConfig)},
				{translateX: withTiming(avatarX.value, animConfig)}
			]
		};
	});
	const usernameAnim = useAnimatedStyle(() => {
		return {
			transform: [
				{translateX: withTiming(usernameX.value, animConfig)},
				{translateY: withTiming(usernameY.value, animConfig)}
			]
		}
	})

	const renderScene = (route: {key: string, title: string}) => {
		return (
			route.key === 'profil' ? (
				<TabHome scroll={scrollHandler} scrollRef={scrollRef}/>
			) : route.key === 'animals' ? (
				<TabAnimals navigation={navigation} scroll={scrollHandler} scrollRef={scrollRef}/>
			) : route.key === 'favorites' ? (
				<TabFavorites navigation={navigation} scroll={scrollHandler} scrollRef={scrollRef}/>
			) : null
		)
	};

	const handleChangeTab = () => {
		handleInitialValues()
		scrollRef.current && scrollRef.current.scrollTo({
			y: 0,
			animated: true
		})
	}

	const handleBottomSheetOpen = useCallback(() => {
		bottomSheetRef.current && bottomSheetRef.current.collapse();
	}, [bottomSheetRef]);

	const handleError = useCallback(() => {
		if (!isError) {
			refetch()
		}
	}, [isError])

	useEffect(() => handleError(), [handleError])

	const handlePhotos = async (name: string, type: IUploadType) => {
		bottomSheetRef.current && bottomSheetRef.current.forceClose()
		haptic('impactLight')
		const images = await handleUpload(type);

		for (let image of images) {
			handleAvatarCoverUpdate(name, image.path)
		}
	}

	const handleAvatarCoverUpdate = useCallback((name: string, path: string | undefined) => {
		const formData = [];
		const isAvatar = name === 'avatar_url'

		if (path) {
			formData.push({ name: isAvatar ? 'avatar' : 'cover', data: RNFetchBlob.wrap(path), filename: isAvatar ? 'avatar_tmp.jpg' : 'cover_tmp.jpg', type: 'image/jpg' })

			setCoverAvatar(formData).then(() => {
				dispatch(usersApi.util.invalidateTags(['User']));
			})
		}
	}, [usersApi])

	return (
		<ScreenLayout profileLayout classNames="flex-1" statusBarStyle="light-content">
			<View>
				{
					isLoading && imageLoading ? (
						<SkeletonRect widthRect={width} heightRect={224} colorContainer="#cbd5e1" colorGradient={{ center: '#f1f5f9', between: '#cbd5e1' }}/>
					) : (
						user && user.profile.cover_url ? (
							<Anim.Image source={{uri: Api+'/static/'+user.profile.cover_url+'?='+new Date().getMilliseconds(), cache: 'reload'}} style={{opacity}} resizeMode="cover" className="w-full h-56"/>
						) : (
							<LinearGradient colors={['#94a3b8', Theme.colors.default]} className="w-full h-56"/>
						)
					)
				}
			</View>
			<Animated.View className="bg-white shadow w-full p-3" style={[{ height: 178 }, headerAnim]}>
				<Animated.View style={avatarAnim} className="bg-white border-4 border-white items-center justify-center z-10 shadow h-[115px] w-[115px] rounded-full">
					{
						isLoading && imageLoading ? (
							<View className="border-4 border-white rounded-full">
								<SkeletonCircle widthCicle={107} heightCircle={107} colorContainer="#cbd5e1" colorGradient={{ center: '#f1f5f9', between: '#cbd5e1' }}/>
							</View>
						) : (
							user && user.profile.avatar_url ? (
								<Anim.Image source={{uri: Api+'/static'+user.profile.avatar_url+'?='+new Date().getMilliseconds(), cache: 'reload'}} style={{opacity}} resizeMode="cover" className="rounded-full h-full w-full"/>
							) : (
								<SvgIcon viewBox="0 0 24 24" className="h-32 w-32 fill-slate-300">
									<AvatarIcon/>
								</SvgIcon>
							)
						)
					}
				</Animated.View>
				<View className="flex-row" style={{ transform: [{ translateY: -58 }] }}>
					{
						isLoading ? (
							<SkeletonRect heightRect={30} radius={30} marginTop={9.5} marginBottom={4} widthRect="100%" colorContainer="#cbd5e1" colorGradient={{ center: '#f1f5f9', between: '#cbd5e1' }}/>
						) : (
							<View>
								<Animated.Text
									numberOfLines={1}
									ellipsizeMode="tail"
									className="text-darkText font-semibold text-[22px] text-ellipsis overflow-hidden"
									style={[{width: widthUsername, flexShrink: 1}, usernameAnim]}>
									{ user && user.profile.firstname.cap()+' '+user.profile.name.cap() }
								</Animated.Text>
								<Animated.Text
									className="text-darkText font-semibold"
									style={[{width: widthUsername, flexShrink: 1}, usernameAnim]}>
									{ user ? user.profile.role == RoleEnum.PETOWNER ? 'Propriétaire' : user && user.profile.role == RoleEnum.PETSITTER ? 'Pet-sitter' : '' : '' }
								</Animated.Text>
							</View>
						)
					}
				</View>
				<View className="mt-4 flex-row justify-between" style={{ transform: [{ translateY: -60 }] }}>
					<Pressable onPress={() => navigation.navigate('ProfileUpdate')} className="bg-primary flex-row items-center justify-center rounded-lg h-10 py-2 w-[83%]">
						<SvgIcon height={24} width={24} className="fill-white mr-1" viewBox="0 0 24 24">
							<EditIcon/>
						</SvgIcon>
						<Text className="text-white text-base text-center font-medium">Modifier le profil</Text>
					</Pressable>
					<Pressable onPress={handleBottomSheetOpen} className="bg-slate-600 items-center justify-center rounded-lg h-10 py-2 w-[15%]">
						<SvgIcon height={28} width={28} className="fill-white" viewBox="0 0 24 24">
							<PhotoIcon/>
						</SvgIcon>
					</Pressable>
				</View>
			</Animated.View>
			<Animated.View className="flex-1" style={headerAnim}>
				<TabView
					style={{marginBottom: -50}}
					navigationState={{ index, routes }}
					renderScene={({ route }) => renderScene(route)}
					onIndexChange={(index) => setIndex(index)}
					onSwipeStart={handleChangeTab}
					initialLayout={{ width }}
					swipeEnabled={false}
					renderTabBar={(props) =>
						<View className="bg-white shadow z-10">
							<TabBar
								{ ...props }
								onTabPress={handleChangeTab}
								renderIndicator={(props) => <TabBarIndicator {...props} />}
								style={profileStyles.tabBar}
								indicatorStyle={profileStyles.indicator}
								activeColor={Theme.colors.primary}
								labelStyle={profileStyles.label}/>
						</View>}
				/>
			</Animated.View>
			<BottomSheet
				enablePanDownToClose
				bottomInset={140}
				detached
				backgroundStyle={profileStyles.bottomSheetBackground}
				enableOverDrag={false}
				handleIndicatorStyle={profileStyles.bottomSheetIndicator}
				style={profileStyles.bottomSheet}
				ref={bottomSheetRef}
				index={-1}
				snapPoints={snapPoints}>
				<View className="flex-1 px-4">
					<Pressable onPress={() => handlePhotos('cover_url', 'cover')} className="flex-row rounded-full items-center py-2 px-3 mb-4 mt-2" style={{backgroundColor: 'rgba(255, 255, 255, .2)'}}>
						<View className="h-9 w-9 items-center justify-center mr-3">
							<SvgIcon viewBox="0 0 24 24" className="fill-slate-100" height={36} width={36}>
								<CoverIcon/>
							</SvgIcon>
						</View>
						<Text className="text-white font-medium text-[15px]">Modifier votre photo de couverture</Text>
					</Pressable>
					<Pressable onPress={() => handlePhotos('avatar_url', 'avatar')} className="flex-row rounded-full items-center py-2 px-3" style={{backgroundColor: 'rgba(255, 255, 255, .2)'}}>
						<View className="h-9 w-9 items-center justify-center mr-3">
							<SvgIcon viewBox="0 0 24 24" className="fill-slate-100" height={36} width={36}>
								<AvatarIcon/>
							</SvgIcon>
						</View>
						<Text className="text-white font-medium text-[15px]">Modifier votre avatar</Text>
					</Pressable>
				</View>
			</BottomSheet>
		</ScreenLayout>
	);
};

export default ProfileScreen;
