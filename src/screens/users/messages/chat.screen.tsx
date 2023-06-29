import React, { useCallback, useEffect, useRef, useState } from 'react';
import Reanimated, { runOnJS, useDerivedValue, withTiming } from 'react-native-reanimated';
import ChatItem from '@Screen/users/messages/chat.item';
import { useGetUserQuery } from '@Service/api/users.api';
import { Alert, Animated, FlatList, KeyboardAvoidingView, Pressable, Text, TextInput, View } from 'react-native';
import { IRootState } from '@Type/state';
import { IUsers, IUsersMessage } from '@Type/chat';
import { SendIcon } from '@Component/icons/actions';
import { useAppState } from '@react-native-community/hooks';
import { useSelector } from 'react-redux';
import ScreenLayout from '@Component/layouts/screen.layout';
import SvgIcon from '@Component/icons/svg';
import useEvents from '@Hook/useEvents';
import Class from 'classnames';
import ChatLoading from '@Screen/users/messages/chat.loading';
import DotsLoader from '@Component/loader/dots';

let typingTimeout: ReturnType<typeof setTimeout>

/**
 * Écran de conversation entre les deux utilisateurs
 * @constructor
 */
const ChatScreen = () => {
	const [loadMessages, setLoadMessages] = useState<boolean>(true)
	const [hideLoader, setHideLoader] = useState<boolean>(false)
	const [isTyping, setIsTyping] = useState<boolean>(false)
	const [roomUsers, setRoomUsers] = useState<IUsers>()
	const [message, setMessage] = useState<string>('')
	const [messages, setMessages] = useState<IUsersMessage[]>([])
	const [error, setError] = useState<boolean>(false)
	const messageInputRef = useRef<TextInput>() as React.MutableRefObject<TextInput>
	const animatedLoader = useRef(new Animated.Value(-50)).current
	const { app } = useSelector((state: IRootState) => state);
	const { data: user, isLoading } = useGetUserQuery()
	const { socket, handleSocketEmit } = useEvents()
	const currentAppState = useAppState()

	useEffect(() => {
		setTimeout(() => setLoadMessages(false), 1500)
	}, [])

	const opacity = useDerivedValue(() => {
		if (isLoading || loadMessages) {
			return withTiming(1)
		}

		return withTiming(0, undefined, () => {
			runOnJS(handleHideLoader)()
		})
	}, [isLoading, loadMessages])

	function handleHideLoader () {
		setTimeout(() => setHideLoader(true))
	}

	/**
	 * Récupérer l'historique des messages
	 */
	const handleGetMessages = useCallback(() => {
		if (user && roomUsers) {
			handleSocketEmit('get:messages', { from_id: user.id, to_id: roomUsers.to_id })
		}
	}, [user, roomUsers])

	useEffect(() => handleGetMessages(), [handleGetMessages])

	/**
	 * Récupération des infos des utilisateurs
	 */
	const handleGetUsers = useCallback(() => {
		socket.on('chat:users', (users: IUsers) => {
			setRoomUsers(users)
		})

		return () => {
			socket.removeListener('chat:users')
		}
	}, [])

	useEffect(() => handleGetUsers(), [handleGetUsers])

	/**
	 * Attente d'un message
	 * Si message reçu => Scroll vers la fin
	 */
	const handleMessage = useCallback(() => {
		socket.on('message:feedback', (message: IUsersMessage) => {
			setMessages((prevMessage) => [message, ...prevMessage])
			setTimeout(() => {
				setMessages((prevState) => [
					...prevState.map((item) => item.from_id === message.from_id ? { ...item, isNewMessage: false } : item)
				])
			})
		})

		return () => {
			socket.removeListener('message:feedback')
		}
	}, [])

	useEffect(() => handleMessage(), [handleMessage])

	/**
	 * Chargement de tous les messages
	 */
	const handleAllMessages = useCallback(() => {
		socket.on('message:all', (messages: IUsersMessage[]) => {
			if (messages) {
				setMessages(messages)
			}
		})

		return () => {
			socket.removeListener('message:all')
		}
	}, [])

	useEffect(() => handleAllMessages(), [handleAllMessages])

	/**
	 *
	 */
	const handleAppActive = useCallback(() => {
		if (user && roomUsers && currentAppState === 'active') {
			handleSocketEmit('start:chat', roomUsers)
			handleSocketEmit('get:messages', { from_id: user.id, to_id: roomUsers.to_id })
		}
	}, [user, currentAppState, handleSocketEmit])

	useEffect(() => handleAppActive(), [handleAppActive])

	/**
	 *
	 */
	const handleSocketState = useCallback(() => {
		socket.io.on('error', () => {
			//setMessages([])
			setError(true)
		})
		socket.io.on('reconnect', () => {
			if (user && app.usersChat && app.usersChat.to_id) {
				setError(false)
				handleSocketEmit('start:chat', app.usersChat)
				setTimeout(() => {
					handleSocketEmit('get:messages', { from_id: user.id, to_id: app.usersChat.to_id })
				}, 300)
			}
		})
	}, [user, app, handleSocketEmit])

	useEffect(() => handleSocketState(), [handleSocketState])

	/**
	 * Ajout et formatage du message dans le state
	 * @param value
	 */
	const handleChange = (value: string) => {
		const message = value.trim()
			.replace(/\n{2,}/, '\n\n')
			.replace(/\n{3,}/g, '\n')

		setMessage(message)
	}

	const handleAnimTyping = useCallback(() => {
		clearTimeout(typingTimeout)

		if (user && roomUsers && message.length !== 0) {
			const room = {
				from_id: roomUsers.room.petowner, to_id: roomUsers.room.petsitter
			}
			handleSocketEmit('is:typing', room)
			typingTimeout = setTimeout(() => {
				handleSocketEmit('stop:typing', room)
			}, 1000);
		} else if (roomUsers) {
			handleSocketEmit('stop:typing', { from_id: roomUsers.room.petowner, to_id: roomUsers.room.petsitter })
		}
	}, [user, roomUsers, message])

	const handleAnimLoader = useCallback(() => {
		Animated.sequence([
			Animated.spring(animatedLoader, {
				toValue: isTyping ? 20 : -50,
				useNativeDriver: false
			})
		]).start()
	}, [animatedLoader, isTyping])

	useEffect(() => handleAnimLoader(), [handleAnimLoader])

	const handleTyping = useCallback((value: boolean) => {
		setIsTyping(value)
	}, [])

	useEffect(() => {
		socket.on('typing', () => handleTyping(true))
		socket.on('stoptyping', () => handleTyping(false))

		return () => {
			socket.removeListener('typing', () => handleTyping(true))
			socket.removeListener('stoptyping', () => handleTyping(false))
		}
	}, [handleTyping])

	/**
	 * Soumission du message
	 * Réinitialisation de l'input
	 */
	const handleSubmit = useCallback(() => {
		if (message.length === 0) return // Alert erreur
		if (!roomUsers) return // Alert erreur
		if (error) {
			return Alert.alert('Vous êtes actuellement hors ligne', 'Veuillez patientez pendant la tentative de reconnexion...')
		}

		handleSocketEmit('message', { ...roomUsers, message })
		messageInputRef.current.clear()
		setMessage('')

		const room = {
			from_id: roomUsers.room.petowner, to_id: roomUsers.room.petsitter
		}
		setTimeout(() => {
			handleSocketEmit('stop:typing', room)
		}, 300)
	}, [message, roomUsers, error])

	return (
		<ScreenLayout classNames="flex-1">
			<Animated.View className="absolute rounded-2xl items-center right-0 left-0 z-20" style={{top: animatedLoader}}>
				<DotsLoader/>
			</Animated.View>
			<KeyboardAvoidingView behavior="height" keyboardVerticalOffset={100} style={{flex: 1}}
														contentContainerStyle={{flex: 1, justifyContent: 'space-between', flexDirection: 'column'}}>
				<Reanimated.View style={{opacity}} className={Class('absolute z-10 w-full h-full bg-gray-100', hideLoader && 'hidden')}>
					<ChatLoading/>
				</Reanimated.View>
				{
					messages.length !== 0 && user ? (
						<>
							<FlatList data={messages} inverted extraData={messages} scrollEventThrottle={16} removeClippedSubviews={true}
												keyboardShouldPersistTaps="handled" contentContainerStyle={{flexGrow: 1, paddingBottom: 13, justifyContent: 'flex-start'}}
												keyExtractor={(_, index) => index.toString()}
												renderItem={({ item, index }) => {
													return (
														<ChatItem key={index} { ...item } index={index} length={messages.length} current_user={user}/>
													)
												}}
							/>
						</>
					) : (
						<View className="p-3 flex-1 items-center justify-center">
							<Text></Text>
						</View>
					)
				}
				<View className="bg-white shadow h-1"/>
				<View className="px-3 justify-end pb-7 pt-3" style={{maxHeight: 215}}>
					<TextInput ref={messageInputRef} onKeyPress={handleAnimTyping} onChangeText={(value) => handleChange(value)} numberOfLines={5} textAlignVertical="top" multiline placeholder="Votre message" className="bg-white shadow font-text text-[15px] rounded-2xl py-[12px] px-3 w-[86%]"/>
					<Pressable onPress={handleSubmit} className="absolute right-2 bottom-7 h-[47px] w-[47px] items-center justify-center">
						<SvgIcon viewBox="0 0 24 24" height={32} width={32} className="fill-primary right-0.5">
							<SendIcon/>
						</SvgIcon>
					</Pressable>
				</View>
			</KeyboardAvoidingView>
		</ScreenLayout>
	);
};

export default ChatScreen;
