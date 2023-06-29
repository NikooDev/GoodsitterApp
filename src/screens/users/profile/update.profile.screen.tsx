import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DatePicker from 'react-native-date-picker';
import BottomSheet from '@gorhom/bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import Theme from '@Asset/theme';
import { Easing } from 'react-native-reanimated';
import { profileStyles } from '@Constant/styles';
import { Alert, Dimensions, Image, Pressable, TextInput, View, Animated, ScrollView } from 'react-native';
import { useGetUserQuery, usersApi, useSetUserMutation } from '@Service/api/users.api';
import { Api } from '@Config/api';
import { IRootStackProps } from '@Type/stack';
import { IUserUpdate } from '@Type/users';
import RNFetchBlob from 'react-native-blob-util';
import { AvatarIcon, CoverIcon, PhotoIcon } from '@Component/icons';
import { SkeletonCircle, SkeletonRect } from '@Component/loader/skeletons';
import { setCoverAvatar } from '@Action/upload.action';
import { useDispatch } from 'react-redux';
import { useTouchTracker } from 'react-native-touch-tracker';
import { haptic } from '@Helper/functions';
import useUpload, { IUploadType } from '@Hook/useUpload';
import SvgIcon from '@Component/icons/svg';
import ScreenLayout from '@Component/layouts/screen.layout';
import Text from '@Component/ui/text';

