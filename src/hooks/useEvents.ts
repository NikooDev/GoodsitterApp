import Ws from '@Service/socket';
import Toast from 'react-native-toast-message';
import { useGetUserQuery } from '@Service/api/users.api';
import { StatusEnum } from '@Type/profile';
import { useCallback, useRef } from 'react';
import { useAppState } from '@react-native-community/hooks';

const useEvents = () => {
	const { data: user, isLoading } = useGetUserQuery()
	const { current: socket } = useRef(Ws)
	const currentAppState = useAppState()

	/**
	 * Gestion de l'état de Socket.io et de l'utilisateur
	 */
	const handleSocketState = useCallback(() => {
		switch (currentAppState) {
			case 'active':
				socket.connect()
				if (!isLoading && user) {
					const newUser = {
						user_id: user.id, name: user.profile.name, firstname: user.profile.firstname,
						avatar_url: user.profile.avatar_url, role: user.profile.role, status: StatusEnum.ONLINE
					}
					socket.emit('user:connect', newUser)
				}
				break
			case 'inactive':
				/**
				 * Mettre le status de l'utilisateur en 'offline'
				 */
				!isLoading && user && socket.emit('user:inactive', { id: user.id, status: StatusEnum.OFFLINE })
				socket.disconnect()
				break
			default:
				socket.disconnect()
		}
	}, [currentAppState, isLoading, user])

	const handleSocketEmit = useCallback((event: string, values?: object | string | number) => {
		socket.emit(event, values)
	}, [socket])

	/**
	 * Gestion de reconnexion et des erreurs Socket.io
	 */
	const handleSocketError = useCallback(() => {
		if (!isLoading && user) {
			socket.io.on('reconnect', () => {
				const newUser = {
					user_id: user.id, name: user.profile.name, firstname: user.profile.firstname,
					avatar_url: user.profile.avatar_url, role: user.profile.role, status: StatusEnum.ONLINE
				}
				socket.emit('user:connect', newUser)
				Toast.hide()
				setTimeout(() => {
					Toast.show({
						type: 'success',
						text1: 'Vous êtes de nouveau connecté',
						autoHide: true,
						position: 'top',
						topOffset: 48
					})
				}, 500)
			})
			socket.io.on('error', () => {
				Toast.show({
					type: 'error',
					text1: 'Vous êtes hors ligne',
					text2: 'Tentative de reconnexion en cours...',
					autoHide: false,
					position: 'top',
					topOffset: 48
				})
			})
		}
	}, [isLoading, user])

	/**
	 * Si erreur 401
	 * Envoi d'un message d'erreur
	 * Exécution du callback
	 */
	const handleUnauthorized = useCallback((callback: () => void) => {
		callback()
	}, [])

	return {
		handleSocketEmit, handleSocketState, handleUnauthorized, handleSocketError, socket
	}
}

export default useEvents
