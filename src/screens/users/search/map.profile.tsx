import React, { memo, useCallback, useState } from 'react';
import { ActivityIndicator, Image, Pressable, View } from 'react-native';
import { RoleEnum } from '@Type/profile';
import { Api } from '@Config/api';
import { IMapProfileProps } from '@Type/map';
import { IRootState } from '@Type/state';
import { AvatarIcon, StarIcon, StarOutlinedIcon } from '@Component/icons';
import { NotificationIcon, PoiDelete } from '@Component/icons/map.icon';
import { cap, formatUsersChat } from '@Helper/functions';
import { useDispatch, useSelector } from 'react-redux';
import Text from '@Component/ui/text';
import SvgIcon from '@Component/icons/svg';
import Class from 'classnames';
import { getPetsitter } from '@Action/petsitter.action';
import useEvents from '@Hook/useEvents';
import { useGetUserQuery } from '@Service/api/users.api';
import { createRoom } from '@Action/room.action';
import { roomsApi } from '@Service/api/rooms.api';
import { setUsersChat } from '@Reducer/app.reducer';

const MapProfile: React.FC<IMapProfileProps> = ({ petMarker, navigation, handleZoomOut }) => {
	const [loadingProfile, setLoadingProfile] = useState<boolean>(false);
	const { app } = useSelector((state: IRootState) => state)
	const fullStar = Math.round(petMarker.rating)
	const emptyStar = 5 - fullStar
	const rating = petMarker.rating && petMarker.rating.toFixed(1)
	const { data: user } = useGetUserQuery()
	const { handleSocketEmit } = useEvents()
	const dispatch = useDispatch()

	const handleRating = (count: number, isFilled: boolean) => {
		return Array.from({ length: count }).map((_, index) => (
			<SvgIcon key={index} viewBox="0 0 24 24" className={Class(isFilled ? 'fill-yellow-400' : 'fill-gray-300')} height={22} width={22}>
				{
					isFilled ? <StarIcon/> : <StarOutlinedIcon/>
				}
			</SvgIcon>
		));
	}

	const handleGetProfile = useCallback(async () => {
		if (app.accessGuest) {
			navigation.navigate('Login', { deny: true })
		} else {
			setLoadingProfile(true)
			const res = await getPetsitter(petMarker.petsitter_id)

			navigation.navigate('PetsitterProfile', { petsitter: JSON.stringify({ ...res, ...petMarker, fullStar, emptyStar }) })
			setTimeout(() => setLoadingProfile(false), 200)
		}
	}, [app, petMarker])

	const handleMessage = async () => {
		if (user) {
			const res = await createRoom(user.id, petMarker.petsitter_id)

			if (res.ok) {
				dispatch(roomsApi.util.resetApiState())

				const users = {
					current_user: { profile: { role: user.profile.role } },
					...res.users
				}
				const { startChat, headerParam } = formatUsersChat(users, true)

				dispatch(setUsersChat(startChat))

				handleSocketEmit('start:chat', startChat)
				navigation.navigate('Chat', headerParam)
			} else {

			}
		}
	}

	return (
		<View className="px-5 flex-1">
			<Pressable onPress={handleZoomOut} className="bg-white shadow h-14 w-14 rounded-full absolute -top-[90px] right-0 items-center justify-center">
				<SvgIcon viewBox="0 0 24 24" width={38} height={38} className="fill-primary">
					<PoiDelete/>
				</SvgIcon>
			</Pressable>
			<View className="flex-row items-center">
				{
					petMarker.avatar_url ? (
						<View className="bg-white shadow rounded-full h-20 w-20">
							<Image source={{uri: Api+'/static'+petMarker.avatar_url, cache: 'reload'}}
										 resizeMode="cover" className="rounded-full h-20 w-20" style={{ borderWidth: 2, borderColor: '#fff' }}/>
						</View>
					) : (
						<View className="w-20 h-20 bg-white shadow rounded-full items-center justify-center">
							<SvgIcon viewBox="0 0 24 24" className="h-20 w-20 fill-primary">
								<AvatarIcon/>
							</SvgIcon>
						</View>
					)
				}
				<View className="ml-3 flex-1">
					<Text ellipsizeMode="tail" numberOfLines={1}>
						<Text className="text-lg text-slate-800 font-medium">{ cap(petMarker.firstname) }</Text>{' '}
						<Text className="text-lg text-slate-800 font-medium">{ cap(petMarker.name) }</Text>
					</Text>
					<Text className="text-slate-400 font-medium">{ petMarker.role == RoleEnum.PETSITTER ? 'Petsitter' : 'Propriétaire' }</Text>
					<View className={Class('flex-row items-center -ml-0.5', petMarker.role == RoleEnum.PETSITTER && 'mt-1')}>
						{
							petMarker.role == RoleEnum.PETSITTER && (
								petMarker.rating > 0.0 && (
									<>
										{ handleRating(fullStar, true) }
										{ handleRating(emptyStar, false) }
										<Text className="ml-1.5 top-[1.5px]">{ rating === '5.0' ? '5' : rating }/5</Text>
									</>
								)
							)
						}
					</View>
				</View>
			</View>
			{
				petMarker.title && <Text className="mt-2 text-slate-800 font-medium">{ cap(petMarker.title) }</Text>
			}
			{
				petMarker.role == RoleEnum.PETSITTER ? (
					<View className="flex-row mt-auto mb-3">
						<Pressable onPress={() => app.accessGuest ? navigation.navigate('Login', { deny: true }) : handleMessage()}
											 className="bg-primary px-5 py-2.5 w-[73%]" style={{borderTopRightRadius: 10, borderTopLeftRadius: 50, borderBottomRightRadius: 10, borderBottomLeftRadius: 50}}>
							<Text className="text-white font-medium text-center text-ellipsis" numberOfLines={1}>Contacter { cap(petMarker.firstname) }</Text>
						</Pressable>
						<Pressable onPress={handleGetProfile}
											 className="bg-slate-400 px-5 py-2.5 ml-auto w-[25%] items-stretch" style={{borderTopRightRadius: 50, borderTopLeftRadius: 10, borderBottomRightRadius: 50, borderBottomLeftRadius: 10}}>
							<View>
								{
									loadingProfile ? (
										<>
											<ActivityIndicator color="#fff"/>
										</>
									) : (
										<Text className="text-white font-medium text-center">Profil</Text>
									)
								}
							</View>
						</Pressable>
					</View>
				) : (
					<View className="flex-row mt-auto mb-3">
						<Pressable className="flex-row bg-primary px-3 py-2 rounded-full w-full items-center">
							<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-white mr-2">
								<NotificationIcon/>
							</SvgIcon>
							<Text className="text-white font-medium text-center text-ellipsis" style={{ width: 250 }} numberOfLines={1}>
								Envoyer une alerte à { cap(petMarker.firstname) }
							</Text>
						</Pressable>
					</View>
				)
			}
		</View>
	)
}

export default memo(MapProfile)
