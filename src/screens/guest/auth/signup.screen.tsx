import React, { useCallback, useEffect, useRef, useState } from 'react';
import Theme from '@Asset/theme';
import Carousel from 'react-native-snap-carousel';
import InputScrollView from 'react-native-input-scroll-view';
import Toast from 'react-native-toast-message';
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { Easing, runOnJS, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { stepSignupAddress, stepSignupForm } from '@Screen/guest/auth/signup.fields';
import { ActivityIndicator, Alert, Dimensions, Image, Keyboard, Pressable, TextInput, View } from 'react-native';
import { initialSignup, IGeolocCity, ISignup } from '@Type/auth';
import { IRootStackProps } from '@Type/stack';
import { IRootState } from '@Type/state';
import RNFetchBlob from 'react-native-blob-util';
import { useSelector } from 'react-redux';
import { getCity } from '@Action/geolocation.action';
import { alertServerError, filterAlphabeticCity, haptic, randomLatLng } from '@Helper/functions';
import { Signup } from '@Action/auth.action';
import { BackIcon, FacebookIcon, GoogleIcon, HelpIconCircle, PhotoIcon } from '@Component/icons';
import signupValidator from '@Action/validators/signup.validator';
import ScreenLayout from '@Component/layouts/screen.layout';
import useUpload, { IUploadType } from '@Hook/useUpload';
import SvgIcon from '@Component/icons/svg';
import LogoIcon from '@Component/icons/logo.icon';
import Text from '@Component/ui/text';
import Class from 'classnames';

const SignupScreen = ({ navigation }: IRootStackProps<'Signup'>) => {
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [signup, setSignup] = useState<ISignup>(initialSignup);
	const [zipCode, setZipCode] = useState<string | undefined>(undefined);
	const [suggestionsFocus, setSuggestionsFocus] = useState<boolean>(false);
	const [suggestionsCity, setSuggestionsCity] = useState<IGeolocCity[]>([]);
	const [currentBirthday, setCurrentBirthday] = useState<Date>();
	const [openBirthday, setOpenBirthday] = useState<boolean>(false);
	const [error, setError] = useState<{ field: null | string, message: null | string }>({ field: null, message: null });
	const [errorSubmit, setErrorSubmit] = useState<{ message1: string | undefined, message2: string | undefined }>({ message1: undefined, message2: undefined });
	const [loading, setLoading] = useState<boolean>(false);
	const [loadingCity, setLoadingCity] = useState<boolean>(false);
	const [msgSubmit, setMsgSignup] = useState<string>('Inscription en cours...');
	const [progressDone, setProgressDone] = useState<boolean>(false);
	const carouselRef = useRef<Carousel<any>>(null);
	const inputScrollViewRef = useRef() as React.MutableRefObject<InputScrollView | null>;
	const progress = useSharedValue(0);
	const { app } = useSelector((state: IRootState) => state);
	const { handleUpload } = useUpload();
	const { width } = Dimensions.get('screen');

	/**
	 * Capture la valeur des champs dans le state
	 * @param name
	 * @param value
	 */
	const handleChange = (name: string, value: string) => {
		name === 'zip_code' && setZipCode(value);
		setSignup((prevState) => ({ ...prevState, [name]: value }));
	}

	/**
	 * Récupère la ville selon le code postal
	 */
	const handleGetCity = useCallback(async () => {
		const reg = new RegExp(/^\d+$/);

		if (zipCode && zipCode.length === 5 && Number(reg.test(zipCode))) {
			Keyboard.dismiss();
		}

		if (zipCode && zipCode.length > 0) {
			setSuggestionsFocus(true)
			inputScrollViewRef && inputScrollViewRef.current?.scrollTo({ y: 0, animated: false })
		} else {
			setSuggestionsFocus(false)
			inputScrollViewRef && inputScrollViewRef.current?.scrollTo({ y: 115, animated: false })
		}

		if (zipCode && zipCode.length >= 4) {
			setLoadingCity(true);
			const cities = await getCity(zipCode);

			setLoadingCity(false);
			setSuggestionsCity(cities);
			if (cities.length === 0) {
				setError({ field: 'zip_code', message: 'Ville ou code postal incorrect' });
			}
		} else {
			setSignup({ ...signup, city: undefined });
			setSuggestionsCity([]);
		}

	}, [zipCode]);

	const handleSuggestionsError = useCallback(() => {
		if (suggestionsCity.length !== 0) {
			handleResetError();
			setSuggestionsFocus(true);
		}
	}, [suggestionsCity])

	useEffect(() => handleSuggestionsError(), [handleSuggestionsError]);

	useEffect(() => { handleGetCity().then() }, [handleGetCity]);

	useEffect(() => {
		if (signup.zip_code && error.field === 'zip_code' && error.message) {
			Toast.show({
				type: 'error',
				position: 'top',
				topOffset: 60,
				text1: error.message
			});
		}
	}, [signup, error]);

	/**
	 * Ajout de la ville et du code postal dans le state
	 */
	const handleSetCity = (city: string, zip_code: string, lat: number, lng: number) => {
		haptic('impactLight');
		setSuggestionsCity([]);
		setSuggestionsFocus(false);
		setSignup((prevState) => ({ ...prevState, city, zip_code, latitude: randomLatLng(lat, lng).newLat, longitude: randomLatLng(lat, lng).newLon }));
	}

	/**
	 * Gestion de l'upload
	 * @param name
	 * @param type
	 */
	const handlePhotos = async (name: string, type: IUploadType) => {
		const images = await handleUpload(type);

		for (let image of images) {
			setSignup({ ...signup, [name]: image.path });
		}
	}

	/**
	 * Vérification de la majorité de l'utilisateur
	 */
	const handleConfirmAdult = (date: Date) => {
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
			return Alert.alert('Vous devez être majeur pour vous inscrire sur Goodsitter', '', [
				{ text: 'Ok', onPress: () => setOpenBirthday(true) }
			])
		}

		setSignup({ ...signup, birthday: day+' '+month+' '+year })
		setCurrentBirthday(date);
		setOpenBirthday(false);
	}

	const handleResetError = () => {
		setError({ field: null, message: null });
	}

	const handleHelp = () => Alert.alert('Ville introuvable ?',
		'Si votre ville n\'est pas dans la liste,\ncontactez l\'assistance.', [
		{ text: 'Contactez l\'assistance', style: 'default' },
		{ text: 'OK', style: 'cancel' }
	])

	const handleProgressDone = (isRegistered: boolean) => {
		if (isRegistered) {
			setProgressDone(true);
		} else {
			setLoading(false);
		}
	}

	const handleProgress = (isRegistered: boolean) => {
		setTimeout(() => setMsgSignup('Traitement des données...'), 1300)
		setTimeout(() => setMsgSignup('Wouf !'), 2000)
		progress.value = withTiming(100, {
			duration: 3000,
			easing: Easing.inOut(Easing.cubic)
		}, () => {
			runOnJS(handleProgressDone)(isRegistered);
		})
	}

	const animatedProgress = useAnimatedProps(() => {
		return {
			width: `${progress.value}%`,
		};
	});

	useEffect(() => {
		if (progressDone) {
			setMsgSignup('Redirection...');
			setTimeout(() => {
				navigation.popToTop();
				navigation.navigate('Login')
				if (!app.guideDone) {
					navigation.navigate('Guide');
				}
			}, 500)
		}
	}, [progressDone, navigation, app]);

	useEffect(() => {
		if (errorSubmit.message1 && errorSubmit.message1.length !== 0) {
			Toast.show({
				type: 'error',
				position: 'top',
				topOffset: 60,
				text1: errorSubmit.message1,
				text2: errorSubmit.message2
			})
		}
	}, [progressDone, errorSubmit.message1]);

	const handleError = (result: { message: string, field: string }) => {
		if (result.message && result.field) {
			Alert.alert(result.message, '', [
				{ text: 'Ok', style: 'cancel', onPress: () => {
						if (result.field === 'firstname' || result.field === 'name' || result.field === 'birthday' || result.field === 'email' || result.field === 'password') {
							carouselRef.current && carouselRef.current.snapToItem(0)
						} else if (result.field === 'number_street' || result.field === 'street' || result.field === 'zip_code') {
							carouselRef.current && carouselRef.current.snapToItem(1)
						}
					}}
			])
			setError({ ...error, field: result.field, message: result.message })
		}
	}

	/**
	 * Validation / Soumission du formulaire
	 */
	const handleSubmit = async () => {
		const result = signupValidator(signup);

		if (result.message && result.field) {
			return handleError(result)
		}

		if (result.validated) {
			progress.value = 0;
			setMsgSignup('Inscription en cours...');
			setErrorSubmit({ message1: undefined, message2: undefined });

			setProgressDone(false);

			let formData = [];

			let {
				avatar_url, cover_url,
				...rest
			} = signup;

			if (avatar_url) {
				formData.push({ name: 'avatar', data: RNFetchBlob.wrap(avatar_url), filename: 'avatar_tmp.jpg', type: 'image/jpg' })
			}

			if (cover_url) {
				formData.push({ name: 'cover', data: RNFetchBlob.wrap(cover_url), filename: 'cover_tmp.jpg', type: 'image/jpg' })
			}

			formData.push({ name: 'profile', data: JSON.stringify(rest) });

			try {
				const res = await Signup(formData);

				if (res.message1 || res.message2) {
					setLoading(false);
					setErrorSubmit({ message1: res.message1, message2: res.message2 });
					alertServerError();
				} else if (res.error) {
					setLoading(false);
					handleError(res.error)
				} else {
					setLoading(true);
					handleProgress(res.isRegistered);
				}
			} catch (e) {
				setLoading(false);
				alertServerError();
				console.log(e);
			}
		}
	}

	return (
		<ScreenLayout classNames="flex-1 bg-primary items-center" statusBarStyle="light-content">
			{
				loading && (
					<View className="bg-white absolute h-full top-0 left-0 bottom-0 right-0 z-30 justify-center pb-5 px-5">
						<Text title className="font-medium text-primary text-2xl mb-4 text-center">{ msgSubmit }</Text>
						<Animated.View className="bg-primary h-2 rounded-full mt-2" style={animatedProgress}/>
					</View>
				)
			}
			<View className="flex flex-row items-center w-full mb-8 pt-16 justify-center">
				<View className="flex items-center justify-center rounded-full bg-white h-14 w-14 shadow-md">
					<SvgIcon height={37} width={37} fill={Theme.colors.primary} viewBox="0 0 128 128">
						<LogoIcon/>
					</SvgIcon>
				</View>
			</View>
			<View className="flex-1 bg-white w-full rounded-tl-3xl rounded-tr-3xl overflow-hidden">
				<InputScrollView ref={inputScrollViewRef} topOffset={170} scrollEnabled={true} keyboardOffset={80} contentContainerStyle={{paddingBottom: 50}} keyboardShouldPersistTaps="handled" className="pt-5 pb-8">
					<Pressable onPress={() => navigation.goBack()} className="flex flex-row items-center px-5 w-28 py-2 z-10">
						<SvgIcon height={24} width={24} viewBox="0 0 24 24">
							<BackIcon/>
						</SvgIcon>
						<Text className="font-text font-medium text-darkText ml-1 tracking-tight">Annuler</Text>
					</Pressable>
					<Text className="mx-auto font-medium text-lg mt-2">Créer un compte</Text>
					<Carousel
						ref={carouselRef} itemWidth={width} onScrollIndexChanged={(index) => setCurrentIndex(index)}
						containerCustomStyle={{marginVertical: 'auto'}} contentContainerCustomStyle={{justifyContent: 'center'}}
						sliderWidth={width} scrollEnabled={false} data={[{}, {}, {}]} vertical={false} renderItem={({ index }) => (
							<View className="flex-1 justify-between mt-3">
								{
									/**
									 * Profil
									 */
									index === 0 && (
										stepSignupForm.map((step, stepIndex) =>
											<View key={stepIndex}>
												<TextInput
													keyboardType={step.keyboardType}
													placeholder={step.fieldName}
													placeholderTextColor={error.field === step.field ? '#ef4444' : '#919bb2'}
													textContentType={step.textContentType}
													autoCapitalize={step.capitalize ? 'none' : undefined}
													secureTextEntry={step.secure}
													returnKeyType="next"
													cursorColor="#1e293b"
													selectionColor="#536281"
													textAlignVertical="center"
													spellCheck={false}
													onChangeText={(value) => handleChange(step.field, value)}
													showSoftInputOnFocus={step.field !== 'birthday'}
													onFocus={handleResetError}
													value={step.field === 'birthday' ? signup.birthday : signup[step.field as keyof ISignup]?.toString()}
													className={Class(
														step.marginBottom ? 'mb-6' : 'mb-3',
														error.field === step.field ? 'text-[#ef4444] border-red-500 border-b-2 focus:border-red-500 focus:text-red-500' : 'focus:border-primary focus:text-primary text-[#404346] border-gray-200 border-b-2',
														'h-[45px] w-full font-text tracking-tight py-0 px-5 text-[17px]',
													)}/>
												{ step.field === 'birthday' && (
													<Pressable onPress={() => setOpenBirthday(true)} className="absolute justify-center items-end h-11 w-full right-0 top-0"/>
												) }
											</View>
										)
									)
								}

								{
									/**
									 * Adresse
									 */
									index === 1 && (
										<View>
											<Text className="font-medium text-center text-slate-500 mb-3">Votre adresse sera visible par le pet-sitter{'\n'}uniquement en cas de service à domicile.</Text>
											{
												stepSignupAddress.map((step, stepIndex) =>
													<View key={stepIndex}>
														<TextInput
															keyboardType={step.keyboardType}
															placeholder={step.fieldName}
															placeholderTextColor={error.field === step.field ? '#ef4444' : '#919bb2'}
															textContentType={step.textContentType}
															returnKeyType={step.field === 'zip_code' ? 'done' : 'next'}
															cursorColor="#1e293b"
															selectionColor="#536281"
															textAlignVertical="center"
															spellCheck={false}
															editable={step.field !== 'city'}
															onFocus={handleResetError}
															onChangeText={(value) => handleChange(step.field, value)}
															showSoftInputOnFocus={step.field !== 'city'}
															value={signup[step.field as keyof ISignup]?.toString()}
															className={Class(
																step.marginBottom ? 'mb-6' : 'mb-3',
																step.field === 'city' && !signup.city && 'hidden',
																suggestionsFocus && step.field !== 'zip_code' && 'hidden',
																error.field === step.field ? 'text-[#ef4444] border-red-500 border-b-2 focus:border-red-500 focus:text-red-500' : 'text-[#404346] border-gray-200 border-b-2 focus:border-primary focus:text-primary',
																'h-[45px] w-full font-text tracking-tight py-0 px-5 text-[17px]')}/>
														{
															step.field === 'zip_code' && loadingCity && (
																<ActivityIndicator color={Theme.colors.primary} className="absolute right-5 top-2"/>
															)
														}
														{
															step.field === 'zip_code' && suggestionsCity.length !== 0 && (
																<View className="bg-white ml-3 z-10" style={{width: width - 24}}>
																	<View className="flex-1 mb-2 px-2">
																		<View className="flex-row justify-between items-center mb-5">
																			<View>
																				<Text className="font-medium text-[15px] text-slate-800">Choisissez votre ville :</Text>
																				<Text className="text-slate-500 text-[14px]">Affichée par ordre alphabétique</Text>
																			</View>
																			<Pressable className="mr-1 mt-0.5" onPress={handleHelp}>
																				<SvgIcon viewBox="0 0 24 24" height={32} width={32} className="fill-slate-700">
																					<HelpIconCircle/>
																				</SvgIcon>
																			</Pressable>
																		</View>
																		{
																			filterAlphabeticCity(suggestionsCity).map((city, index) => (
																				<Pressable key={index} onPress={() => handleSetCity(city.placeName, city.postalCode, city.lat, city.lng)} className="py-3.5 px-5 bg-slate-200 mb-3 rounded-2xl">
																					<Text className="text-primary font-medium">{ city.placeName } - { city.postalCode }</Text>
																				</Pressable>
																			))
																		}
																	</View>
																</View>
															)
														}
													</View>
												)
											}
										</View>
									)
								}

								{
									suggestionsCity.length === 0 && signup.zip_code && signup.zip_code.length > 0 && signup.zip_code && signup.zip_code.length < 4 &&
									<View className="mb-2 mx-5 mt-1.5">
										<Text className="font-medium text-[15px] text-slate-800">4 caractères minimum</Text>
										<Text className="font-medium text-xs text-slate-400">Pour les noms de villes inférieures à 4 caractères,{'\n'}utilisez votre code postal.</Text>
									</View>
								}

								{
									/**
									 * Avatar + Cover
									 */
									index === 2 && (
										<View className="mb-5 px-5">
											<Text className="font-medium text-center mb-3 text-slate-500">Personnalisez votre profil en ajoutant votre{'\n'}avatar et une photo de couverture.</Text>
											<View className="flex justify-center items-center">
												<LinearGradient colors={['#94a3b8', '#fff']} className="w-full rounded-2xl h-48"/>
												<Pressable onPress={() => handlePhotos('cover_url', 'cover')} className="absolute left-0 bottom-0 right-0 top-0 justify-center items-center">
													{
														signup.cover_url ? (
															<Image source={{ uri: signup.cover_url }} resizeMode="cover" className="h-48 w-full rounded-2xl"/>
														) : (
															<SvgIcon viewBox="0 0 24 24" className="h-14 w-14 fill-white">
																<PhotoIcon/>
															</SvgIcon>
														)
													}
												</Pressable>
											</View>
											<Pressable onPress={() => handlePhotos('avatar_url', 'avatar')} className="bg-white border-4 border-white items-center justify-center z-10 shadow h-[115px] w-[115px] rounded-full -mt-14 ml-5">
												{
													signup.avatar_url ? (
														<Image source={{ uri: signup.avatar_url }} resizeMode="cover" className="h-[107px] w-[107px] rounded-full"/>
													) : (
														<SvgIcon viewBox="0 0 24 24" className="h-14 w-14 fill-slate-300">
															<PhotoIcon/>
														</SvgIcon>
													)
												}
											</Pressable>
										</View>
									)
								}

								<View className={Class('flex-row flex-1 justify-start mt-2 px-5 mb-10', index === 2 && 'mt-3')}>
									{
										index > 0 && (
											<Pressable disabled={suggestionsCity.length !== 0} onPress={() => carouselRef.current && carouselRef.current.snapToItem(currentIndex - 1)} className={Class('flex items-center justify-center bg-slate-500 w-1/3 rounded-full h-12', suggestionsCity.length !== 0 && 'opacity-70')}>
												<Text className="text-white text-base font-medium font-text tracking-tight">Retour</Text>
											</Pressable>
										)
									}
									{
										index >= 0 && index <= 1 && (
											<Pressable disabled={suggestionsCity.length !== 0} onPress={() => carouselRef.current && carouselRef.current.snapToItem(currentIndex + 1)} className={Class('flex items-center justify-center ml-auto bg-primary w-1/3 rounded-full h-12 disabled:opacity-60', suggestionsCity.length !== 0 && 'opacity-70')}>
												<Text className="text-white text-base font-medium font-text tracking-tight">Suivant</Text>
											</Pressable>
										)
									}
									{
										index === 2 && (
											<Pressable onPress={handleSubmit} className="flex items-center justify-center ml-auto bg-primary w-1/2 rounded-full h-12 disabled:opacity-60">
												<Text className="text-white text-base font-medium font-text tracking-tight">S'inscrire</Text>
											</Pressable>
										)
									}
								</View>
								<View className="w-full px-5 mb-5">
									{
										index === 0 && (
											<>
												<Pressable className="flex flex-row items-center bg-[#3b5998] rounded-full h-10 px-[5px] w-full mb-3 pl-1.5">
													<SvgIcon height={28} width={28} fill="#fff" viewBox="0 0 24 24">
														<FacebookIcon/>
													</SvgIcon>
													<Text className="ml-4 text-white font-semibold font-text mx-auto tracking-tight">S'inscrire avec Facebook</Text>
												</Pressable>
												<Pressable className="flex flex-row items-center bg-red-500 rounded-full h-10 px-[5px] w-full mb-3 pl-1.5">
													<View className="justify-center items-center bg-white h-[28px] w-[28px] rounded-full left-0">
														<SvgIcon height={20} width={20} fill="#fff" viewBox="0 0  186.69 190.5">
															<GoogleIcon/>
														</SvgIcon>
													</View>
													<Text className="ml-4 text-white font-semibold font-text mx-auto tracking-tight">S'inscrire avec Google</Text>
												</Pressable>
											</>
										)
									}
									<Pressable onPress={() => navigation.navigate('Login')} className="bg-white border-2 border-[#404346] items-center justify-center rounded-3xl w-full h-10">
										<Text className="text-darkText text-base font-text font-semibold tracking-tight">Déjà inscrit ?</Text>
									</Pressable>
								</View>
							</View>
					)}/>
				</InputScrollView>
			</View>
			<DatePicker
				modal is24hourSource="device"
				confirmText="Sélectionner"
				minimumDate={new Date('1930-01-01')}
				maximumDate={new Date()} mode="date"
				cancelText="Annuler" title="Date de naissance"
				open={openBirthday} onConfirm={(date) => handleConfirmAdult(date)}
				onCancel={() => setOpenBirthday(false)}
				date={currentBirthday ? currentBirthday : new Date('2000-01-01')}/>
		</ScreenLayout>
	)
}

export default SignupScreen
