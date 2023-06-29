import Toast, { ToastShowParams } from 'react-native-toast-message';
import { Alert } from 'react-native';
import { usersApi } from '@Service/api/users.api';
import { IRootStackProps, IRouteUsers } from '@Type/stack';
import SInfo from 'react-native-sensitive-info';
import RNFS from 'react-native-fs';
import { Logout } from '@Action/auth.action';
import { removeStorage } from '@Helper/storage';
import { setLogout } from '@Reducer/auth.reducer';
import { useDispatch } from 'react-redux';
import { setAccessGuest, setLoadingMap } from '@Reducer/app.reducer';
import useEvents from '@Hook/useEvents';

const useUsers = () => {
	const dispatch = useDispatch()
	const { socket } = useEvents()

	/**
	 * Déconnexion de l'utilisateur
	 * @param navigation
	 * @param isAlert
	 * @param toast
	 */
	const handleLogout = async (
		navigation: IRootStackProps<IRouteUsers>['navigation'],
		isAlert: boolean,
		toast?: ToastShowParams) => {
		const logout = async () => {
			Logout().then(async (revoked) => {
				if (revoked) {
					await removeStorage('petsitterProfile')
					await removeStorage('isAuth')
					await SInfo.deleteItem('user', {
						sharedPreferencesName: 'sharedUserToken',
						keychainService: 'keychainUserToken'
					})

					RNFS.readDir(RNFS.TemporaryDirectoryPath)
						.then((result) => {
							result.forEach((file) => {
								RNFS.unlink(file.path)
									.then()
									.catch((error) => {
										console.log(error);
									});
							});
						})
						.catch((error) => {
							console.log(error);
						});

					dispatch(setAccessGuest(false));
					dispatch(setLoadingMap(false));
					dispatch(setLogout());
					dispatch(usersApi.util.resetApiState())

					socket.disconnect()
					navigation.reset({
						index: 0,
						routes: [{ name: 'Welcome' } ]
					})
					if (toast) {
						Toast.show({ ...toast, position: 'top' })
					}
				}
			})
		}

		if (isAlert) {
			Alert.alert('Confirmer la déconnexion', '', [
				{
					text: 'Déconnexion',
					style: 'destructive',
					isPreferred: true,
					onPress: () => logout()
				},
				{
					text: 'Annuler',
					style: 'cancel',
					onPress: () => false
				}
			])
		} else {
			await logout()
		}
	}

	return {
		handleLogout
	}
};

export default useUsers;
