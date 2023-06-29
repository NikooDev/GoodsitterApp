import React from 'react';
import Theme from '@Asset/theme';
import Slider from '@react-native-community/slider';
import { ActivityIndicator, ScrollView, Switch, View } from 'react-native';
import { useSetMapSettingsMutation } from '@Service/api/users.api';
import { IMapSettingsBottomSheet } from '@Type/setting';
import { haptic } from '@Helper/functions';
import ButtonGroup from '@Component/navigation/buttonGroup';
import Text from '@Component/ui/text';
import Class from 'classnames';
import { RoleEnum } from '@Type/profile';

const MapSettingsModal: React.FC<IMapSettingsBottomSheet> = ({
	user,
	exported,
	isLoading,
	isLoadingHydrateSettings,
	initialMapSettings,
	setInitialMapSettings}) => {
	const [setMapSettings, { isLoading: loadingMutation }] = useSetMapSettingsMutation();
	const textButtonGroup = initialMapSettings.map_type === 'standard' ? 'Standard' : 'Satellite'

	const handleSettingChange = (name: string, value: boolean) => {
		setInitialMapSettings({ ...initialMapSettings, [name]: value })
		setMapSettings({ [name]: value })
	}

	const handleRadiusChange = (value: number) => {
		haptic('impactLight')
		setInitialMapSettings({ ...initialMapSettings, search_distance: value })
	}

	const handleSetRadius = () => {
		setMapSettings({ search_distance: initialMapSettings.search_distance })
	}

	const handleMapType = (name: 'Standard' | 'Satellite' | string) => {
		let updateName: string
		name === 'Standard' ? updateName = 'standard' : updateName = 'hybrid'

		if (initialMapSettings.map_type === updateName) return

		haptic('impactLight')
		setMapSettings({ map_type: name === 'Standard' ? 'standard' : 'hybrid' }).then(() => {
			switch (name) {
				case 'Standard':
					setInitialMapSettings({ ...initialMapSettings, map_type: 'standard' })
					break
				case 'Satellite':
					setInitialMapSettings({ ...initialMapSettings, map_type: 'hybrid' })
					break
				default:
					setInitialMapSettings({ ...initialMapSettings, map_type: 'standard' })
			}
		})
	}

	return (
		!exported && (isLoading || isLoadingHydrateSettings) ? (
			<View className="h-full items-center justify-center">
				<ActivityIndicator color={Theme.colors.primary} size="large"/>
			</View>
		) : (
			<ScrollView>
				<View className={Class('flex-1 px-7 z-50', exported && 'bg-white rounded-2xl shadow')}>
					<View className={Class('flex flex-row items-center justify-between', exported && 'hidden')}>
						<Text className="text-darkText font-semibold text-[22px]">Paramètres de la carte</Text>
					</View>
					<View className="rounded-full overflow-hidden mt-5">
						<View className="bg-[#ebebec] absolute w-full h-[42px] top-1"/>
						<ButtonGroup highlightBackgroundColor={Theme.colors.primary} highlightTextColor={'white'} inactiveBackgroundColor={'transparent'}
												 inactiveTextColor={'grey'} values={['Standard', 'Satellite']} style={{borderRadius: 30}}
												 textStyle={{fontFamily: 'Poppins', fontWeight: '500', fontSize: 15}}
												 value={textButtonGroup} onSelect={(val) => handleMapType(val)}/>
					</View>
					<View className="flex flex-row justify-between items-center mt-5 pb-2 border-b border-b-[#ebebec]">
						<Text className="font-medium text-slate-600">Afficher les avatars</Text>
						<Switch value={initialMapSettings.enable_avatar} trackColor={{true: Theme.colors.primary}}
										onValueChange={(value) => handleSettingChange('enable_avatar', value)}/>
					</View>
					<View className={Class('flex flex-row justify-between items-center mt-2 pb-2 border-b border-b-[#ebebec]')}>
						<Text className="font-medium text-slate-600">Rotation</Text>
						<Switch value={initialMapSettings.enable_rotation} trackColor={{true: Theme.colors.primary}}
										onValueChange={(value) => handleSettingChange('enable_rotation', value)}/>
					</View>
					<View className="flex flex-row justify-between items-center mt-2 pb-2">
						<Text className="font-medium text-slate-600">Zone de recherche</Text>
						<Switch value={initialMapSettings.enable_circle} disabled={user.profile.role == RoleEnum.PETSITTER} trackColor={{true: Theme.colors.primary}}
										onValueChange={(value) => handleSettingChange('enable_circle', value)}/>
					</View>
					<View className="mt-7">
						<Text className={Class('font-medium text-slate-600 mb-3', (!initialMapSettings.enable_circle || user.profile.role == RoleEnum.PETSITTER) && 'opacity-30')}>Sélectionnez le rayon dans lequel vous souhaitez trouver un pet-sitter.</Text>
						<Text className={Class('font-medium text-slate-600 mb-2', (!initialMapSettings.enable_circle || user.profile.role == RoleEnum.PETSITTER) && 'opacity-30')}>Rayon : { initialMapSettings.search_distance / 1000 } km autour de vous</Text>
						<Slider value={initialMapSettings.search_distance} disabled={(!initialMapSettings.enable_circle || user.profile.role == RoleEnum.PETSITTER)}
										step={2000} minimumValue={2000} maximumValue={20000} minimumTrackTintColor={Theme.colors.primary}
										onTouchEnd={handleSetRadius}
										onValueChange={(value) => handleRadiusChange(value)}/>
					</View>
					<View className={Class('flex flex-row justify-between items-center mt-2 pt-2 pb-5 border-t border-t-[#ebebec]', exported && 'pb-2')}>
						<Text className={Class('font-medium text-slate-600', initialMapSettings.map_type !== 'standard' && 'opacity-30')}>Mode sombre</Text>
						<Switch value={initialMapSettings.darkmode} disabled={initialMapSettings.map_type !== 'standard'} trackColor={{true: Theme.colors.primary}}
										onValueChange={(value) => handleSettingChange('darkmode', value)}/>
					</View>
				</View>
				{
					loadingMutation && exported && (
						<>
							<ActivityIndicator color={Theme.colors.primary} className="absolute left-1/2 top-1/2 z-[60]" style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}} size="large"/>
							<View className="bg-white rounded-lg absolute opacity-50 h-full w-full z-50"/>
						</>
					)
				}
			</ScrollView>
		)
	);
};

export default MapSettingsModal;
