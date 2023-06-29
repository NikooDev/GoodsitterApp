import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapView, { MapCircle, Region } from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import MapProfile from '@Screen/users/search/map.profile';
import Modal from 'react-native-modal';
import MapMarker from '@Screen/users/search/map.marker';
import Geolocation from '@react-native-community/geolocation';
import { RoleEnum } from '@Type/profile';
import { initialRegion, initialState, IPetMarker, MAP_DIMENSIONS, Markers } from '@Type/map';
import { BlurView } from '@react-native-community/blur';
import { Clusterer } from 'react-native-clusterer';
import { useGetMapSettingsQuery, useGetUserQuery } from '@Service/api/users.api';
import { Alert, Dimensions, GestureResponderEvent, Pressable, StyleSheet, View } from 'react-native';
import { IMapSettings, IMapType } from '@Type/setting';
import { IRootState } from '@Type/state';
import { IRootStackProps } from '@Type/stack';
import { haptic } from '@Helper/functions';
import { useDispatch, useSelector } from 'react-redux';
import { getStorage, setStorage } from '@Helper/storage';
import { setMapGuideDone, setLoadingMap } from '@Reducer/app.reducer';
import { getMarkers } from '@Action/geolocation.action';
import { getMarkersProfile } from '@Action/petsitter.action';
import ScreenLayout from '@Component/layouts/screen.layout';
import SvgIcon from '@Component/icons/svg';
import {
	FilterIcon,
	HelpIcon,
	SettingsIcon,
	TargetLocatedDisable,
	TargetLocatedIcon,
	TargetLocationIcon
} from '@Component/icons';
import MapSettingsModal from '@Screen/users/search/map.settings.modal';
import MapGuideModal from '@Screen/users/search/map.guide.modal';

