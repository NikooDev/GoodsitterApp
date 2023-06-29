import React from 'react';
import FastImage from 'react-native-fast-image';
import { Pressable, ScrollView, View } from 'react-native';
import { IRootStackProps } from '@Type/stack';
import Text from '@Component/ui/text';
import ScreenLayout from '@Component/layouts/screen.layout';

const WelcomePetsitterScreen = ({ navigation }: IRootStackProps<'PetsitterWelcome'>) => {
	return (
		<ScreenLayout classNames="flex-1">
			<ScrollView contentContainerStyle={{paddingBottom: 60}} contentInset={{bottom: 60}}>
				<FastImage source={require('@Asset/static/img/dog6.jpg')} className="w-full h-52"/>
				<View className="p-5 pb-0">
					<Text className="text-center text-2xl font-medium text-slate-800 my-3">
						Proposez vos câlins à des animaux de compagnie et soyez rémunéré
					</Text>
					<Text className="text-center text-base text-slate-800 mt-3">
						Profitez d'une interface simple d'utilisation, créez un profil de confiance et attractif pour les propriétaires.
					</Text>
					<Pressable onPress={() => navigation.navigate('PetsitterSteps')} className="bg-primary rounded-full self-start px-5 py-3.5 mt-6 mx-auto">
						<Text className="text-white text-base font-medium">Commencer</Text>
					</Pressable>
					<Text className="mt-10 font-medium text-lg text-slate-800 mb-10">Comment ça marche ?</Text>
					<View className="justify-center mb-[42px]">
						<View className="flex-row items-center">
							<View className="h-7 w-7 bg-primary shadow rounded-full justify-center items-center ml-5">
								<Text className="text-white font-medium">1</Text>
							</View>
							<Text className="font-medium text-base text-slate-800 ml-2">Créez votre profil</Text>
						</View>
						<View className="absolute bg-primary rounded-full h-6 w-1 top-9 ml-8"/>
					</View>
					<View className="bg-white shadow rounded-2xl p-3">
						<Text className="text-slate-500 text-[15px]">
							Créez votre candidature avec un profil unique adapté aux besoins des propriétaires.{'\n'}
							Mettez en valeur votre expérience et connaissance des animaux domestiques.
						</Text>
					</View>
					<View className="justify-center mb-[42px]">
						<View className="absolute -z-10 bg-primary rounded-full h-9 w-1 top-2 ml-8"/>
						<View className="flex-row items-center mt-10 ml-5">
							<View className="h-7 w-7 bg-primary shadow rounded-full justify-center items-center">
								<Text className="text-white font-medium">2</Text>
							</View>
							<Text className="font-medium text-base text-slate-800 ml-2">Acceptez des réservations{'\n'}et démarchez</Text>
						</View>
						<View className="absolute -z-10 bg-primary rounded-full h-9 w-1 top-[84px] ml-8"/>
					</View>
					<View className="bg-white shadow rounded-2xl p-3">
						<Text className="text-slate-500 text-[15px]">
							Avec Goodsitter, vous avez la possibilité d'accepter des demandes de réservation mais également de rechercher des propriétaires avec la map.{'\n\n'}
							Le démarchage fonctionne avec un système de "Taps" que nous appelons "Notifications Waf", qui vous permet d'indiquer à un propriétaire que son profil vous intéresse.
						</Text>
					</View>
					<View className="justify-center mb-[40px]">
						<View className="absolute -z-10 bg-primary rounded-full h-6 w-1 top-2 ml-8"/>
						<View className="flex-row items-center mt-10 ml-5">
							<View className="h-7 w-7 bg-primary shadow rounded-full justify-center items-center">
								<Text className="text-white font-medium">3</Text>
							</View>
							<Text className="font-medium text-base text-slate-800 ml-2">Discutez et rencontrez</Text>
						</View>
						<View className="absolute -z-10 bg-primary rounded-full h-6 w-1 top-[75px] ml-8"/>
					</View>
					<View className="bg-white shadow rounded-2xl p-3">
						<Text className="text-slate-500 text-[15px]">
							Prenez le temps de faire connaissance avec les propriétaires et leurs animaux avant d'accepter toute réservation.
						</Text>
					</View>
					<View className="justify-center mb-[40px]">
						<View className="absolute -z-10 bg-primary rounded-full h-6 w-1 top-2 ml-8"/>
						<View className="flex-row items-center mt-10 ml-5">
							<View className="h-7 w-7 bg-primary shadow rounded-full justify-center items-center">
								<Text className="text-white font-medium">4</Text>
							</View>
							<Text className="font-medium text-base text-slate-800 ml-2">Soyez rémunéré</Text>
						</View>
						<View className="absolute -z-10 bg-primary rounded-full h-6 w-1 top-[75px] ml-8"/>
					</View>
					<View className="bg-white shadow rounded-2xl p-3">
						<Text className="text-slate-500 text-[15px]">
							Les propriétaires peuvent vous payez par carte bancaire.{'\n\n'}
							Le délai maximum pour recevoir l'argent sur votre compte est de 2 jours après la fin du service.{'\n\n'}
							Vous percevez 80 à 90% du montant de chaque réservation selon le service.
							Cela correspond aux frais de service nécessaires au fonctionnement de Goodsitter.{'\n\n'}
							Nouveau : Vous pouvez maintenant utiliser votre compte Paypal pour être rémunéré.
						</Text>
					</View>
					<Text className="text-center text-2xl font-medium text-slate-800 mt-3"></Text>
				</View>
				<Pressable onPress={() => navigation.navigate('PetsitterSteps')} className="bg-primary rounded-full self-start px-5 py-3.5 mb-5 mx-auto">
					<Text className="text-white text-base font-medium">Commencer</Text>
				</Pressable>
			</ScrollView>
		</ScreenLayout>
	);
};

export default WelcomePetsitterScreen;
