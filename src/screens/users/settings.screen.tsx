import React, { useCallback, useEffect, useState } from 'react';
import Theme from '@Asset/theme';
import { ActivityIndicator, Alert, Pressable, ScrollView, Switch, View } from 'react-native';
import {
	useGetMapSettingsQuery,
	useGetSettingsQuery,
	useGetUserQuery,
	useSetMapSettingsMutation,
	useSetSettingsMutation
} from '@Service/api/users.api';
import { initialState } from '@Type/map';
import { IMapSettings } from '@Type/setting';
import { IRootStackProps } from '@Type/stack';
import { deleteUser } from '@Action/user.action';
import ScreenLayout from '@Component/layouts/screen.layout';
import Text from '@Component/ui/text';
import MapSettingsModal from '@Screen/users/search/map.settings.modal';
import useUsers from '@Hook/useUsers';


const SettingsScreen = ({ navigation }: IRootStackProps<'Settings'>) => {
	const [initialMapSettings, setInitialMapSettings] = useState<IMapSettings>(initialState);
	const [isLoadingHydrateSettings, setIsLoadingHydrateSettings] = useState<boolean>(true);
	const { data: user } = useGetUserQuery();
	const { data: settings, isLoading: loadingSettings, isError: isErrorSettings } = useGetSettingsQuery();
	const { data: mapSettings, isLoading: loadingMapSettings, isError: isErrorMapSettings } = useGetMapSettingsQuery();
	const [setSettings, { isLoading: loadingMutationSettings }] = useSetSettingsMutation();
	const [_, { isLoading: loadingMutationMapSettings }] = useSetMapSettingsMutation();
	const { handleLogout } = useUsers()

	/**
	 * Chargement des paramètres dans le state initial
	 */
	useEffect(() => {
		if (isLoadingHydrateSettings && !loadingMapSettings) {
			mapSettings && setInitialMapSettings({ ...mapSettings })
			setIsLoadingHydrateSettings(false)
		}
	}, [isLoadingHydrateSettings, loadingMapSettings, mapSettings])

	const handleDeleteUser = useCallback(async () => {
		if (user) {
			Alert.alert('Voulez-vous vraiment supprimer votre compte ?', 'Cette action est irréversible', [
				{ text: 'Supprimer', style: 'destructive', onPress: async () => {
						const res = await deleteUser(user.id)

						if (res.isDelete) {
							await handleLogout(navigation, false, { type: 'success', text1: 'Votre compte a bien été supprimé', topOffset: 50 })
						}
				}}, { text: 'Annuler', style: 'cancel' }
			])

		}
	}, [user, navigation])

	return (
		<ScreenLayout classNames="flex-1">
			{
				!settings ? (
					<View className="flex-1 bg-white justify-center items-center mb-20">
						{
							isErrorSettings || isErrorMapSettings ? (
								<View className="mx-5">
									<Text className="font-medium text-base text-slate-800 text-center">Erreur lors du chargement des paramètres.</Text>
									<Text className="text-slate-500 text-[14px] text-center">Notre équipe travaille activement pour{'\n'}résoudre ce problème.</Text>
									<Text className="mt-2 text-slate-500 text-[14px] text-center">Nous vous présentons toutes nos excuses pour ce désagrément.</Text>
								</View>
							) : (
								<ActivityIndicator color={Theme.colors.primary} size="large"/>
							)
						}
					</View>
				) : (
					<ScrollView contentInset={{bottom: 60}} contentContainerStyle={{paddingBottom: 75, paddingTop: 11, paddingHorizontal: 15}}>
						<Text className="mt-4 font-medium text-lg text-slate-800 mb-3">Préférences</Text>
						<View className="mb-5 bg-white rounded-2xl shadow">
							<View className="flex flex-row items-center mt-3 pb-4 pt-1">
								<View className="pl-3">

								</View>
								<View className="px-2">
									<Text className="font-medium text-slate-600 text-[15px]">Notifications push</Text>
									<Text className="text-slate-500 text-[14px]">Activé</Text>
								</View>
								<View className="ml-auto pr-5">
									<Switch value={settings && settings.enable_notifications} trackColor={{true: Theme.colors.primary}}/>
								</View>
							</View>
							<View className="h-0.5 bg-slate-200"/>
							<View className="flex flex-row items-center mt-3 pb-4 pt-1">
								<View className="pl-3">

								</View>
								<View className="px-2">
									<Text className="font-medium text-slate-600 text-[15px]">Langue</Text>
									{
										settings && settings.locale === 'fr_FR' && <Text className="text-slate-500 text-[14px]">Français</Text>
									}
								</View>
								<View className="ml-auto pr-5">
									<Text className="text-primary">Changer de langue</Text>
								</View>
							</View>
							<View className="h-0.5 bg-slate-200"/>
							<View className="flex flex-row items-center mt-3 pb-4 pt-1">
								<View className="pl-3">

								</View>
								<View className="px-2">
									<Text className="font-medium text-slate-600 text-[15px]">Mode sombre</Text>
								</View>
								<View className="ml-auto pr-5">
									<Switch value={settings && settings.darkmode} trackColor={{true: Theme.colors.primary}}/>
								</View>
							</View>
						</View>
						<Text className="mt-2 font-medium text-lg text-slate-800 mb-3">Confidentialité</Text>
						<View className="mb-5 bg-white rounded-2xl shadow">
							<View className="flex flex-row items-center mt-3 pb-4 pt-1">
								<View className="pl-3">

								</View>
								<View className="px-2">
									<Text className="font-medium text-slate-600 text-[15px]">Masquer mon adresse e-mail</Text>
								</View>
								<View className="ml-auto pr-5">
									<Switch value={settings && settings.hide_email} trackColor={{true: Theme.colors.primary}}/>
								</View>
							</View>
						</View>
						<Text className="mt-2 font-medium text-lg text-slate-800 mb-3">Paramètres de la map</Text>
						{ user && (
							<MapSettingsModal exported={true}
															 user={user}
															 isLoading={loadingMapSettings}
															 isLoadingHydrateSettings={loadingMutationMapSettings}
															 initialMapSettings={initialMapSettings}
															 setInitialMapSettings={setInitialMapSettings}/>
						)}
						<View className="justify-center items-center mt-5 pb-3">
							<Pressable onPress={handleDeleteUser} className="bg-red-500 rounded-3xl px-5 py-2">
								<Text className="text-white">Supprimer mon compte</Text>
							</Pressable>
						</View>
					</ScrollView>
				)
			}
		</ScreenLayout>
	);
};

export default SettingsScreen;
