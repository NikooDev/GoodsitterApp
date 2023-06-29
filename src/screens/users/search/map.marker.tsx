import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Api } from '@Config/api';
import { Marker } from 'react-native-maps';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { IMapMarker, IPoint } from '@Type/map';
import { PoiUser } from '@Component/icons';
import SvgIcon from '@Component/icons/svg';
import Text from '@Component/ui/text';
import Class from 'classnames';

const MapMarker: React.FC<IMapMarker> = ({ item, darkmode, show_avatar, mapRef, handlePanDrag, handleViewProfile }) => {
	const opacityAnimate = useRef(new Animated.Value(0)).current;
	const translateY = useRef(new Animated.Value(-5)).current;

	const handleAnimate = useCallback(() => {
		const animate = Animated.parallel([
			Animated.timing(opacityAnimate, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true
			}),
			Animated.spring(translateY, {
				toValue: 0,
				damping: 10,
				useNativeDriver: true
			}),
		])

		animate.start()
	}, [opacityAnimate, translateY])

	useEffect(() => handleAnimate(), [])

	const handlePointPress = useCallback((point: IPoint) => {
		handlePanDrag()

		if (point && mapRef.current && point.properties && point.properties.getClusterExpansionRegion) {
			const toRegion = point.properties.getClusterExpansionRegion();
			mapRef.current.animateToRegion(toRegion, 1000);
		}
	}, [mapRef])

	const handleMarkerPress = (point: IPoint) => {
		handlePanDrag()

		const region = {
			latitude: point.geometry.coordinates[1],
			longitude: point.geometry.coordinates[0],
			latitudeDelta: .02,
			longitudeDelta: .02
		}

		mapRef.current && mapRef.current.animateToRegion(region, 1000)
		item.properties && handleViewProfile(item.properties.id, item.properties.role)
	}

	return (
		<Marker key={item.properties?.cluster_id ?? `point-${item.properties?.id}`}
						tracksViewChanges={false}
						coordinate={{ latitude: item.geometry.coordinates[1], longitude: item.geometry.coordinates[0] }}
						onPress={() => item.properties?.getClusterExpansionRegion ? handlePointPress(item) : handleMarkerPress(item)}>
			{
				item.properties && item.properties.cluster ? (
					<Animated.View style={[styles.clusterMarkerContainer, !darkmode ? styles.clusterMarkerDark : styles.clusterMarkerLight, { opacity: opacityAnimate, transform: [{ translateY }] }]}>
						<View style={[styles.clusterMarker, !darkmode ? styles.clusterMarkerDark : styles.clusterMarkerLight]}>
							<Text className={Class('text-base font-medium', !darkmode ? 'text-white' : 'text-primary')}>{ item.properties.point_count }</Text>
						</View>
					</Animated.View>
				) : (
					<Animated.View style={{ opacity: opacityAnimate, transform: [{ translateY }] }}>
						{
							item.properties && item.properties.avatar_url && show_avatar ? (
								<View className="bg-white shadow rounded-full">
									<Image source={{uri: Api+'/static'+item.properties.avatar_url, cache: 'reload'}} resizeMode="cover" className="rounded-full h-10 w-10" style={{ borderWidth: 2, borderColor: '#fff' }}/>
								</View>
							) : (
								<View className="w-10 h-10 bg-white shadow rounded-full items-center justify-center">
									<SvgIcon viewBox="0 0 24 24" className="h-8 w-8 fill-primary">
										<PoiUser/>
									</SvgIcon>
								</View>
							)
						}
					</Animated.View>
				)
			}
		</Marker>
	)
}

const styles = StyleSheet.create({
	clusterMarkerContainer: {
		width: 52,
		height: 52,
		borderRadius: 100,
		alignItems: 'center',
		justifyContent: 'center'
	},
	clusterMarker: {
		width: 40,
		height: 40,
		borderRadius: 100,
		justifyContent: 'center',
		alignItems: 'center',
	},
	clusterMarkerDark: {
		backgroundColor: 'rgba(88, 132, 198, .7)',
	},
	clusterMarkerLight: {
		backgroundColor: 'rgba(255, 255, 255, .7)',
	}
});

export default memo(MapMarker)
