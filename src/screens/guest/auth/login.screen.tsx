import React, { useEffect, useRef, useState } from 'react';
import Theme from '@Asset/theme';
import {
	View,
	TextInput,
	ScrollView,
	Pressable,
	KeyboardAvoidingView,
	Platform,
	ActivityIndicator, Alert, GestureResponderEvent
} from 'react-native';
import { ILogin } from '@Type/auth';
import { IRootStackProps } from '@Type/stack';
import { useDispatch } from 'react-redux';
import { setStorage } from '@Helper/storage';
import { setLoginSuccess } from '@Reducer/auth.reducer';
import { setAccessGuest, setLoadingMap } from '@Reducer/app.reducer';
import { Login } from '@Action/auth.action'
import { BackIcon } from '@Component/icons/navigation.icon';
import { FacebookIcon, GoogleIcon } from '@Component/icons/social.icon';
import ScreenLayout from '@Component/layouts/screen.layout';
import Text from '@Component/ui/text';
import LogoIcon from '@Component/icons/logo.icon';
import SvgIcon from '@Component/icons/svg';

const LoginScreen = ({ navigation, route }: IRootStackProps<'Login'>) => {
	const [login, setLogin] = useState<ILogin>({email: '', password: ''});
	const [loading, setLoading] = useState<boolean>(false);
	const [valid, setValid] = useState<boolean>(false);
	const [hideErrorMsg, setHideErrorMsg] = useState<boolean>(false)
	const emailRef = useRef() as React.MutableRefObject<TextInput>;
	const passwordRef = useRef() as React.MutableRefObject<TextInput>;
	const dispatch = useDispatch();

	useEffect(() => {
		if (login.email.length > 0 && login.password.length > 0) {
			setValid(true)
		} else {
			setValid(false)
		}
	}, [login])

	const handleChange = (name: string, value: string) => {
		setLogin({...login, [name]: value})
	}

	const handleNextEditing = () => {
		if (login.email.length > 0 && login.password.length === 0) {
			passwordRef.current.focus()
		}
	}

	const handleSignup = () => {
		navigation.popToTop()
		navigation.navigate('Signup')
	}

	const handleSubmit = (event: GestureResponderEvent) => {
		event.preventDefault()

		if (!loading && valid && login.email.length > 0 && login.password.length > 0) {
			if (!login.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
				Alert.alert('Votre adresse e-mail est incorrecte', '', [{
					onPress: () => emailRef.current.focus()
				}])
				return
			} else {
				setLoading(true)

				new Promise(resolve => setTimeout(resolve, 1000)).then(async () => {
					const { authenticated, error } = await Login(login)

					if (authenticated) {
						dispatch(setAccessGuest(false))
						dispatch(setLoadingMap(false))
						await setStorage('isAuth', 'logged').then(() => {
							navigation.popToTop()
						})
						dispatch(setLoginSuccess())
					} else {
						setLoading(false)

						switch (error) {
							case 1:
								setLogin({ ...login, password: '' })
								Alert.alert('Mot de passe incorrect', 'Vous avez oublié votre mot de passe ?', [
									{
										text: 'Mot de passe oublié',
										style: 'default',
										onPress: () => false
									},
									{
										text: 'Réessayer',
										style: 'cancel',
										onPress: () => passwordRef.current.focus()
									}
								])
								break
							case 2:
								Alert.alert('Aucun compte trouvé', 'L\'adresse e-mail ne correspond à aucun compte.', [
									{
										text: 'Réessayer',
										style: 'cancel',
										onPress: () => emailRef.current.focus()
									}
								])
								break
							default:
								Alert.alert('Erreur serveur', 'Le serveur rencontre un problème. Veuillez réessayer un peu plus tard.')
						}
					}
				})
			}
		} else {
			setLoading(false)

			if (login.email.length === 0) {
				Alert.alert('Votre adresse e-mail est requise', '', [{
					onPress: () => emailRef.current.focus()
				}])
				return
			}
			if (login.password.length === 0) {
				Alert.alert('Veuillez indiquer votre\nmot de passe', '', [{
					onPress: () => passwordRef.current.focus()
				}])
			}
		}
	}

	return (
		<ScreenLayout classNames="flex-1 bg-primary items-center pt-8" statusBarStyle="light-content">
			<View className="flex items-center w-full mb-8">
				<View className="flex items-center justify-center rounded-full bg-white h-14 w-14 shadow-md">
					<SvgIcon height={37} width={37} fill={Theme.colors.primary} viewBox="0 0 128 128">
						<LogoIcon/>
					</SvgIcon>
				</View>
			</View>
			<ScrollView contentContainerStyle={{flex: 1}} className="bg-white rounded-tl-3xl rounded-tr-3xl w-full shadow-md pt-5 pb-8">
				<Pressable onPress={() => navigation.goBack()} className="flex flex-row items-center px-5 w-28 py-2 z-10">
					<SvgIcon height={24} width={24} viewBox="0 0 24 24">
						<BackIcon/>
					</SvgIcon>
					<Text className="font-text font-medium text-darkText ml-1 tracking-tight">Retour</Text>
				</Pressable>
				<Text className="mx-auto font-medium text-lg mt-2">Connectez-vous</Text>
				{ route.params && route.params.deny && !hideErrorMsg &&
					<Text className="text-center font-text text-red-500 font-semibold pt-3 px-5 tracking-tight">
						Veuillez vous connecter ou créer un{'\n'}compte pour continuer.
					</Text>
				}
				<KeyboardAvoidingView keyboardVerticalOffset={50} className="justify-center w-full h-full my-auto" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
					<TextInput
						ref={emailRef}
						keyboardType="email-address"
						autoCapitalize="none"
						placeholder="Adresse e-mail"
						placeholderTextColor="#919bb2"
						editable={!loading}
						textContentType="emailAddress"
						returnKeyType="next"
						cursorColor="#1e293b"
						selectionColor="#536281"
						autoCorrect={false}
						textAlignVertical="center"
						value={login.email}
						onFocus={() => setHideErrorMsg(true)}
						onEndEditing={handleNextEditing} onChangeText={(text) => handleChange('email', text)}
						className="h-[45px] text-[#404346] border-b-2 border-gray-200 focus:border-primary focus:text-primary w-full font-text tracking-tight py-0 px-5 mb-3 text-[17px]" />
					<TextInput
						ref={passwordRef}
						secureTextEntry
						placeholder="Mot de passe"
						placeholderTextColor="#919bb2"
						editable={!loading}
						textContentType="password"
						returnKeyType="done"
						cursorColor="#1e293b"
						selectionColor="#536281"
						autoCorrect={false}
						textAlignVertical="center"
						value={login.password}
						onFocus={() => setHideErrorMsg(true)}
						onChangeText={(text) => handleChange('password', text)}
						className="h-[45px] text-[#404346] border-b-2 border-gray-200 focus:border-primary focus:text-primary w-full font-text tracking-tight py-0 px-5 mb-3 text-[17px]" />
					<View className="px-5">
						<Pressable disabled={loading} onTouchStart={(event) => handleSubmit(event)}
											 className="flex items-center justify-center bg-primary rounded-full h-12 disabled:opacity-60">
							{
								loading ? (
									<ActivityIndicator style={{transform: [{scale: 1.3}]}} color="#fff"/>
								) : (
									<Text className="text-white text-base font-medium font-text tracking-tight">Se connecter</Text>
								)
							}
						</Pressable>
						<Text className="font-text font-medium text-darkText text-center mt-5 tracking-tight">Mot de passe oublié ?</Text>
					</View>
				</KeyboardAvoidingView>
				<View className="w-full px-5 mb-5 mt-5">
					<Pressable className="flex flex-row items-center bg-[#3b5998] rounded-full h-10 px-[5px] w-full mb-3 pl-1.5">
						<SvgIcon height={28} width={28} fill="#fff" viewBox="0 0 24 24">
							<FacebookIcon/>
						</SvgIcon>
						<Text className="ml-4 text-white font-semibold font-text mx-auto tracking-tight">Se connecter avec Facebook</Text>
					</Pressable>
					<Pressable className="flex flex-row items-center bg-red-500 rounded-full h-10 px-[5px] w-full mb-3 pl-1.5">
						<View className="justify-center items-center bg-white h-[28px] w-[28px] rounded-full left-0">
							<SvgIcon height={20} width={20} fill="#fff" viewBox="0 0  186.69 190.5">
								<GoogleIcon/>
							</SvgIcon>
						</View>
						<Text className="ml-4 text-white font-semibold font-text mx-auto tracking-tight">Se connecter avec Google</Text>
					</Pressable>
					<Pressable onPress={handleSignup} className="bg-white border-2 border-[#404346] items-center justify-center rounded-3xl w-full h-10">
						<Text className="text-darkText text-base font-text font-semibold tracking-tight">Créer un compte</Text>
					</Pressable>
				</View>
			</ScrollView>
		</ScreenLayout>
	);
};

export default LoginScreen;
