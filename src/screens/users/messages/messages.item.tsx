import React, { useCallback } from 'react';
import { Api } from '@Config/api';
import { Dimensions, Image, Pressable, View } from 'react-native';
import { RoleEnum } from '@Type/profile';
import { INavigateRoom } from '@Type/chat';
import { dateFormat, formatUsersChat } from '@Helper/functions';
import { useDispatch } from 'react-redux';
import { setUsersChat } from '@Reducer/app.reducer';
import { AvatarIcon } from '@Component/icons';
import useEvents from '@Hook/useEvents';
import SvgIcon from '@Component/icons/svg';
import Text from '@Component/ui/text';
import Class from 'classnames';

/**
 * Représente le lien <Pressable/> d'une conversation de la liste de <MessagesAllScreen/>
 * @constructor
 */
const MessagesItem = (users: INavigateRoom) => {
	const { width } = Dimensions.get('screen')
	const isPetowner = users.current_user.profile.role == RoleEnum.PETOWNER
	const isPetsitter = users.current_user.profile.role == RoleEnum.PETSITTER
	const { handleSocketEmit } = useEvents()
	const dispatch = useDispatch()

	const handleAvatar = () => {
		const avatarClass = 'rounded-full h-[54.5px] w-[54.5px]'
		const DefaultAvatar = () => {
			return (
				<SvgIcon height={66} width={66} viewBox="0 0 24 24" className="fill-slate-300">
					<AvatarIcon/>
				</SvgIcon>
			)
		}

		if (isPetowner) {
			if (users.to_avatar_url) {
				return <Image source={{uri: Api+'/static'+users.to_avatar_url}} resizeMode="cover" className={avatarClass}/>
			} else {
				return <DefaultAvatar/>
			}
		} else if (isPetsitter) {
			if (users.from_avatar_url) {
				return <Image source={{uri: Api+'/static'+users.from_avatar_url}} resizeMode="cover" className={avatarClass}/>
			} else {
				return <DefaultAvatar/>
			}
		}
	}

	const handleUsername = () => {
		if (isPetowner) {
			return users.to_firstname.cap()+' '+users.to_name.cap()
		} else if (isPetsitter) {
			return users.from_firstname.cap()+' '+users.from_name.cap()
		}
	}

	const handleStartChat = useCallback(async () => {
		const { startChat, headerParam } = formatUsersChat(users, false)

		dispatch(setUsersChat(startChat))

		handleSocketEmit('start:chat', startChat)
		users.navigation.navigate('Chat', headerParam)
	}, [users])

	return (
		<Pressable onPress={handleStartChat} className={Class('bg-white flex flex-row rounded-2xl mx-3 shadow items-center px-3 py-3 mb-3')}>
			<View className="bg-white shadow items-center justify-center rounded-full h-[60px] w-[60px] mr-4">
				{ handleAvatar() }
			</View>
			<View style={{width: width - 125}}>
				<View>
					<Text className={Class('text-slate-800 font-semibold text-base')}>{ handleUsername() }</Text>
				</View>
				<View>
					<Text className="text-base text-slate-800">{ users.last_message }</Text>
				</View>
				<View>
					<Text className={Class('text-slate-500 text-right')}>{ dateFormat(users.created_at) }</Text>
				</View>
			</View>
		</Pressable>
	);
};

export default MessagesItem;
