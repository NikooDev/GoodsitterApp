import React, { useCallback, useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import MessagesItem from '@Screen/users/messages/messages.item';
import { useGetRoomQuery } from '@Service/api/rooms.api';
import { useGetUserQuery } from '@Service/api/users.api';
import { Dimensions, FlatList, View } from 'react-native';
import { RoleEnum } from '@Type/profile';
import Animated, { runOnJS, useDerivedValue, withTiming } from 'react-native-reanimated';
import { IRoom } from '@Type/chat';
import { IRootStackProps } from '@Type/stack';
import { useIsFocused } from '@react-navigation/native';
import ScreenLayout from '@Component/layouts/screen.layout';
import Text from '@Component/ui/text';
import MessagesLoading from '@Screen/users/messages/messages.loading';
import Class from 'classnames';
import useEvents from '@Hook/useEvents';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

/**
 * Écran de la liste des conversations
 * @constructor
 */
const MessagesAllScreen = ({ navigation }: IRootStackProps<'Messages'>) => {
	const [refetching, setRefetching] = useState<boolean>(false)
	const [hideLoader, setHideLoader] = useState<boolean>(false)
	const { width } = Dimensions.get('screen')
	const { data: rooms, isLoading: loadingRooms, refetch } = useGetRoomQuery()
	const { data: user, isLoading } = useGetUserQuery();
	const { handleSocketEmit } = useEvents()
	const isFocused = useIsFocused();

	useEffect(() => {
		refetch()
	}, [refetch])

	const opacity = useDerivedValue(() => {
		if (isLoading || loadingRooms || refetching) {
			return withTiming(1)
		}

		return withTiming(0, undefined, () => {
			runOnJS(handleHideLoader)()
		})
	}, [isLoading, loadingRooms, refetching])

	function handleHideLoader () {
		setHideLoader(true)
	}

	const handleRefresh = useCallback(() => {
		setRefetching(true)
		setHideLoader(false)
		refetch()
		setTimeout(() => {
			setRefetching(false)
		}, 1000)
	}, [refetch])

	const handleInitRoom = useCallback(() => {
		handleSocketEmit('leave:chat')
	}, [])

	useEffect(() => {
		if (isFocused) {
			handleInitRoom()
		}
	}, [isFocused])

	return (
		<ScreenLayout classNames="flex-1">
			<Text className="px-5 pt-3 font-medium text-lg text-slate-800">Conversations</Text>
			<Text className="text-xs px-5 text-slate-500 text-[14px] mb-3">Glissez vers le bas pour recharger la liste.</Text>
			{
				rooms && rooms.length === 0 && (
					<View className="items-center mt-10 mb-2">
						<Text className="font-medium text-base text-slate-800 mb-2">Aucune conversation</Text>
						{
							user && user.profile.role == RoleEnum.PETOWNER ? (
								<Text className="px-5 text-slate-500 text-[14px] text-center">Lorsque vous contactez un pet-sitter, la conversation est automatiquement créée ici.</Text>
							) : (
								<Text className="px-5 text-slate-500 text-[14px] text-center">Lorsqu'un propriétaire vous contacte, la conversation est automatiquement créée ici.</Text>
							)
						}

					</View>
				)
			}
			<Animated.View style={{opacity}} className={Class('absolute z-10 w-full h-full mt-[70px] bg-gray-100', hideLoader && 'hidden')}>
				{ Array(7).fill(true).map((_, i) => <MessagesLoading key={i} />) }
			</Animated.View>
			<AnimatedLinearGradient style={{opacity, width: width}} className={Class('absolute h-full z-40', hideLoader && 'hidden')} start={{x: 0, y: -.4}} end={{x: 0, y: 1}} colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}/>
			{
				rooms && user && (
					<FlatList data={rooms} extraData={rooms} className={Class(rooms.length === 0 && 'opacity-0')} refreshing={refetching} onRefresh={handleRefresh}
										keyExtractor={(item: IRoom) => item.room_id}
										contentContainerStyle={{paddingBottom: 120, paddingTop: 10}}
										renderItem={({ item, index }) => (
											<MessagesItem key={index} current_user={user} navigation={navigation} { ...item }/>
										)}
					/>
				)
			}
		</ScreenLayout>
	);
};

export default MessagesAllScreen;