const MapScreen = ({ navigation }: IRootStackProps<'MapUsers' | 'Map'>) => {
	const [initialMapSettings, setInitialMapSettings] = useState<IMapSettings>(initialState);
	const [markers, setMarkers] = useState<Markers[]>([])
	const [petMarkers, setPetmarkers] = useState<IPetMarker>()
	const mapRef = useRef<MapView>(null);
	const [isLoadingHydrateSettings, setIsLoadingHydrateSettings] = useState<boolean>(true);
	const [permissionGeolocation, setPermissionGeolocation] = useState<boolean | undefined>(undefined)
	const [userLocationChange, setUserLocationChange] = useState<boolean>(false)
	const [coordsGeolocation, setCoordsGeolocation] = useState<Region>()
	const [region, setRegion] = useState<Region>(initialRegion);
	const [isHelp, setIsHelp] = useState<boolean>(false)
	const snapPoints = useMemo(() => ['69%'], [])
	const snapPointsProfile = useMemo(() => [petMarkers && petMarkers.role == RoleEnum.PETOWNER ? '24.5%' : '30%'], [petMarkers])
	const bottomSettings = useRef<BottomSheet>(null)
	const bottomProfile = useRef<BottomSheet>(null)
	const { app, auth } = useSelector((state: IRootState) => state)
	const { data: user, isError } = useGetUserQuery(undefined, { skip: app.accessGuest });
	const { data: mapSettings, isLoading } = useGetMapSettingsQuery(undefined, { skip: app.accessGuest });
	const dispatch = useDispatch()

	/**
	 * Chargement des paramètres dans le state initial
	 */
	useEffect(() => {
		if (isLoadingHydrateSettings && !isLoading) {
			mapSettings && setInitialMapSettings({ ...mapSettings })
			setIsLoadingHydrateSettings(false)
		}
	}, [isLoadingHydrateSettings, isLoading, mapSettings])

	/**
	 * Demande la permission d'utiliser la géolocalisation
	 */
	const handleRequestAuthorization = useCallback(() => {
		Geolocation.requestAuthorization(
			() => {
				handlePermissionSuccess()
			},
			(error) => {
				if (error.PERMISSION_DENIED === 1) {
					handlePermissionDenied()
				}
			}
		)
	}, [])

	/**
	 * Affichage du guide en fonction du storage
	 */
	useEffect(() => {
		getStorage('stepGuideMap').then((storage) => {
			if (storage === 'done') {
				dispatch(setMapGuideDone(true))
			} else {
				dispatch(setMapGuideDone(false))
			}
		})
	}, [])

	const handleGuideDone = async () => {
		handleRequestAuthorization()
		await setStorage('stepGuideMap', 'done')
		dispatch(setMapGuideDone(true))
	}

	const handleResetGuide = async () => {
		await setStorage('stepGuideMap', 'reset')
		dispatch(setMapGuideDone(false))
		setIsHelp(true)
	}

	/**
	 * Permission accordée
	 */
	const handlePermissionSuccess = () => {
		handleCurrentPosition()
		setPermissionGeolocation(true)
	}

	/**
	 * Permission refusée
	 */
	const handlePermissionDenied = () => {
		setPermissionGeolocation(false)
	}

	/**
	 * Fonction exécutée lorsque l'utilisateur bouge la map
	 */
	const handlePanDrag = () => {
		setUserLocationChange(true)
	}

	/**
	 * Affiche les paramètres de la map
	 */
	const handleOpenMapSettings = () => {
		haptic('impactLight')
		bottomSettings.current && bottomSettings.current.collapse()
	}

	/**
	 * Récupération de la position GPS
	 * @param event
	 */
	const handleCurrentPosition = (event?: GestureResponderEvent) => {
		if (!permissionGeolocation) {
			if (event) {
				Alert.alert('Géolocalisation refusée', 'Vous devez autoriser l\'accès à votre position pour vous localiser sur la map.')
			}
		}
		if (event && userLocationChange) {
			haptic('impactLight')
		}
		Geolocation.getCurrentPosition(
			(position) => {
				const reg = { latitude: position.coords.latitude, longitude: position.coords.longitude, latitudeDelta: .3, longitudeDelta: .3 }

				setPermissionGeolocation(true)
				setUserLocationChange(false)
				setCoordsGeolocation(reg)
			},
			() => {
				setPermissionGeolocation(false)
			}
		)
	}

	/**
	 * Mise à jour de la position en fonction de la nouvelle coordonnée
	 */
	useEffect(() => {
		const map = mapRef.current;

		if (coordsGeolocation && initialMapSettings.search_distance && initialMapSettings.search_distance) {
			const distance = initialMapSettings.search_distance / Math.cos(coordsGeolocation.latitude * Math.PI / 180);
			const delta = initialMapSettings.enable_circle ? distance / 111000 * 2.5 : .3;
			map && map.animateToRegion({ ...coordsGeolocation, latitudeDelta: delta, longitudeDelta: delta })
		}
	}, [mapRef, coordsGeolocation, initialMapSettings.search_distance])

	/**
	 * Récupération des marqueurs
	 */
	const handleRegionChange = useCallback((region: Region) => {
		const mapRefs = mapRef.current;

		setRegion(region)

		if (mapRefs && mapRef.current) {
			mapRefs.getMapBoundaries().then(async (mapResult) => {
				const region = mapResult && {
					latitudeNorthEast: mapResult.northEast.latitude,
					longitudeNorthEast: mapResult.northEast.longitude,
					latitudeSouthWest: mapResult.southWest.latitude,
					longitudeSouthWest: mapResult.southWest.longitude
				}

				const res = await getMarkers(region)
				setMarkers(res)
				dispatch(setLoadingMap(false))
			})
		}
	}, [mapRef])

	useEffect(() => {
		if (coordsGeolocation) {
			handleRegionChange(coordsGeolocation)
		}
	}, [coordsGeolocation, handleRegionChange])

	const handleViewProfile = async (user_id: string, role: RoleEnum) => {
		bottomProfile.current && bottomProfile.current.collapse()

		const res = await getMarkersProfile(user_id, role)

		setPetmarkers({...res, petsitter_id: res.user_id})
	}

	const handleZoomOut = useCallback(async () => {
		bottomProfile.current && bottomProfile.current.forceClose()
		if (mapRef.current) {
			const camera = await mapRef.current.getCamera();

			if (camera && camera.altitude) {
				const newAltitude = camera.altitude * 4.5;
				mapRef.current.animateCamera({ altitude: newAltitude });
			}
		}
	}, [mapRef])

	return (
		<ScreenLayout classNames="flex-1" statusBarStyle={initialMapSettings.darkmode || initialMapSettings.map_type === 'hybrid' ? 'light-content' : 'default'}>
			{
				isError && <View className="absolute z-50 bg-white opacity-50 h-full w-full"/>
			}
			<MapView ref={mapRef}
							 onMapReady={() => handleCurrentPosition()}
							 initialRegion={coordsGeolocation}
							 showsUserLocation={user && user.profile.role == RoleEnum.PETOWNER}
							 showsMyLocationButton={false}
							 rotateEnabled={initialMapSettings.enable_rotation}
							 compassOffset={{x: -16.5, y: 70}}
							 onPanDrag={handlePanDrag}
							 minZoomLevel={8.6}
							 mapType={initialMapSettings.map_type as IMapType}
							 userInterfaceStyle={initialMapSettings.darkmode ? 'dark' : 'light'}
							 onRegionChangeComplete={(region) => handleRegionChange(region)}
							 onRegionChange={() => dispatch(setLoadingMap(true))}
							 style={{ ...StyleSheet.absoluteFillObject, flex: 1 }}>
				{
					markers && markers.length !== 0 &&
						<Clusterer data={markers}
										 mapDimensions={MAP_DIMENSIONS}
										 options={{ radius: Dimensions.get('screen').width * 0.05, minZoom: 0, maxZoom: 20, minPoints: 3 }}
										 region={region} renderItem={(item) => (
						<MapMarker key={item.properties?.cluster_id ?? `point-${item.properties?.id}`}
											 item={item}
											 mapRef={mapRef}
											 handlePanDrag={handlePanDrag}
											 handleViewProfile={handleViewProfile}
											 darkmode={initialMapSettings.darkmode}
											 show_avatar={initialMapSettings.enable_avatar}/>
					)}/>
				}
				{ auth.isAuth && initialMapSettings.enable_circle && coordsGeolocation && user && user.profile.role == RoleEnum.PETOWNER && (
					<MapCircle center={{ latitude: user ? user.profile.latitude : coordsGeolocation.latitude, longitude: user ? user.profile.longitude : coordsGeolocation.longitude }}
										 radius={initialMapSettings.search_distance} fillColor="rgba(49, 124, 246, .3)" strokeColor="#fff" strokeWidth={2}/>
				)}
			</MapView>
			<BlurView blurType="light" overlayColor="transparent" blurAmount={8} style={{height: 45}}/>

			{ /** BOUTON FILTER & BOUTON SETTING */
				auth.isAuth && (
					<>
						<View className="flex flex-row justify-between items-center px-5 pt-5 ml-auto">
							<Pressable className="flex items-center justify-center rounded-full bg-white h-12 w-12 mr-2" onPress={handleResetGuide} style={{shadowRadius: 5, shadowColor: '#000', shadowOpacity: .2, shadowOffset: { width: 0, height: 0}}}>
								<SvgIcon height={28} width={28} className="fill-primary" viewBox="0 0 20 20">
									<HelpIcon/>
								</SvgIcon>
							</Pressable>
							<Pressable className="flex items-center justify-center rounded-full bg-white h-12 w-12" onPress={() => navigation.navigate('Filter')} style={{shadowRadius: 5, shadowColor: '#000', shadowOpacity: .2, shadowOffset: { width: 0, height: 0}}}>
								<SvgIcon className="fill-primary" height={33} width={33} viewBox="0 0 24 24">
									<FilterIcon/>
								</SvgIcon>
							</Pressable>
						</View>
						<Pressable onPress={handleOpenMapSettings} className="absolute bottom-[183px] bg-white items-center justify-center right-5 h-14 w-14" style={[styles.buttonShadow, { borderTopRightRadius: 50, borderTopLeftRadius: 50, borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }]}>
							<SvgIcon height={32} width={32} className="fill-primary mt-0.5" viewBox="0 0 24 24">
								<SettingsIcon/>
							</SvgIcon>
						</Pressable>
					</>
				)
			}

			{ /** BOUTON GEOLOCATION */ }
			<Pressable onPress={(event) => handleCurrentPosition(event)} className="absolute bottom-[120px] bg-white items-center justify-center right-5 h-14 w-14" style={[styles.buttonShadow, { borderTopRightRadius: 10, borderTopLeftRadius: 10, borderBottomRightRadius: 50, borderBottomLeftRadius: 50 }]}>
				<SvgIcon height={32} width={32} className="fill-primary -mt-0.5" viewBox="0 0 24 24">
					{
						permissionGeolocation ? (
							<>
								<TargetLocationIcon/>
								{ !userLocationChange && <TargetLocatedIcon/> }
							</>
						) : (
							<TargetLocatedDisable/>
						)
					}
				</SvgIcon>
			</Pressable>

			{ /** RÉGLAGES MAP */
				auth.isAuth && user && (
					<BottomSheet ref={bottomSettings} detached enablePanDownToClose index={-1} bottomInset={130} style={styles.bottomSheet} snapPoints={snapPoints}>
						<MapSettingsModal
							initialMapSettings={initialMapSettings}
							setInitialMapSettings={setInitialMapSettings}
							isLoading={isLoading}
							user={user}
							isLoadingHydrateSettings={isLoadingHydrateSettings}/>
					</BottomSheet>
				)
			}

			{
				<BottomSheet ref={bottomProfile} detached enablePanDownToClose index={-1} bottomInset={130} style={styles.bottomSheet} snapPoints={snapPointsProfile}>
					{
						petMarkers && <MapProfile petMarker={petMarkers} handleZoomOut={handleZoomOut} navigation={navigation}/>
					}
				</BottomSheet>
			}

			{ /** GUIDE MAP */ }
			{ app.mapGuideDone === undefined ? <Fragment/> : (
				<Modal isVisible={!app.mapGuideDone} useNativeDriver hideModalContentWhileAnimating>
					<MapGuideModal isHelp={isHelp} handleGuideDone={handleGuideDone}/>
				</Modal>
			)}
		</ScreenLayout>
	)
}

const styles = StyleSheet.create({
	buttonShadow: {
		shadowRadius: 5,
		shadowColor: '#000',
		shadowOpacity: .2,
		shadowOffset: { width: 0, height: 0}
	},
	bottomSheet: {
		backgroundColor: '#fff',
		borderRadius: 30,
		marginHorizontal: 20,
		zIndex: 40,
		shadowRadius: 10,
		shadowColor: '#000',
		paddingBottom: 7,
		shadowOpacity: .2,
		shadowOffset: { width: 0, height: 0}
	}
})

export default MapScreen
