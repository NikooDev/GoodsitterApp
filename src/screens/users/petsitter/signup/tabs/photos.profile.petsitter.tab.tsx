import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import Theme from '@Asset/theme';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { ActivityIndicator, Alert, Dimensions, Image, ImageStyle, Pressable, StyleProp, View } from 'react-native';
import { IPetsitters } from '@Type/petsitter';
import { ViewRef } from '@Type/app';
import * as Animatable from 'react-native-animatable';
import { PhotoIcon } from '@Component/icons';
import { DeleteIcon } from '@Component/icons/actions';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import Text from '@Component/ui/text';
import SvgIcon from '@Component/icons/svg';
import Class from 'classnames';

const PhotosProfilePetsitterTab = ({ petsitter, handleChange, error, setError }: IPetsitters) => {
	const [loading, setLoading] = useState<boolean>(false)
	const [photos, setPhotos] = useState<Asset[]>([])
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [isMaxPhotos, setIsMaxPhotos] = useState<boolean>(false)
	const carouselRef = useRef<Carousel<Asset>>(null)
	const animateRef = useRef<Animatable.View & View & ViewRef>(null);
	const emptyPhoto: Asset[] = [{}]
	const isPhotos = petsitter.photos && petsitter.photos.length !== 0
	const { width } = Dimensions.get('screen')

	/**
	 * Hydratation du state local par le state global pour synchroniser les deux states
	 */
	useEffect(() => {
		if (petsitter.photos && petsitter.photos.length > 0) {
			setLoading(true)
			setPhotos(petsitter.photos)
			animateRef.current && animateRef.current.animate('fadeIn')
			setTimeout(() => {
				setLoading(false)
			}, 500)
		}
	}, [animateRef])

	/**
	 * Déclenchement de la librairie de sélection d'images
	 * Mise à jour du state local après sélection
	 */
	const handleUpload = useCallback(async () => {
		setIsMaxPhotos(false)
		let timer: ReturnType<typeof setTimeout>
		timer = setTimeout(() => setLoading(true), 300)

		const response = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 8, includeExtra: true }, () => {})
		if (response.didCancel || response.errorCode && response.errorCode.length !== 0) {
			setLoading(false)
			clearTimeout(timer)
			if (response.errorCode === 'permission') {
				return Alert.alert('Autorisation refusée', 'Vous devez autoriser l\'accès aux photos dans les réglages de votre téléphone.')
			} else if (response.errorCode === 'camera_unavailable') {
				return Alert.alert('Caméra indisponible', 'La caméra est indisponible sur votre téléphone.')
			}
		}

		if (response.assets) {
			response.assets.forEach((photo) => {
				setPhotos((prevState) => [photo, ...prevState])
			})
		}

		carouselRef.current && carouselRef.current.snapToItem(0)
		setLoading(false)
	}, [carouselRef, photos])

	/**
	 * Déclenchement de la caméra
	 */
	const handleCamera = useCallback(async () => {
		await launchCamera({ quality: 0.7, mediaType: 'photo' }, (response) => {
			console.log(response);
		})
	}, [])

	/**
	 * Mise à jour du state global
	 * Ajout ou suppression des photos
	 */
	const handleAddPhoto = useCallback(() => {
		if (photos.length > 8) {
			const newPhotos = [...photos];
			newPhotos.splice(0, photos.length - 8);
			setPhotos(newPhotos)
			setIsMaxPhotos(true)
		} else if (photos.length > 0) {
			setError()
			handleChange(photos, 'photos')
		}
	}, [photos])

	/**
	 * Suppresion d'une photo
	 */
	const handleDeletePhoto = useCallback((photo_id: string | undefined) => {
		if (photo_id) {
			Alert.alert('Supprimer', 'Confirmez la suppression de cette photo ?',
				[
					{ text: 'Supprimer', style: 'destructive', onPress: () => {
							setPhotos((prevState) => prevState.filter((photo) => photo.id !== photo_id))
							if (photos.length === 1) {
								handleChange([], 'photos')
							}
						}
					},
					{
						text: 'Annuler',
						style: 'cancel',
						onPress: () => {},
					}
				]
			)
		}
	}, [photos])

	/**
	 * Alerte si sélection de plus de 8 photos
	 */
	const handleMaxPhotos = useCallback(() => {
		if (isMaxPhotos) {
			Alert.alert('Vous avez atteint la limite maximum de 8 photos.', 'Supprimez une photo déjà existante pour en ajouter une nouvelle.\n')
		}
	}, [isMaxPhotos])

	useEffect(() => handleAddPhoto(), [handleAddPhoto])
	useEffect(() => handleMaxPhotos(), [handleMaxPhotos])

	return (
		<View className="py-3 flex-col">
			<Text className="px-5 mt-2 font-medium text-lg text-slate-800 mb-8">Créer votre galerie de photos</Text>
			<Text className="px-5 text-slate-800 text-[15.5px] font-medium mb-3">Ajouter des photos de vous avec vos animaux, ou ceux que vous gardez</Text>
			<Carousel
				ref={carouselRef}
				data={isPhotos && petsitter.photos ? petsitter.photos : emptyPhoto} vertical={false} layout="stack"
				contentContainerCustomStyle={{paddingBottom: 23, paddingTop: 10}} scrollEnabled={!loading && Boolean(photos.length !== 0)}
				onScrollIndexChanged={(index) => setCurrentIndex(index)}
				itemWidth={width - 40} sliderWidth={width} renderItem={({ item }) => {
					let orientation: 'landscape' | 'portrait' | undefined = 'landscape'

					if (item.width && item.height && item.width > item.height){
						orientation = 'landscape'
					} else if (item.width && item.height && item.width < item.height){
						orientation = 'portrait'
					}
					const isLandscape = orientation === 'landscape'
					const imageStyle: StyleProp<ImageStyle> = {
						maxWidth: '100%', maxHeight: '100%', width: item.width, height: item.height
					}

					return (
						<View className="m-auto bg-white rounded-2xl shadow border-white border-4" style={{width: isLandscape ? width - 40 : width / 2}}>
							{
								loading ? (
									<View className="bg-white rounded-2xl shadow h-80 justify-center items-center">
										<ActivityIndicator color={Theme.colors.primary} size="large"/>
									</View>
								) : (
									item.uri && item.id ? (
									<Animatable.View animation="fadeIn" useNativeDriver={true} className="bg-white rounded-2xl h-80 justify-center items-center">
										<Image source={{uri: item.uri}} loadingIndicatorSource={{uri: item.uri}} resizeMode="cover" className="rounded-2xl" style={imageStyle}/>
										<View className="absolute bottom-1.5 right-1.5">
											<Pressable onPress={() => handleDeletePhoto(item.id)} className="p-2 rounded-full" style={{backgroundColor: 'rgba(0, 0, 0, .5)'}}>
												<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-white">
													<DeleteIcon/>
												</SvgIcon>
											</Pressable>
										</View>
									</Animatable.View>
								) : (
									<View className={Class('bg-white rounded-2xl shadow h-80 justify-center items-center', error.field === 'photos' && 'border-red-500 border-2')}>
										<Text className="font-medium">Aucune photo</Text>
									</View>
								)
								)
							}
						</View>
					)
			}}/>
			{
				petsitter.photos && (
					<Pagination activeDotIndex={currentIndex} dotColor={Theme.colors.primary} dotStyle={{height: 10, width: 10, borderRadius: 30}}
											inactiveDotColor={Theme.colors.primary} carouselRef={carouselRef} tappableDots dotsLength={petsitter.photos.length} containerStyle={{paddingTop: 0, paddingBottom: 25}}/>
				)
			}
			<Pressable disabled={petsitter.photos && petsitter.photos.length === 8} onPress={petsitter.photos && petsitter.photos.length === 8 ? handleMaxPhotos : handleUpload} className={Class(petsitter.photos && petsitter.photos.length === 8 ? 'bg-slate-300' : 'bg-primary', 'mx-5 flex-row items-center justify-center rounded-lg p-2 w-1/2 mt-4 ml-auto mr-auto')}>
				<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-white mr-1.5">
					<PhotoIcon/>
				</SvgIcon>
				<Text className="text-white font-medium">Ajouter des photos</Text>
			</Pressable>
		</View>
	);
};

export default memo(PhotosProfilePetsitterTab);
