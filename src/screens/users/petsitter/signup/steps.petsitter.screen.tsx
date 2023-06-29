import React, { useCallback, useEffect, useRef, useState } from 'react';
import Theme from '@Asset/theme';
import {
	ActivityIndicator,
	Alert, Dimensions,
	Pressable,
	View
} from 'react-native';
import {
	BaseProfilePetsitterTab,
	DetailsProfilePetsitterTab,
	PhotosProfilePetsitterTab,
	IdentityPetsitterTab,
	ServicesPetsitterTab
} from './tabs/index';
import InputScrollView from 'react-native-input-scroll-view';
import { RoleEnum } from '@Type/profile';
import { useGetUserQuery, useSetUserMutation } from '@Service/api/users.api';
import { initialPetsitter,
	IHandleChangeValue,
	IPetsitter,
	IPetsitterSubSubFields } from '@Type/petsitter';
import RNFetchBlob from 'react-native-blob-util';
import { ViewRef } from '@Type/app';
import { IRootStackProps } from '@Type/stack';
import { EventArg } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import Animated, { Easing, runOnJS, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { getStorage, removeStorage, setStorage } from '@Helper/storage';
import { ResetIcon } from '@Component/icons/actions';
import { createPetsitter } from '@Action/petsitter.action';
import { alertServerError } from '@Helper/functions';
import Text from '@Component/ui/text';
import Class from 'classnames';
import SvgIcon from '@Component/icons/svg';
import LoaderUpload from "@Component/loader/loaderUpload";
import petsitterValidator from '@Action/validators/petsitter.validator';
import ScreenLayout from '@Component/layouts/screen.layout';

const StepsPetsitterScreen = ({ navigation }: IRootStackProps<'PetsitterSteps'>) => {
	const [page, setPage] = useState<number>(0);
	const [petsitter, setPetsitter] = useState<IPetsitter>(initialPetsitter);
	const [loading, setLoading] = useState<boolean>(false);
	const [progressDone, setProgressDone] = useState<boolean>(false);
	const [startProgress, setStartProgress] = useState<boolean>(false);
	const [msgLoading, setMsgLoading] = useState<string>('Profil en cours de création...');
	const [error, setError] = useState<{ field: null | string, message: null | string }>({ field: null, message: null });
	const animateRef = useRef<Animatable.View & View & ViewRef>(null);
	const scrollRef = useRef<InputScrollView>() as React.MutableRefObject<InputScrollView>;
	const [setUser] = useSetUserMutation();
	const { data: user } = useGetUserQuery()
	const { width } = Dimensions.get('screen')
	const progress = useSharedValue(0);
	const duration = 200;

	/**
	 * Si un storage existe => inclut dans le state
	 * Sinon on supprime l'ancienne sauvegarde
	 */
	const handleReadyStorage = useCallback(async () => {
		const storage = await getStorage('petsitterProfile')

		if (storage) {
			const storagePetsitter = JSON.parse(storage as string)
			setPetsitter(storagePetsitter)
		} else {
			await removeStorage('petsitterProfile')
		}
	}, [])

	useEffect(() => {
		handleReadyStorage().then()
	}, [handleReadyStorage])

	/**
	 * Sauvegarde du state dans le storage du téléphone après sorti du screen
	 * Seule les photos ne sont pas stockées dans async-storage pour le moment.
	 * Le rebuild avec Xcode ou une mise à jour de l'application publiée supprimerai les fichiers temporaires.
	 * Pour stocker les photos qui ont été uploadées, il faut un stockage temporaire côté serveur.
	 * A la soumission du formulaire -> suppression de l'avatar temporaire par le définitif.
	 */
	const handleSaveStorage = useCallback(async () => {
		const { avatar, ...rest } = petsitter
		await setStorage('petsitterProfile', JSON.stringify(rest))
	}, [petsitter])

	useEffect(() => {
		navigation.addListener('beforeRemove', handleSaveStorage)

		return () => {
			navigation.removeListener('beforeRemove', handleSaveStorage)
		}
	}, [navigation, handleSaveStorage])

	/**
	 * Confirmation avant de quitter le focus sur le screen
	 */
	const handleConfirm = useCallback((event: EventArg<'beforeRemove', true, {action: Readonly<{type: string, payload?: object | undefined, source?: string | undefined, target?: string | undefined}>}>) => {
		event.preventDefault()
		Alert.alert(
			'Voulez-vous vraiment annuler ?',
			'Votre progression sera sauvegardée.',
			[
				{ text: 'Continuer', style: 'cancel', onPress: () => {} },
				{
					text: 'Annuler',
					style: 'destructive',
					onPress: () => {
						navigation.dispatch(event.data.action);
					},
				},
			]
		);
	}, [navigation])

	useEffect(() => {
		if (!progressDone) {
			navigation.addListener('beforeRemove', handleConfirm)
		}

		return () => {
			navigation.removeListener('beforeRemove', handleConfirm)
		}
	}, [progressDone, navigation, handleConfirm])

	/**
	 * Fonction générique de modification du state d'inscription Petsitter
	 * Utilisation de clé d'objet pour faire les conditions
	 * @param value
	 * @param name
	 * @param subName
	 * @param subSubName
	 */
	const handleChange = (
		value: IHandleChangeValue,
		name: keyof IPetsitter,
		subName?: string,
		subSubName?: IPetsitterSubSubFields) => {

		const updatedPetsitter = {
			...petsitter,
			[name]: subName
				? { ...(petsitter[name] as object), [subName]: subSubName
					? { ...(petsitter[name]![subName] as object), [subSubName]: value }
					: value }
				: value
		}

		setPetsitter(updatedPetsitter)
	}

	const handleResetError = () => {
		setError({ field: null, message: null })
	}

	/**
	 * Initialise le state avec l'adresse e-mail et l'adresse de l'utilisateur
	 */
	const handleInit = useCallback(() => {
		if (user) {
			const fullStreet = user.profile.street
			const numero = fullStreet && fullStreet.split(" ")[0];
			const street = fullStreet && numero && fullStreet.substring(numero.length + 1);
			const address = { number_street: numero, street_name: street, zip: user.profile.zip_code, city: user.profile.city.cap(), address_comp: user.profile.street_complement }

			setPetsitter({ ...initialPetsitter, address, email: user.email, phone: user.profile.phone_num })
		}
	}, [user])

	useEffect(() => handleInit(), [handleInit])

	/**
	 * Tabs
	 */
	const handlePages = useCallback(() => {
		switch (page) {
			case 0:
				return <BaseProfilePetsitterTab petsitter={petsitter} handleChange={handleChange} error={error} scrollRef={scrollRef} setError={() => handleResetError()} user={user}/>;
			case 1:
				return <DetailsProfilePetsitterTab petsitter={petsitter} handleChange={handleChange} error={error} setError={() => handleResetError()}/>;
			case 2:
				return <PhotosProfilePetsitterTab petsitter={petsitter} handleChange={handleChange} error={error} setError={() => handleResetError()}/>;
			case 3:
				return <ServicesPetsitterTab petsitter={petsitter} handleChange={handleChange} error={error} setError={() => handleResetError()}/>;
			case 4:
				return <IdentityPetsitterTab petsitter={petsitter} handleChange={handleChange} error={error} setError={() => handleResetError()}/>;
		}
	}, [petsitter, page]);

	/**
	 * Tab suivante
	 */
	const handleNext = () => {
		if (animateRef && animateRef.current) {
			animateRef.current.animate('fadeOutLeft');
			setTimeout(() => {
				animateRef.current && animateRef.current.animate('fadeInRight');
				setPage((prevPage) => prevPage + 1);
				scrollRef.current && scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
			}, duration);
		}
	};

	/**
	 * Tab précédente
	 * Tab personnalisée en fonction de l'erreur (redirection + scroll)
	 * @param returnPage
	 * @param scroll
	 */
	const handleBack = (returnPage?: number, scroll?: string) => {
		if (animateRef && animateRef.current) {
			animateRef.current.animate('fadeOutRight');
			if (returnPage) {
				setTimeout(() => {
					animateRef.current && animateRef.current.animate('fadeInLeft');
					setPage((prevPage) => prevPage - returnPage)
				}, duration)
				setTimeout(() => {
					scrollRef.current && scrollRef.current.scrollTo({x: 0, y: scroll && scroll.length !== 0 ? Number(scroll) : 0, animated: true})
				}, 300)
			} else {
				setTimeout(() => {
					animateRef.current && animateRef.current.animate('fadeInLeft');
					setPage((prevPage) => prevPage - 1);
					scrollRef.current && scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
				}, duration);
			}
		}
	};

	const handleProgressDone = useCallback((isCreated: boolean) => {
		if (isCreated) {
			setProgressDone(true)
			setUser({ role: RoleEnum.PETSITTER }).then(() => {
				navigation.setOptions({ gestureEnabled: true })
				navigation.goBack()
				navigation.getParent()?.navigate('ConfirmPetsitterScreen')
			})
		} else {
			setLoading(false);
		}
	}, [setUser, navigation])

	const handleProgress = (isRegistered: boolean) => {
		setTimeout(() => setMsgLoading('Traitement des données...'), 1300)
		setTimeout(() => setMsgLoading('Finalisation'), 2000)
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

	/**
	 * Validation et soumission de la candidature
	 */
	const handleSubmit = useCallback(async () => {
		try {
			const result = await petsitterValidator(petsitter)
			const formData = [];
			let index: number = 0

			if (result.validated) {
				progress.value = 0;
				setMsgLoading('Profil en cours de création...')

				// Traitement des photos
				if (petsitter.avatar) {
					if (!petsitter.avatar.includes('static/avatars')) {
						console.log(petsitter.avatar);
						formData.push({ name: 'avatar', data: RNFetchBlob.wrap(petsitter.avatar), filename: 'avatar-name', type: 'image/jpg' })
					}
				}
				if (petsitter.photos) {
					for (let photo of petsitter.photos) {
						index++;
						if (photo.uri) {
							const photoSerialize = photo.uri.replace('file://', '')
							formData.push({ name: 'photos', data: RNFetchBlob.wrap(photoSerialize), filename: 'photo-'+index, type: 'image/jpg' })
						}
					}
				}
				if (petsitter.identity.ci.file[0] && petsitter.identity.ci.file[1]) {
					formData.push(
						{ name: 'ci', data: RNFetchBlob.wrap(petsitter.identity.ci.file[0].path), filename: 'ci-name-recto', type: 'image/jpg' },
						{ name: 'ci', data: RNFetchBlob.wrap(petsitter.identity.ci.file[1].path), filename: 'ci-name-verso', type: 'image/jpg' }
					)
				}
				if (petsitter.identity.permis.file[0]) {
					formData.push({ name: 'permis', data: RNFetchBlob.wrap(petsitter.identity.permis.file[0].path), filename: 'permis-name', type: 'image/jpg' })
				}
				if (petsitter.identity.passeport.file[0]) {
					formData.push({ name: 'passeport', data: RNFetchBlob.wrap(petsitter.identity.passeport.file[0].path), filename: 'passeport-name', type: 'image/jpg' })
				}

				// Traitement du champs other_home_type
				if (!petsitter.other_home_type) {
					setPetsitter({ ...petsitter, other_home_type: undefined })
				}

				// Toutes les autres infos du petsitter
				const {
					avatar, identity, photos,
					...rest
				} = petsitter;

				formData.push({ name: 'petsitter', data: JSON.stringify(rest) });

				try {
					setLoading(true)
					setStartProgress(true)
					const res = await createPetsitter(formData)

					if (res.isCreated) {
						setError({ field: null, message: null })
						setStartProgress(false)
						handleProgress(res.isCreated)
						//setPetsitter(initialPetsitter)
						//await removeStorage('petsitterProfile')
						//handleInit()

					} else {
						alertServerError(() => {
							setLoading(false)
						}, () => {
							setLoading(false)
						});
					}
				} catch (e) {
					alertServerError();
					console.log(e);
				}

				/**
				 * Créer le submit + le traitement serveur
				 * Faire les tests d'inscription petsitter
				 * Ajouter d'autres users petsitters
				 * Commencer la fonctionnalité de recherche de petsitter sur la map
				 *
				 * Finir le screen "Modification du profil"
				 */

			} else {
				result.message && result.message.length !== 0 && Alert.alert(result.title ? result.title : result.message, result.title ? result.message : '', [
					{ text: 'OK', onPress: () => {
							setError({ field: result.field, message: result.message })
							if (result.page && result.page.length !== 0) {
								handleBack(Number(result.page), result.scroll)
							}
						}
					}
				])
			}
		} catch (e) {

		}
	}, [petsitter, progress])

	/**
	 * Réinitialisation du formulaire
	 */
	const handleReset = () => {
		Alert.alert('Voulez-vous vraiment réinitialiser le formulaire ?', '', [
			{ text: 'Continuer', style: 'cancel', onPress: () => {} },
			{
				text: 'Réinitialiser',
				style: 'destructive',
				onPress: async () => {
					setPetsitter(initialPetsitter)
					setError({ field: null, message: null })
					await removeStorage('petsitterProfile')
					handleInit()
				},
			},
		])
	}

	return (
		<ScreenLayout classNames="flex-1" statusBarStyle="light-content">
			{
				loading && (
					<View className="flex-1 absolute h-full bg-white z-50" style={{ width }}>
						<View className="top-64 px-5">
							<Text title className="font-medium text-primary text-2xl mb-4 text-center">{ msgLoading }</Text>
							{
								startProgress ?
									<ActivityIndicator size="large" color={Theme.colors.primary}/> :
									<Animated.View className="bg-primary h-2 rounded-full mt-2" style={animatedProgress}/>
							}
						</View>
					</View>
				)
			}
			<InputScrollView ref={scrollRef} topOffset={170} contentContainerStyle={{paddingBottom: 50}} contentInset={{ bottom: 75 }}>
				<Animatable.View ref={animateRef} duration={duration}>
					{ handlePages() }
				</Animatable.View>
			</InputScrollView>
			<View className="bg-[#f0f2f5] absolute bottom-0 w-full">
				<View className="bg-white shadow h-1 w-full"/>
				<View className={Class('flex flex-row mx-5 mt-5 mb-10')}>
					{
						page > 0 && (
							<Pressable onPress={() => handleBack()} disabled={loading} className="bg-white shadow py-2.5 px-4 rounded-lg">
								<Text className="text-slate-800 text-base font-medium text-center">Retour</Text>
							</Pressable>
						)
					}
					{
						page === 0 && (
							<>
								<Pressable onPress={() => navigation.reset({ routes: [{ name: 'Menu' }] })}
													 className="bg-slate-500 shadow py-2.5 px-4 rounded-lg">
									<Text className="text-white text-base font-medium text-center">Annuler</Text>
								</Pressable>
								<Pressable onPress={handleReset} className="bg-slate-500 shadow py-2.5 px-4 ml-2 rounded-lg">
									<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-white">
										<ResetIcon/>
									</SvgIcon>
								</Pressable>
								<Pressable onPress={handleNext}
													 className="bg-primary shadow py-2.5 px-4 mx-5 w-[49.2%] rounded-lg">
									<Text className="text-white text-base font-medium text-center">Suivant</Text>
								</Pressable>
							</>
						)
					}
					{
						page >= 1 && page <= 3 && (
							<Pressable onPress={handleNext} className="bg-primary shadow py-2.5 px-4 rounded-lg ml-auto">
								<Text className="text-white text-base font-medium text-center">Suivant</Text>
							</Pressable>
						)
					}
					{
						page === 4 && (
							<Pressable onPress={handleSubmit} disabled={loading} className="bg-primary shadow py-2.5 px-3 rounded-lg ml-auto w-[71%]">
								<Text className="text-white text-base font-medium text-center">Soumettre</Text>
							</Pressable>
						)
					}
				</View>
			</View>
			<LoaderUpload/>
		</ScreenLayout>
	);
};

export default StepsPetsitterScreen;
