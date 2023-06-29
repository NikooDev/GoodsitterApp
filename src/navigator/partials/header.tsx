import React from 'react';
import { Api } from '@Config/api';
import { Image, Pressable, Text, View } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AvatarIcon, BackIcon } from '@Component/icons';
import { getHeaderTitle } from '@react-navigation/elements';
import SvgIcon from '@Component/icons/svg';
import Class from 'classnames';

const Header = (props: NativeStackHeaderProps) => {
	const title = getHeaderTitle(props.options, props.route.name);
	const isChat = props.route.name === 'Chat';
	const isRouteBack = props.route.name === 'PetsitterSteps' || props.route.name === 'PetsitterWelcome' || props.route.name === 'Settings' || props.route.name === 'PetsitterDisableProfile'
	const isPetsitterSteps = props.route.name === 'PetsitterSteps' || props.route.name === 'ProfileUpdate'
	const isSmallText = props.route.name === 'PetsitterDisableProfile'
	const route: RouteProp<{ params: {headerTitle: string, avatar: string} }, 'params'> = useRoute()

	return (
		<View className={Class('flex justify-center bg-white px-4 pb-3 shadow w-full pt-8', isPetsitterSteps && 'pt-0')}>
			<View className={Class(isChat && 'flex-row items-center', isRouteBack && 'flex-row items-center', 'pt-5', isSmallText && 'mb-[4px] mt-[3px]')}>
				{
					isChat && (
						<>
							<Pressable onPress={() => props.navigation.goBack()}>
								<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-darkText mr-4">
									<BackIcon/>
								</SvgIcon>
							</Pressable>
							<View className="bg-white shadow items-center justify-center rounded-full h-[45px] w-[45px] mr-3">
								{
									route.params.avatar ? (
										<Image source={{uri: Api+'/static'+route.params.avatar}} resizeMode="cover" className="rounded-full h-[40.5px] w-[40.5px]"/>
									) : (
										<SvgIcon height={48} width={48} viewBox="0 0 24 24" className="fill-slate-300">
											<AvatarIcon/>
										</SvgIcon>
									)
								}
							</View>
						</>
					)
				}
				{
					isRouteBack && (
						<Pressable onPress={() => isPetsitterSteps ? props.navigation.reset({ routes: [{ name: 'Menu' }] }) : props.navigation.goBack()}>
							<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-darkText mr-4">
								<BackIcon/>
							</SvgIcon>
						</Pressable>
					)
				}
				<Text adjustsFontSizeToFit numberOfLines={1} className={
					Class('font-semibold tracking-tighter font-text text-[24px] text-center text-darkText',
						isChat && 'text-lg',
						isPetsitterSteps || isSmallText && 'text-[19px]')}>
					{ isChat ? route.params.headerTitle : title }
				</Text>
			</View>
		</View>
	);
};

export default Header;
