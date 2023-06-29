import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import Theme from '@Asset/theme';
import { ActivityIndicator, Alert, Dimensions, Image, Keyboard, Pressable, TextInput, View } from 'react-native';
import { usersApi } from '@Service/api/users.api';
import { Api } from '@Config/api';
import { IPetsitters } from '@Type/petsitter';
import { IGeolocCity } from '@Type/auth';
import { AvatarIcon, EditIcon, CloseIcon, AboutIcon, HelpIconCircle } from '@Component/icons';
import { filterAlphabeticCity } from '@Helper/functions';
import { useDispatch } from 'react-redux';
import { getCity } from '@Action/geolocation.action';
import SvgIcon from '@Component/icons/svg';
import Text from '@Component/ui/text';
import Class from 'classnames';
import useUpload, { IUploadType } from "@Hook/useUpload";

const BaseProfilePetsitterTab = ({ petsitter, handleChange, user, error, setError, scrollRef }: IPetsitters) => {
	const [zipCode, setZipCode] = useState<string | undefined>(undefined);
	const [loadingCity, setLoadingCity] = useState<boolean>(false);
	const [suggestionsCity, setSuggestionsCity] = useState<IGeolocCity[]>([]);
	const [emailEditable, setEmailEditable] = useState<boolean>(false);
	const emailRef = useRef<TextInput>() as React.MutableRefObject<TextInput>;
	const zipCodeRef = useRef<TextInput>() as React.MutableRefObject<TextInput>;
	const { handleUpload } = useUpload()
	const { width } = Dimensions.get('screen')
	const dispatch = useDispatch()

	const handleEmailEditable = useCallback(() => {
		setEmailEditable((prevEmailEditable) => !prevEmailEditable)
	}, [])

	useEffect(() => {
		if (emailEditable && emailRef.current) {
			emailRef.current.focus()
		}
	}, [emailEditable, emailRef])

	const handlePhotos = async (name: string, type: IUploadType) => {
		const images = await handleUpload(type);

		for (let image of images) {
			handleChange(image.path, 'avatar');
		}

		dispatch(usersApi.util.invalidateTags(['User']));
	}

	const handleZipChange = (value: string) => {
		setZipCode(value)
		handleChange(value, 'address', 'zip');
	}

	const handleCityChange = (value: string) => {
		setTimeout(() => handleChange(value, 'address', 'city'), 1000)
	}

	const handleGetCity = useCallback(async () => {
		const reg = new RegExp(/^\d+$/);

		if (zipCode && zipCode.length === 5 && Number(reg.test(zipCode))) {
			Keyboard.dismiss();

			setLoadingCity(true);
			const cities = await getCity(zipCode);

			setLoadingCity(false);
			setSuggestionsCity(cities);
			if (cities.length === 0) {
				Alert.alert('Ville ou code postal incorrect', '', [
					{ text: 'OK', onPress: () => {
							zipCodeRef.current && zipCodeRef.current.clear();
							zipCodeRef.current && zipCodeRef.current.focus();
						}
					}
				])
			}
		} else {
			setSuggestionsCity([]);
		}
	}, [zipCode, zipCodeRef])

	const handleSetCity = (city: string, lat: number, lng: number) => {
		console.log(lat, lng);
		/**
		 * Modifier la latitude / longitude de l'utilisateur à la soumission du formulaire
		 */
		handleChange(city, 'address', 'city');
		setSuggestionsCity([]);
		scrollRef && scrollRef.current && scrollRef.current.scrollTo({x: 0, y: 0, animated: true})
	}

	const handleHelp = () => Alert.alert('Ville introuvable ?',
		'Si votre ville n\'est pas dans la liste,\ncontactez l\'assistance.', [
			{ text: 'Contactez l\'assistance', style: 'default' },
			{ text: 'OK', style: 'cancel' }
		])

	useEffect(() => { handleGetCity().then() }, [handleGetCity]);

	return (
		<View className="px-5 py-3 flex-col">
			<Text className="mt-2 font-medium text-lg text-slate-800 mb-8">Informations générales</Text>

			{ /** Adresse */}
			<Text className="text-slate-800 text-[15.5px] font-medium mb-1">Modifiez votre adresse si nécessaire</Text>
			<Text className="text-slate-500 text-[14px]">Votre adresse est visible uniquement en cas de service d'hébergement à domicile.</Text>
			<View className="flex-row justify-between">
				<TextInput className="bg-white shadow p-3 rounded-lg mt-3 w-[20%] font-text" keyboardType="number-pad"
									 onChangeText={(value) => handleChange(value, 'address', 'number_street')}
									 defaultValue={petsitter.address.number_street}
									 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="N°"/>
				<TextInput className="bg-white shadow p-3 rounded-lg mt-3 w-[76.5%] font-text"
									 onChangeText={(value) => handleChange(value, 'address', 'street_name')}
									 defaultValue={petsitter.address.street_name}
									 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="Nom de rue"/>
			</View>
			<TextInput className="bg-white shadow p-3 rounded-lg mt-5 font-text"
								 onChangeText={(value) => handleChange(value, 'address', 'address_comp')}
								 defaultValue={petsitter.address.address_comp}
								 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="Complément d'adresse (facultatif)"/>
			<View className="flex-row justify-between">
				<TextInput className="bg-white shadow p-3 rounded-lg mt-5 w-[33%] font-text" keyboardType="number-pad"
									 onChangeText={(value) => handleZipChange(value)} maxLength={5} ref={zipCodeRef}
									 defaultValue={petsitter.address.zip}
									 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="Code postal"/>
				<TextInput className="bg-white shadow p-3 rounded-lg mt-5 w-[63.5%] font-text" editable={false}
									 onChangeText={(value) => handleCityChange(value)}
									 defaultValue={petsitter.address.city}
									 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="Ville"/>
				{
					loadingCity && (
						<ActivityIndicator color={Theme.colors.primary} className="absolute right-3 bottom-3"/>
					)
				}
			</View>

			{
				suggestionsCity.length !== 0 && (
					<View className="bg-white shadow rounded-lg mt-5">
						<View className="flex-1 mb-2 px-4 py-2">
							<View className="flex-row justify-between items-center mb-5">
								<View>
									<Text className="font-medium text-[15px] text-slate-800">Choisissez votre ville :</Text>
									<Text className="text-slate-500 text-[14px]">Affichée par ordre alphabétique</Text>
								</View>
								<Pressable onPress={handleHelp} className="mr-1 mt-0.5">
									<SvgIcon viewBox="0 0 24 24" height={32} width={32} className="fill-slate-700">
										<HelpIconCircle/>
									</SvgIcon>
								</Pressable>
							</View>
							{
								filterAlphabeticCity(suggestionsCity).map((city, index) => (
									<Pressable key={index} onPress={() => handleSetCity(city.placeName, city.lat, city.lng)} className="py-3.5 px-5 bg-slate-200 mb-3 rounded-2xl">
										<Text className="text-primary font-medium">{ city.placeName } - { city.postalCode }</Text>
									</Pressable>
								))
							}
						</View>
					</View>
				)
			}

			{ /** Photo de profil */ }
			<Text className="text-slate-800 text-[15.5px] font-medium mb-1 mt-7">Photo de profil</Text>
			<View className="flex-row-reverse justify-between items-center">
				<Text className="text-slate-500 text-[14px] w-[47%] mt-2">
					Mettez les propriétaires en confiance !{'\n\n'}Nous vous recommandons d'utiliser une photo nette et conforme aux conditions d'utilisations.
				</Text>
				<View className="h-40 w-40 bg-white shadow rounded-full mt-3 justify-center items-center">
					{
						petsitter.avatar ? (
							<Image source={{uri: petsitter.avatar+'?='+new Date().getMilliseconds()}} defaultSource={{ uri: petsitter.avatar }} resizeMode="cover" className="rounded-full h-[147px] w-[147px]"/>
						) : (
							user && user.profile.avatar_url ? (
								<Image source={{uri: Api+'/static'+user.profile.avatar_url+'?='+new Date().getMilliseconds()}} onLoadEnd={() => handleChange(Api+'/static'+user.profile.avatar_url, 'avatar')} resizeMode="cover" className="rounded-full h-[147px] w-[147px]"/>
							) : (
								<SvgIcon viewBox="0 0 24 24" className="h-44 w-44 fill-slate-300">
									<AvatarIcon/>
								</SvgIcon>
							)
						)
					}
					<Pressable onPress={() => handlePhotos('avatar_url', 'avatar')} className="absolute justify-center items-center bg-white h-10 w-10 -right-2 top-5 z-10 rounded-full shadow">
						<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-primary">
							<EditIcon/>
						</SvgIcon>
					</Pressable>
				</View>
			</View>

			{ /** Adresse e-mail */ }
			<Text className="text-slate-800 text-[15.5px] font-medium mb-1 mt-7">Adresse e-mail</Text>
			<Text className="text-slate-500 text-[14px]">Vérifiez si votre adresse e-mail est correcte et valide.{'\n'}Laissez vide pour conserver l'adresse e-mail actuelle.</Text>
			<View>
				<TextInput ref={emailRef} editable={emailEditable} spellCheck={false} returnKeyType="done" autoCorrect={false}
									 onChangeText={(value) => handleChange(value, 'email')}
									 defaultValue={petsitter.email}
									 keyboardType="email-address" textContentType="emailAddress" autoCapitalize="none"
									 className={Class('py-3 pl-3 pr-10 rounded-lg mt-3 font-text', emailEditable && 'bg-white shadow')}
									 placeholderTextColor={'rgb(30, 41, 59)'} placeholder={user && user.email}/>
				{
					emailEditable && (
						<>
							<Text className="text-xs text-center font-medium text-red-500 mt-2 mb-7">
								Attention : Vous allez modifier l'adresse e-mail{'\n'}associé à votre compte.
							</Text>
						</>
					)
				}
				<Pressable onPress={handleEmailEditable} className="h-10 w-10 justify-center items-center absolute right-0.5 top-3.5">
					{
						<SvgIcon viewBox="0 0 24 24" height={!emailEditable ? 24 : 34} width={!emailEditable ? 24 : 34} className="fill-primary">
							{ !emailEditable ? <EditIcon/> : <CloseIcon/> }
						</SvgIcon>
					}
				</Pressable>
			</View>
			<Text className="text-slate-800 text-[15.5px] font-medium mb-1 mt-7">Numéro de téléphone</Text>
			<Text className="text-slate-500 text-[14px]">Votre numéro de téléphone ne sera en aucun cas partagé, ni affiché sur votre profil.{'\n\n'}Vous êtes libre de transmettre votre numéro aux pet-sitters.</Text>
			<TextInput className={Class('bg-white shadow p-3 rounded-lg mt-3 font-text border-2 border-white', error.field === 'phone' && 'border-red-500 border-2')} keyboardType="number-pad"
								 onChangeText={(value) => handleChange(value, 'phone')} maxLength={10} onChange={setError}
								 defaultValue={petsitter.phone}
								 placeholderTextColor={'rgb(148, 163, 184)'}/>
			<View className="flex-row items-center mt-3">
				<SvgIcon viewBox="0 0 24 24" height={32} width={32} className="fill-slate-500 mr-2">
					<AboutIcon/>
				</SvgIcon>
				<Text className="text-slate-500 text-[14px]" style={{width: width - 90}}>Votre numéro de téléphone permet de vérifier l'authenticité de votre compte afin de garantir la sécurité des utilisateurs de Goodsitter.</Text>
			</View>
		</View>
	);
};

export default memo(BaseProfilePetsitterTab);