const UpdateProfileScreen = ({ navigation }: IRootStackProps<'ProfileUpdate'>) => {
	const [userMutate, setUserMutate] = useState<IUserUpdate>()
	const [openBirthday, setOpenBirthday] = useState<boolean>(false);
	const [birthdayString, setBirthdayString] = useState<string>('')
	const [imageLoading, setImageLoading] = useState<boolean>(true);
	const snapPoints = useMemo(() => ['20%'], []);
	const { data: user, isLoading } = useGetUserQuery()
	const [setUser] = useSetUserMutation()
	const width = Dimensions.get('screen').width
	const opacity = useRef(new Animated.Value(0)).current
	const { handleUpload } = useUpload();
	const bottomSheetRef = useRef<BottomSheet>(null);
	const dispatch = useDispatch()

	const numero = user && user.profile.street.split(" ")[0];
	const street = user && numero && user.profile.street.substring(numero.length + 1);

	const handleFadeIn = useCallback(() => {
		if (user && (user.profile.avatar_url || user.profile.cover_url)) {
			Image.prefetch(Api+'/static/'+user.profile.avatar_url).then(() => {
				setImageLoading(false)
				Animated.timing(opacity, {
					toValue: 1,
					duration: 200,
					delay: 200,
					useNativeDriver: true,
					easing: Easing.inOut(Easing.ease)
				}).start();
			})
		}
	}, [user, opacity])

	useEffect(() => handleFadeIn(), [handleFadeIn])

	const handleFormatBirthday = (): { newDate: Date } => {
		let newDate: Date = new Date()

		if (user) {
			const currentBirthday: string = user.profile.birthday;
			const mots: string[] = currentBirthday.split(" ");
			const jour: string = mots[0];
			const mois: string = mots[1];
			const annee: string = mots[mots.length - 1];

			newDate = new Date(
				Date.UTC(Number(annee), getNumeroMois(mois) - 1, Number(jour))
			);

			function getNumeroMois(mois: string): number {
				const moisEnMinuscules: string = mois.toLowerCase();
				const moisEnNumerique: { [key: string]: number } = {janvier: 1, février: 2, mars: 3, avril: 4, mai: 5, juin: 6, juillet: 7, août: 8, septembre: 9, octobre: 10, novembre: 11, décembre: 12};
				return moisEnNumerique[moisEnMinuscules];
			}
		}

		return {
			newDate
		}
	}

	useEffect(() => {
		if (user) {
			setBirthdayString(user.profile.birthday)
		}
	}, [user])

	const handleConfirmBirthday = (date: Date) => {
		const day = date.toLocaleString('fr', { timeZone: 'Europe/Paris', day: 'numeric' });
		const month = date.toLocaleString('fr', { timeZone: 'Europe/Paris', month: 'long' });
		const year = date.toLocaleString('fr', { timeZone: 'Europe/Paris', year: 'numeric' });
		let age = new Date().getFullYear() - date.getFullYear();

		if (new Date().getMonth() < date.getMonth() ||
			(new Date().getMonth() == date.getMonth() && new Date().getDate() < date.getDate())) {
			age--;
		}

		if (age <= 18) {
			setOpenBirthday(false);
			return Alert.alert('Vous devez indiquer une date de naissance valide', '', [
				{ text: 'Ok', onPress: () => setOpenBirthday(true) }
			])
		}

		userMutate && setUserMutate({ ...userMutate, birthday: day+' '+month+' '+year });
		setBirthdayString(day+' '+month+' '+year)
		setOpenBirthday(false);
	}

	const handleBottomSheetOpen = useCallback(() => {
		bottomSheetRef.current && bottomSheetRef.current.collapse();
	}, [bottomSheetRef]);

	useTouchTracker(() => {
		bottomSheetRef.current && bottomSheetRef.current.close();
	})

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

	const handleSubmit = () => {
		//setUser()
	}

	return (
		<ScreenLayout classNames="flex-col" statusBarStyle="light-content">
			<ScrollView contentContainerStyle={{ paddingBottom: 50 }} contentInset={{ bottom: 0 }}>
				<View className="px-5 py-5">
					{
						isLoading && imageLoading ? (
							<SkeletonRect widthRect={width} heightRect={224} colorContainer="#cbd5e1" colorGradient={{ center: '#f1f5f9', between: '#cbd5e1' }}/>
						) : (
							user && user.profile.cover_url ? (
								<Animated.Image source={{uri: Api+'/static/'+user.profile.cover_url+'?='+new Date().getMilliseconds(), cache: 'reload'}} style={{opacity}} resizeMode="cover" className="w-full h-56 rounded-2xl"/>
							) : (
								<LinearGradient colors={['#94a3b8', Theme.colors.default]} className="w-full h-56"/>
							)
						)
					}
					<View className="flex-row">
						<View className="h-[150px] w-[150px] left-5 -mt-[75px]">
							{
								isLoading && imageLoading ? (
									<View className="border-4 border-white rounded-full">
										<SkeletonCircle widthCicle={107} heightCircle={107} colorContainer="#cbd5e1" colorGradient={{ center: '#f1f5f9', between: '#cbd5e1' }}/>
									</View>
								) : (
									user && user.profile.avatar_url ? (
										<Animated.Image source={{uri: Api+'/static'+user.profile.avatar_url+'?='+new Date().getMilliseconds(), cache: 'reload'}} style={{opacity, borderWidth: 5, borderColor: '#f0f2f5'}} resizeMode="cover" className="rounded-full h-full w-full"/>
									) : (
										<SvgIcon viewBox="0 0 24 24" className="h-32 w-32 fill-slate-300">
											<AvatarIcon/>
										</SvgIcon>
									)
								)
							}
						</View>
						<Pressable onPress={handleBottomSheetOpen} className="bg-slate-600 items-center justify-center rounded-lg h-10 ml-auto mt-3 py-2 w-[15%]">
							<SvgIcon height={28} width={28} className="fill-white" viewBox="0 0 24 24">
								<PhotoIcon/>
							</SvgIcon>
						</Pressable>
					</View>

					<Text className="font-medium text-lg text-slate-800 mt-3">Informations personnelles</Text>
					<View>
						<Text className="mt-3 mb-1 font-medium text-slate-800">Prénom</Text>
						<TextInput className="bg-white shadow p-3 rounded-lg font-text" keyboardType="number-pad" returnKeyType="done"
											 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="Prénom" defaultValue={user && user.profile.firstname.cap()}/>
						<Text className="mt-3 mb-1 font-medium text-slate-800">Nom</Text>
						<TextInput className="bg-white shadow p-3 rounded-lg font-text" returnKeyType="done"
											 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="Nom" defaultValue={user && user.profile.name.cap()}/>
						<Text className="mt-3 mb-1 font-medium text-slate-800">Date de naissance</Text>
						<View>
							<TextInput placeholderTextColor={'rgb(148, 163, 184)'} placeholder="Date de naissance" defaultValue={birthdayString} showSoftInputOnFocus={false} className="bg-white shadow p-3 rounded-lg font-text"/>
							<Pressable onPress={() => setOpenBirthday(true)} className="absolute justify-center items-end h-11 w-full right-0 top-0"/>
						</View>
					</View>
					<View className="mb-5">
						<DatePicker
							modal is24hourSource="device"
							confirmText="Sélectionner"
							minimumDate={new Date('1930-01-01')}
							maximumDate={new Date()} mode="date"
							cancelText="Annuler" title="Date de naissance"
							open={openBirthday} onConfirm={(date) => handleConfirmBirthday(date)}
							onCancel={() => setOpenBirthday(false)}
							date={new Date(handleFormatBirthday().newDate)}/>
					</View>
					<Text className="font-medium text-lg text-slate-800 mt-3">Votre adresse</Text>
					<View className="flex-row justify-between">
						<TextInput className="bg-white shadow p-3 rounded-lg mt-3 w-[20%] font-text" keyboardType="number-pad" returnKeyType="done"
											 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="N°" defaultValue={numero}/>
						<TextInput className="bg-white shadow p-3 rounded-lg mt-3 w-[76.5%] font-text" returnKeyType="done"
											 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="Nom de rue" defaultValue={street}/>
					</View>
					<TextInput className="bg-white shadow p-3 rounded-lg mt-5 font-text" returnKeyType="done"
										 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="Complément d'adresse (facultatif)" defaultValue={user && user.profile.street_complement}/>
					<View className="flex-row justify-between">
						<TextInput className="bg-white shadow p-3 rounded-lg mt-5 w-[33%] font-text" keyboardType="number-pad" returnKeyType="done"
											 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="Code postal" defaultValue={user && user.profile.zip_code}/>
						<TextInput className="bg-white shadow p-3 rounded-lg mt-5 w-[63.5%] font-text" editable={false} returnKeyType="done"
											 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="Ville" defaultValue={user && user.profile.city.cap()}/>
					</View>
					<View className="flex-row items-center justify-between">
						<Pressable onPress={() => navigation.goBack()} className="bg-slate-400 py-3 px-5 mt-5 rounded-full">
							<Text className="text-white font-medium text-base text-center">Annuler</Text>
						</Pressable>
						<Pressable onPress={handleSubmit} className="bg-primary py-3 px-5 mt-5 rounded-full">
							<Text className="text-white font-medium text-base text-center">Modifier le profil</Text>
						</Pressable>
					</View>
				</View>
			</ScrollView>
			<BottomSheet
				enablePanDownToClose
				bottomInset={70}
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

export default UpdateProfileScreen;
