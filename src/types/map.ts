import { IMapSettings, IMapType } from '@Type/setting';
import { Dimensions } from 'react-native';
import { supercluster } from 'react-native-clusterer';
import * as GeoJSON from 'geojson';
import React from 'react';
import MapView, { Region } from 'react-native-maps';
import { RoleEnum } from '@Type/profile';
import { IRootStackProps } from '@Type/stack';

const MAP_WIDTH = Dimensions.get('window').width;
const MAP_HEIGHT = Dimensions.get('window').height
export const MAP_DIMENSIONS = { width: MAP_WIDTH, height: MAP_HEIGHT }

export type IPoint =
	| supercluster.PointFeature<GeoJSON.GeoJsonProperties>
	| supercluster.ClusterFeatureClusterer<GeoJSON.GeoJsonProperties>;

export const initialState = {
	map_type: 'standard' as IMapType, enable_avatar: true, enable_rotation: true, enable_circle: false, search_distance: 10000, search_altitude: .3, darkmode: false
} as IMapSettings

export const initialRegion = {
	latitude: 46.732193,
	latitudeDelta: 13.5,
	longitude: 1.759999,
	longitudeDelta: 13.5,
};

export interface IMapMarker {
	item: IPoint
	darkmode: boolean
	show_avatar: boolean
	mapRef: React.RefObject<MapView>
	handlePanDrag: () => void
	handleViewProfile: (user_id: string, role: RoleEnum) => void
}

export interface IPetMarker {
	petsitter_id: string
	name: string
	firstname: string
	avatar_url: string
	cover_url: string
	role: RoleEnum
	title?: string | undefined
	description?: string | undefined
	rating: number
}

export interface IMapProfileProps {
	petMarker: IPetMarker
	navigation: IRootStackProps<'MapUsers' | 'Map'>['navigation']
	handleZoomOut: () => void
}

export interface Markers {
	id: string
	geometry: {
		coordinates: [number, number],
		type: 'Point'
	},
	properties: {
		[key: string]: string | undefined
	},
	type: 'Feature'
}
