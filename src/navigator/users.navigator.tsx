import React, { useEffect, useState } from 'react';
import { headerShown } from '@Navigator/options/screen.options';
import { modalGesture, tabModalGesture, tabScreen } from '@Navigator/options/tab.options';
import { useGetUserQuery, usePingUserQuery } from '@Service/api/users.api';
import { IRootState } from '@Type/state';
import { RoleEnum } from '@Type/profile';
import { INativeStackNavigator, IRootStackProps, IRouteUsers } from '@Type/stack';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { isFetchBaseQueryError } from '@Config/api';
import { TouchTrackerProvider } from 'react-native-touch-tracker';
import {
	CreateAnimalScreen, DisablePetsitterScreen,
	FilterScreen,
	HomeScreen, MapScreen,
	MenuScreen,
	MessagesAllScreen,
	ProfileScreen, SettingsScreen, StepsPetsitterScreen,
	UpdateProfileScreen,
	WelcomePetsitterScreen, ConfirmPetsitterScreen, ProfilePetsitterScreen
} from '@Screen/users';
import BottomTabs from '@Navigator/tabs/bottomTabs';
import Header from '@Navigator/partials/header';
import useEvents from '@Hook/useEvents';
import useUsers from '@Hook/useUsers';

/**
 * Routes protégées
 * @constructor
 */
const UsersNavigator = (Stack: INativeStackNavigator) => {
	const navigation = useNavigation<IRootStackProps<IRouteUsers>['navigation']>()
	const [route, setRoute] = useState<{ name: IRouteUsers }>({ name: 'Home' });
	const { app, auth } = useSelector((state: IRootState) => state);
	const { error } = usePingUserQuery(undefined, { pollingInterval: 10000, skip: app.accessGuest || !auth.isAuth })
	const { data: user } = useGetUserQuery()
	const { handleSocketState, handleUnauthorized, handleSocketError } = useEvents()
	const { handleLogout } = useUsers()

	/**
	 * Connexion à socket.io
	 */
	useEffect(() => {
		handleSocketState()
	}, [handleSocketState]);

	/**
	 * Gestion des erreurs socket.io
	 */
	useEffect(() => {
		handleSocketError();
	}, [route.name, handleSocketError])

	/**
	 * Si erreur 401
	 * => handleLogout() + message d'erreur
	 */
	useEffect(() => {
		if (isFetchBaseQueryError(error) && error.status === 401) {
			handleUnauthorized(() => handleLogout(navigation, false,
				{
					type: 'error',
					text1: 'Votre connexion a expiré',
					text2: 'Veuillez vous authentifier à nouveau.',
					topOffset: 50,
					position: 'top'
				}
			))
		}
	}, [error, handleUnauthorized])

	/**
	 * Ajoute les noms des routes au state
	 * Permet de connaître la route courante pour le composant BottomTabs
	 * @param route
	 */
	const handleState = (route: IRouteUsers) => ({
		state: () => setRoute({ name: route })
	});

	return (
		<TouchTrackerProvider style={{flex: 1}}>
			<Stack.Navigator initialRouteName={auth.isAuth ? 'Map' : 'Welcome'}>
				{
					auth.isAuth && (
						<>
							<Stack.Group screenOptions={{header: (props) => <Header { ...props }/>}}>
								<Stack.Screen name="Home" options={{gestureEnabled: false, title: 'Réservations'}} listeners={({ route }) => handleState(route.name)} component={HomeScreen}/>
								<Stack.Screen name="Messages" options={{gestureEnabled: false, title: 'Messages'}} listeners={({ route }) => handleState(route.name)} component={MessagesAllScreen}/>
								<Stack.Screen name="Menu" options={{gestureEnabled: false, title: 'Menu'}} listeners={({ route }) => handleState(route.name)} component={MenuScreen}/>
								<Stack.Screen name="Settings" options={{title: 'Paramètres'}} listeners={({ route }) => handleState(route.name)} component={SettingsScreen}/>
								<Stack.Screen name="ProfileUpdate" options={{...modalGesture, title: 'Modifier le profil'}} listeners={({ route }) => handleState(route.name)} component={UpdateProfileScreen}/>
								<Stack.Screen name="ConfirmPetsitterScreen" options={{title: 'Vous êtes pet-sitter', gestureEnabled: false}} listeners={({ route }) => handleState(route.name)} component={ConfirmPetsitterScreen}/>
							</Stack.Group>
							<Stack.Group>
								<Stack.Screen name="Profile" options={{gestureEnabled: false, ...headerShown}} listeners={({ route }) => handleState(route.name)} component={ProfileScreen}/>
								<Stack.Screen name="PetsitterProfile" options={{gestureEnabled: true, ...headerShown}} listeners={({ route }) => handleState(route.name)} component={ProfilePetsitterScreen}/>
								<Stack.Screen name="Filter" options={{...headerShown, presentation: 'modal'}} listeners={({ route }) => handleState(route.name)} component={FilterScreen}/>
								<Stack.Screen name="AnimalCreate" options={tabModalGesture} listeners={({ route }) => handleState(route.name)} component={CreateAnimalScreen}/>
								<Stack.Screen name="AnimalUpdate" options={tabModalGesture} listeners={({ route }) => handleState(route.name)} component={CreateAnimalScreen}/>
							</Stack.Group>
							{
								user && user.profile.role == RoleEnum.PETOWNER ? (
									<Stack.Group screenOptions={{header: (props) => <Header { ...props }/>}}>
										<Stack.Screen name="PetsitterWelcome" options={{title: 'Devenez Pet-sitter'}} listeners={({ route }) => handleState(route.name)} component={WelcomePetsitterScreen}/>
										<Stack.Screen name="PetsitterSteps" options={{gestureEnabled: false, presentation: 'modal', title: 'Créer votre profil pet-sitter'}} listeners={({ route }) => handleState(route.name)} component={StepsPetsitterScreen}/>
									</Stack.Group>
								) : (
									<Stack.Group screenOptions={{header: (props) => <Header { ...props }/>}}>
										<Stack.Screen name="PetsitterDisableProfile" options={{title: 'Désactiver le mode pet-sitter'}} listeners={({ route }) => handleState(route.name)} component={DisablePetsitterScreen}/>
									</Stack.Group>
								)
							}
						</>
					)
				}
				<Stack.Screen name="Map" listeners={({ route }) => handleState(route.name)} options={tabScreen} component={MapScreen}/>
			</Stack.Navigator>
			<BottomTabs { ...route }/>
		</TouchTrackerProvider>
	);
};

export default UsersNavigator;
