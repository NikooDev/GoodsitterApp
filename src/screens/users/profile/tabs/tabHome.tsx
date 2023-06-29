import React from 'react';
import Animated from 'react-native-reanimated';
import MapView, { MapCircle } from 'react-native-maps';
import { useGetUserQuery } from '@Service/api/users.api';
import { View} from 'react-native';
import { ITabProps } from '@Type/profile';
import { TabLoader } from '@Screen/users/profile/tabs';
import { BirthdayIcon, CityIcon, EmailIcon, PhoneIcon } from '@Component/icons/users';
import { phoneFormat } from '@Helper/functions';
import SvgIcon from '@Component/icons/svg';
import Text from '@Component/ui/text';

const TabHome = ({ scroll, scrollRef }: ITabProps) => {
	const { data: user, isLoading } = useGetUserQuery();

	return (
		<Animated.ScrollView ref={scrollRef} scrollEventThrottle={16} onScroll={scroll} scrollEnabled={!isLoading} scrollIndicatorInsets={{top: 40, left: 0, bottom: 0, right: 0}}>
			<View className="mt-5 mb-3 bg-white shadow px-5 py-4">
				<Text className="font-semibold text-2xl text-darkText mb-3">Profil</Text>
				{
					isLoading ? (
						<TabLoader/>
					) : (
						<>
							<View className="mb-5 flex-row items-center">
								<View className="bg-slate-200 rounded-full items-center justify-center h-10 w-10">
									<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-slate-600">
										<EmailIcon/>
									</SvgIcon>
								</View>
								<View className="ml-2 pr-3">
									<Text className="font-normal text-slate-400">Adresse e-mail</Text>
									<Text className="font-medium text-base text-slate-600 -mt-0.5">
										{ user && user.email }
									</Text>
								</View>
							</View>
							<View className="mb-5 flex-row items-center">
								<View className="bg-slate-200 rounded-full items-center justify-center h-10 w-10">
									<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-slate-600">
										<BirthdayIcon/>
									</SvgIcon>
								</View>
								<View className="ml-2 pr-3">
									<Text className="font-normal text-slate-400">Date de naissance</Text>
									<Text className="font-medium text-base text-slate-600 -mt-0.5">
										{
											/**
											 * Si current_id === user.id alors affiche la date de naissance sinon on affiche rien
											 */
											!isLoading && user && user.profile.birthday
										}
									</Text>
								</View>
							</View>
							{
								/**
								 * Si current_id === user.id alors affiche le numéro sinon on affiche rien
								 */
								user && user.profile.phone_num && (
									<View className="mb-5 flex-row items-center">
										<View className="bg-slate-200 rounded-full items-center justify-center h-10 w-10">
											<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-slate-600">
												<PhoneIcon/>
											</SvgIcon>
										</View>
										<View className="ml-2 pr-3">
											<Text className="font-normal text-slate-400">Numéro de téléphone</Text>
											<Text className="font-medium text-base text-slate-600 -mt-0.5">
												{
													phoneFormat(' ', user.profile.phone_num) }
											</Text>
										</View>
									</View>
								)
							}
							<View className="flex-row items-center">
								<View className="bg-slate-200 rounded-full items-center justify-center h-10 w-10">
									<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-slate-600">
										<CityIcon/>
									</SvgIcon>
								</View>
								<View className="ml-2 pr-3">
									{
										/**
										 * Si current_id === user.id alors affiche la rue et numéro de rue sinon on affiche rien
										 */
									}
									<Text className="font-normal text-slate-400">Adresse</Text>
									<Text className="font-medium text-base text-slate-600 -mt-0.5">{ user && user.profile.street }</Text>
									{ user && user.profile.street_complement && <Text className="font-medium text-base text-slate-600 -mt-0.5">{ user.profile.street_complement }</Text> }
									<Text className="font-medium text-base text-slate-600 -mt-0.5">{ user && user.profile.zip_code+ ' '+user.profile.city.cap() }</Text>
									<Text className="font-medium text-base text-slate-600 -mt-0.5">{ user && user.profile.country.cap() }</Text>
								</View>
							</View>
							<View className="h-72 w-full rounded-2xl overflow-hidden mt-3 mb-1.5">
								<MapView
									className="h-72 w-full"
									zoomEnabled={false}
									minZoomLevel={2}
									initialRegion={user && {
										latitude: user.profile.latitude,
										longitude: user.profile.longitude,
										latitudeDelta: .3, longitudeDelta: .3
									}}
									scrollEnabled={false}>
									{ user && <MapCircle center={{ latitude: user.profile.latitude, longitude: user.profile.longitude }}
														 radius={5000} fillColor="rgba(49, 124, 246, .3)" strokeColor="#fff" strokeWidth={2} /> }
								</MapView>
							</View>
						</>
					)
				}
			</View>
		</Animated.ScrollView>
	);
};

export default TabHome;
