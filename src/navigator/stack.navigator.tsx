import React, { useEffect } from 'react';
import { guideScreen, headerShown, loginScreen, welcomeScreen } from '@Navigator/options/screen.options';
import { tabScreen } from '@Navigator/options/tab.options';
import { NavigatorTheme } from '@Asset/theme';
import { IRootState } from '@Type/state';
import { IRootStackParamList } from '@Type/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GuideScreen, WelcomeScreen, LoginScreen, SignupScreen } from '@Screen/guest';
import { ChatScreen } from '@Screen/users';
import UsersNavigator from '@Navigator/users.navigator';
import LoaderLayout from '@Component/layouts/loader.layout';
import Header from '@Navigator/partials/header';
import useStorage from '@Hook/useStorage';
import LoaderUpload from '@Component/loader/loaderUpload';

const Stack = createNativeStackNavigator<IRootStackParamList>();



/**
 * Routes visiteurs
 * @constructor
 */
const StackNavigator = () => {
	const { app, auth } = useSelector((state: IRootState) => state);
	const { handleGetStorage } = useStorage()
	const appLoading = app.guideDone === undefined || auth.isAuth === undefined;

	useEffect(() => {
		handleGetStorage();
	}, [handleGetStorage]);

	return (
		<LoaderLayout appLoading={appLoading}>
			<LoaderUpload/>
			<NavigationContainer theme={NavigatorTheme}>
				<Stack.Navigator initialRouteName="Welcome">
					{
						!auth.isAuth && (
							<Stack.Group>
								{
									!app.guideDone && (
										<Stack.Screen name="Guide" options={guideScreen} component={GuideScreen}/>
									)
								}
								<Stack.Screen name="Welcome" options={welcomeScreen} component={WelcomeScreen}/>
								<Stack.Screen name="Login" options={loginScreen} component={LoginScreen}/>
								<Stack.Screen name="Signup" options={headerShown} component={SignupScreen}/>
							</Stack.Group>
						)
					}
					<Stack.Screen options={{...tabScreen}} name="MapUsers">
						{ props => <UsersNavigator {...props} {...Stack} /> }
					</Stack.Screen>
					{
						auth.isAuth && (
							<Stack.Group screenOptions={{header: (props) => <Header { ...props }/>}}>
								<Stack.Screen name="Chat" component={ChatScreen}/>
							</Stack.Group>
						)
					}
				</Stack.Navigator>
			</NavigationContainer>
		</LoaderLayout>
	);
};

export default StackNavigator;
