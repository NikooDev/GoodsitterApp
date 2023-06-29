import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View, Pressable } from 'react-native';
import {
	FilterIcon, ListIcon, PoiUser,
	SettingsIcon,
	TargetLocatedDisable,
	TargetLocatedIcon,
	TargetLocationIcon
} from '@Component/icons';
import Text from '@Component/ui/text';
import SvgIcon from '@Component/icons/svg';

const MapGuideModal = ({ handleGuideDone, isHelp }: { handleGuideDone: () => void, isHelp: boolean }) => {
	return (
		<View className="bg-white rounded-2xl px-5 pt-5 pb-3">
			<View className="flex flex-row items-center mb-4">
				<Svg className="-top-1 fill-primary" height={32} width={32} viewBox="0 0 24 24">
					<Path d="M18.75 3.94L4.07 10.08c-.83.35-.81 1.53.02 1.85L9.43 14c.26.1.47.31.57.57l2.06 5.33c.32.84 1.51.86 1.86.03l6.15-14.67c.33-.83-.5-1.66-1.32-1.32z" />
				</Svg>
				<View>
					<Text className="font-semibold text-slate-700 text-lg ml-3">{ isHelp ? 'Besoin d\'aide ?' : 'Bienvenue sur la map !' }</Text>
					<Text className="font-medium text-xs mb-3 ml-3 -mt-1 text-slate-400">Découvrez les commandes</Text>
				</View>
			</View>
			<View className="flex flex-row items-center mt-2 pb-2 border-b border-b-[#ebebec]">
				<SvgIcon className="fill-slate-500" height={32} width={32} viewBox="0 0 24 24">
					<PoiUser/>
				</SvgIcon>
				<Text className="font-medium text-slate-700 ml-3">Emplacement d'un pet-sitter.</Text>
			</View>
			<View className="flex flex-row items-center mt-2 pb-2 border-b border-b-[#ebebec]">
				<SvgIcon className="fill-slate-500" height={32} width={32} viewBox="0 0 24 24">
					<ListIcon/>
				</SvgIcon>
				<Text className="font-medium text-slate-700 ml-3">Permuter l'affichage : Map - Liste.</Text>
			</View>
			<View className="flex flex-row items-center mt-2 pb-2 border-b border-b-[#ebebec]">
				<SvgIcon className="fill-slate-500" height={32} width={32} viewBox="0 0 24 24">
					<FilterIcon/>
				</SvgIcon>
				<Text className="font-medium text-slate-700 ml-3">Filtrer les résultats.</Text>
			</View>
			<View className="flex flex-row items-center mt-2 pb-2 border-b border-b-[#ebebec]">
				<SvgIcon className="fill-slate-500" height={32} width={32} viewBox="0 0 24 24">
					<SettingsIcon/>
				</SvgIcon>
				<Text className="font-medium text-slate-700 ml-3">Afficher les paramètres de la map.</Text>
			</View>
			<View className="flex flex-row items-center mt-2 pb-2 border-b border-b-[#ebebec]">
				<SvgIcon className="fill-slate-500" height={32} width={32} viewBox="0 0 24 24">
					<TargetLocationIcon/>
					<TargetLocatedIcon/>
				</SvgIcon>
				<Text className="font-medium text-slate-700 ml-3">Recentre votre localisation.</Text>
			</View>
			<View className="flex flex-row items-center mt-2 pb-2 border-b border-b-[#ebebec]">
				<SvgIcon className="fill-slate-500" height={32} width={32} viewBox="0 0 24 24">
					<TargetLocationIcon/>
				</SvgIcon>
				<Text className="font-medium text-slate-700 ml-3">Un déplacement a été détecté.</Text>
			</View>
			<View className="flex flex-row items-center mt-2">
				<SvgIcon className="fill-slate-500" height={32} width={32} viewBox="0 0 24 24">
					<TargetLocatedDisable/>
				</SvgIcon>
				<Text className="font-medium text-slate-700 ml-3">Géolocalisation désactivée.</Text>
			</View>
			<Text className="font-medium text-slate-400 text-xs ml-11 -mt-1">Pour activer à nouveau la géolocalisation, vous devez vous rendre dans les paramètres de votre téléphone.</Text>
			<Pressable className="mt-7 bg-primary items-center justify-center rounded-3xl w-full h-12 mb-4" onPress={handleGuideDone}>
				<Text className="text-white text-base font-semibold">{ isHelp ? 'Continuer' : 'Commencer' }</Text>
			</Pressable>
		</View>
	);
};

export default MapGuideModal;
