import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Api } from '@Config/api';
import { Image, View } from 'react-native';
import { IUsersMessage } from '@Type/chat';
import { IUser } from '@Type/users';
import { ViewRef } from '@Type/app';
import * as Animatable from 'react-native-animatable'
import { AvatarIcon } from '@Component/icons';
import SvgIcon from '@Component/icons/svg';
import Class from 'classnames';
import Text from '@Component/ui/text';

const ChatItem = (message: IUsersMessage & { current_user: IUser, index: number, length: number }) => {
	const currentUser = message.from_id === message.current_user.id
	const otherUser = message.from_role !== message.current_user.profile.role
	const animateViewRef = useRef<Animatable.View & View & ViewRef>(null)

	const handleAnimateMessage = useCallback(() => {
		if (animateViewRef.current) {
			if (message.isNewMessage) {
				if (currentUser) {
					animateViewRef.current.animate('slideInRight')
				} else {
					animateViewRef.current.animate('slideInLeft')
				}
			}
		}
	}, [message.isNewMessage, animateViewRef, currentUser])

	useEffect(() => {
		handleAnimateMessage()
	}, [handleAnimateMessage])

	const handleAvatar = () => {
		const avatarClass = 'h-9 w-9 rounded-full'

		const DefaultAvatar = () => {
			return (
				<SvgIcon height={43} width={43} viewBox="0 0 24 24" className="fill-slate-300">
					<AvatarIcon/>
				</SvgIcon>
			)
		}

		if (otherUser) {
			if (message.from_avatar_url) {
				return <Image source={{uri: Api + '/static/' + message.from_avatar_url}} resizeMode="cover"
											className={avatarClass}/>
			} else {
				return <DefaultAvatar/>
			}
		} else {
			if (message.to_avatar_url) {
				return <Image source={{uri: Api + '/static/' + message.to_avatar_url}} resizeMode="cover"
											className={avatarClass}/>
			} else {
				return <DefaultAvatar/>
			}
		}
	}

	return (
		<Animatable.View ref={animateViewRef} duration={350} useNativeDriver className="px-3">
			<View className="flex-row items-start mb-3">
				{
					!currentUser && (
						<View className="bg-white shadow h-10 w-10 rounded-full mr-2 mt-0.5 justify-center items-center">
							{ handleAvatar() }
						</View>
					)
				}
				<View className={Class(currentUser ? 'bg-primary ml-auto' : 'bg-white mr-auto', 'shadow px-3 pt-2.5 pb-3 max-w-[80%] self-start rounded-2xl align-baseline')}>
					<Text className={Class(currentUser && 'text-white', 'text-[16px]', !currentUser && 'items-center')}>{ message.message }</Text>
				</View>
			</View>
		</Animatable.View>
	)
};

export default memo(ChatItem);
