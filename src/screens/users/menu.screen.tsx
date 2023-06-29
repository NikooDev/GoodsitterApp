import React from 'react';
import FastImage from 'react-native-fast-image';
import { Dimensions, Image, Pressable, ScrollView, View } from 'react-native';
import { TabIndex } from '@Screen/users/profile/profile.screen';
import { Api } from '@Config/api';
import { RoleEnum } from '@Type/profile';
import { useGetUserQuery } from '@Service/api/users.api';
import { IRootStackProps } from '@Type/stack';
import { AvatarIcon } from '@Component/icons/users';
import { SkeletonCircle, SkeletonRect } from '@Component/loader/skeletons';
import { AboutIcon, BackIcon, HelpIconCircle, PawIcon, SecurityIcon, SettingsIcon, ShareIcon } from '@Component/icons';
import { PawOffIcon } from '@Component/icons/navigation.icon';
import Text from '@Component/ui/text';
import ScreenLayout from '@Component/layouts/screen.layout';
import SvgIcon from '@Component/icons/svg';
import useUsers from '@Hook/useUsers';

const MenuScreen = ({ navigation }: IRootStackProps<'Menu'>) => {
	const { data: user, isLoading } = useGetUserQuery();
	const { handleLogout } = useUsers()

	const gap = 10
	const itemPerRow = 2
	const totalGapSize = (itemPerRow - 1) * gap
	const windowWidth = Dimensions.get('window').width - 30
	const childWidth = (windowWidth - totalGapSize) / itemPerRow

	return (
		<ScreenLayout classNames="flex-1 mb-10">
			<ScrollView contentContainerStyle={{paddingBottom: 100}}>
				<Pressable className="flex-row items-center px-4 mt-5 mb-5" onPress={() => {navigation.setOptions({ animationTypeForReplace: 'push' });navigation.navigate('Profile', { tabIndex: TabIndex.Zero })}}>
					<View className="bg-white shadow items-center justify-center rounded-full h-[70px] w-[70px] mr-4">
						{
							isLoading ? (
								<SkeletonCircle widthCicle={62.5} heightCircle={62.5} colorContainer="#cbd5e1" colorGradient={{ center: '#f1f5f9', between: '#cbd5e1' }}/>
							) : (
								user && user.profile.avatar_url ? (
									<Image source={{uri: Api+'/static'+user.profile.avatar_url+'?cache='+new Date().getMilliseconds()}} resizeMode="cover" className="rounded-full h-[62.5px] w-[62.5px]"/>
								) : (
									<SvgIcon height={75} width={75} viewBox="0 0 24 24" className="fill-slate-300">
										<AvatarIcon/>
									</SvgIcon>
								)
							)
						}
					</View>
					<View className="flex-1" style={{flexShrink: 1}}>
						{
							isLoading ? (
								<View className="bg-white p-[3px] rounded-full">
									<SkeletonRect heightRect={30} radius={30} widthRect="100%" colorContainer="#cbd5e1" colorGradient={{ center: '#f1f5f9', between: '#cbd5e1' }}/>
								</View>
							) : (
								<>
									<Text className="font-medium text-slate-600 text-lg w-full" numberOfLines={1} ellipsizeMode="tail" style={{flexShrink: 1}}>
										{ user && user.profile.firstname.cap()+' '+user.profile.name.cap() }
									</Text>
									<Text className="font-medium text-slate-400 text-xs -mt-1">Voir mon profil</Text>
								</>
							)
						}
					</View>
				</Pressable>
				<View className="items-center">
					<View className="flex-wrap flex-row" style={{marginVertical: -(gap / 2), marginHorizontal: -(gap / 2)}}>
						<Pressable onPress={() => navigation.navigate('Profile', { tabIndex: TabIndex.One })} className="bg-white justify-end h-20 shadow rounded-tl-3xl rounded-tr-xl rounded-br-xl rounded-bl-xl p-3" style={{width: childWidth, marginVertical: (gap / 2), marginHorizontal: (gap / 2)}}>
							<Text className="font-semibold text-[13px] text-slate-600">Mes{'\n'}animaux</Text>
							<View className="absolute right-2 top-2">
								<FastImage source={require('@Asset/static/img/harrier.png')} className="h-16 w-16"/>
							</View>
						</Pressable>
						<Pressable onPress={() => navigation.navigate('Profile', { tabIndex: TabIndex.Two })} className="bg-white justify-end h-20 shadow rounded-tl-xl rounded-tr-3xl rounded-br-xl rounded-bl-xl p-3" style={{width: childWidth, marginVertical: (gap / 2), marginHorizontal: (gap / 2)}}>
							<Text className="font-semibold text-[13px] text-slate-600">Mes{'\n'}Favoris</Text>
							<View className="absolute right-3 top-3.5">
								<FastImage source={require('@Asset/static/img/heart.png')} className="h-14 w-14"/>
							</View>
						</Pressable>
					</View>
					<View className="flex-wrap flex-row mt-2" style={{marginVertical: -(gap / 2), marginHorizontal: -(gap / 2)}}>
						<View className="bg-white justify-end h-20 shadow rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-3xl p-3" style={{width: childWidth, marginVertical: (gap / 2), marginHorizontal: (gap / 2)}}>
							<Text className="font-semibold text-[13px] text-slate-600">Mes{'\n'}Photos</Text>
							<View className="absolute right-3 top-3">
								<FastImage source={require('@Asset/static/img/image.png')} className="h-14 w-14"/>
							</View>
						</View>
						<View className="bg-white justify-end h-20 shadow rounded-tl-xl rounded-tr-xl rounded-br-3xl rounded-bl-xl p-3" style={{width: childWidth, marginVertical: (gap / 2), marginHorizontal: (gap / 2)}}>
							<Text className="font-semibold text-[13px] text-slate-600">Mes{'\n'}Paiements</Text>
							<View className="absolute right-3 top-3">
								<FastImage source={require('@Asset/static/img/wallet-passes-app.png')} className="h-14 w-14"/>
							</View>
						</View>
					</View>
				</View>
				<View className="mt-5 px-4">
					<View className="mb-5 bg-white rounded-2xl shadow">
						<Pressable onPress={() => user ? user.profile.role == RoleEnum.PETOWNER ? navigation.navigate('PetsitterWelcome') : navigation.navigate('PetsitterDisableProfile') : false} className="flex flex-row items-center mt-3 pb-3.5 pt-1 border-b-[2px] border-b-slate-200">
							<View className="pl-3">
								{
									user ? user.profile.role == RoleEnum.PETOWNER ? (
										<SvgIcon height={28} width={28} viewBox="0 0 24 24" className="fill-primary">
											<PawIcon/>
										</SvgIcon>
									) : (
										<SvgIcon height={28} width={28} viewBox="0 0 24 24" className="fill-primary">
											<PawOffIcon/>
										</SvgIcon>
									) : (
										<SvgIcon height={28} width={28} viewBox="0 0 24 24" className="fill-primary">
											<PawIcon/>
										</SvgIcon>
									)
								}
							</View>
							<Text className="font-medium text-slate-600 text-[15px] px-4">
								{ user ? user.profile.role == RoleEnum.PETOWNER ? ('Devenir pet-sitter') : ('Désactiver le mode pet-sitter') : 'Chargement...' }
							</Text>
							<View className="ml-auto pr-3">
								<SvgIcon height={18} width={18} viewBox="0 0 24 24" className="rotate-180 fill-slate-600">
									<BackIcon/>
								</SvgIcon>
							</View>
						</Pressable>
						<View className="flex flex-row items-center mt-3 pb-4 pt-1">
							<View className="pl-3">
								<SvgIcon height={28} width={28} viewBox="0 0 24 24" className="fill-primary">
									<ShareIcon/>
								</SvgIcon>
							</View>
							<Text className="font-medium text-slate-600 text-[15px] px-4">Partagez l'application</Text>
							<View className="ml-auto pr-3">
								<SvgIcon height={18} width={18} viewBox="0 0 24 24" className="rotate-180 fill-slate-600">
									<BackIcon/>
								</SvgIcon>
							</View>
						</View>
					</View>
					<View className="mb-5 bg-white rounded-2xl shadow">
						<View className="flex flex-row items-center mt-3 pb-3.5 pt-1 border-b-[2px] border-b-slate-200">
							<View className="pl-3">
								<SvgIcon height={28} width={28} viewBox="0 0 24 24" className="fill-primary">
									<HelpIconCircle/>
								</SvgIcon>
							</View>
							<Text className="font-medium text-slate-600 text-[15px] px-4">Aide et support</Text>
							<View className="ml-auto pr-3">
								<SvgIcon height={18} width={18} viewBox="0 0 24 24" className="rotate-180 fill-slate-600">
									<BackIcon/>
								</SvgIcon>
							</View>
						</View>
						<Pressable onPress={() => navigation.navigate('Settings')} className="flex flex-row items-center mt-3 pb-4 pt-1 border-b-[2px] border-b-gray-200">
							<View className="pl-3">
								<SvgIcon height={28} width={28} viewBox="0 0 24 24" className="fill-primary">
									<SettingsIcon/>
								</SvgIcon>
							</View>
							<Text className="font-medium text-slate-600 text-[15px] px-4">Paramètres</Text>
							<View className="ml-auto pr-3">
								<SvgIcon height={18} width={18} viewBox="0 0 24 24" className="rotate-180 fill-slate-600">
									<BackIcon/>
								</SvgIcon>
							</View>
						</Pressable>
						<View className="flex flex-row items-center mt-3 pb-4 pt-1">
							<View className="pl-3">
								<SvgIcon height={28} width={28} viewBox="0 0 24 24" className="fill-primary">
									<SecurityIcon/>
								</SvgIcon>
							</View>
							<Text className="font-medium text-slate-600 text-[15px] px-4">Confidentialité</Text>
							<View className="ml-auto pr-3">
								<SvgIcon height={18} width={18} viewBox="0 0 24 24" className="rotate-180 fill-slate-600">
									<BackIcon/>
								</SvgIcon>
							</View>
						</View>
					</View>
					<View className="mb-5 bg-white rounded-2xl shadow">
						<View className="flex flex-row items-center mt-3 pb-4 pt-1">
							<View className="pl-3">
								<SvgIcon height={28} width={28} viewBox="0 0 24 24" className="fill-primary">
									<AboutIcon/>
								</SvgIcon>
							</View>
							<Text className="font-medium text-slate-600 text-[15px] px-4">À propos de Good Sitter</Text>
							<View className="ml-auto pr-3">
								<SvgIcon height={18} width={18} viewBox="0 0 24 24" className="rotate-180 fill-slate-600">
									<BackIcon/>
								</SvgIcon>
							</View>
						</View>
					</View>
				</View>
				<View className="my-3 px-4">
					<Pressable className="bg-[#dfe1e7] rounded-2xl py-2.5" onPress={() => handleLogout(navigation, true)}>
						<Text className="font-text font-medium text-[15px] text-center text-darkText">Déconnexion</Text>
					</Pressable>
				</View>
			</ScrollView>
		</ScreenLayout>
	);
};

export default MenuScreen;
