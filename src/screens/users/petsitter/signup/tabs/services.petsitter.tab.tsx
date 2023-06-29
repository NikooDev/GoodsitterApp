import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import Theme from '@Asset/theme';
import Slider from '@react-native-community/slider';
import { Keyboard, Pressable, Switch, TextInput, View } from 'react-native';
import { IPetsitters, TypeAnimal, TypeGarden, TypeHome } from '@Type/petsitter';
import { CheckIcon } from '@Component/icons/actions';
import Text from '@Component/ui/text';
import Class from 'classnames';
import SvgIcon from '@Component/icons/svg';

const ServicesPetsitterTab = ({ petsitter, handleChange, error, setError }: IPetsitters) => {
	const [typeAnimals, setTypeAnimals] = useState<TypeAnimal[]>(petsitter.type)
	const [firstChange, setFirstChange] = useState<boolean>(false)
	const otherHomeTypeRef = useRef() as React.MutableRefObject<TextInput>

	const handleTypeAnimals = useCallback((type: TypeAnimal) => {
		setFirstChange(true)
		if (typeAnimals.includes(type)) {
			setTypeAnimals((prevSelectedTypes) =>
				prevSelectedTypes.filter((selectedType) => selectedType !== type)
			);
		} else {
			setTypeAnimals((prevSelectedTypes) => [...prevSelectedTypes, type]);
		}
	}, [typeAnimals])

	useEffect(() => {
		if (firstChange) {
			handleChange(typeAnimals, 'type')
		}
	}, [firstChange, typeAnimals])

	return (
		<View className="px-5 py-3 flex-col">
			<Text className="mt-2 font-medium text-lg text-slate-800 mb-8">Configurer vos services</Text>
			<Text className="text-slate-800 text-[15.5px] font-medium mb-1">Ajouter les services que vous souhaitez proposer et configurez vos options et tarifs.</Text>
			<Text className="text-slate-500 text-[14px] mb-1.5">Les tarifs par défaut sont indiqués à titre indicatif. Vous pouvez les modifier selon vos choix.</Text>
			<View className={Class('bg-white shadow rounded-2xl mt-2 p-5 flex-row justify-between items-start border-2 border-white', error.field === 'services' && 'border-2 border-red-500')}>
				<View>
					<Text className="font-medium text-slate-800">Hébergement à domicile</Text>
					<Text className="text-slate-500 text-[13px]">Chez vous</Text>
					{
						petsitter.services.lodging.enable && (
							<View className="mt-3">
								<View className="mb-4">
									<Text className="font-medium text-slate-500 text-[13px]">Tarif par nuit :</Text>
									<View className="flex-row items-center">
										<TextInput className={Class('bg-white shadow p-3 rounded-lg mt-2 font-text w-20 border-2 border-white', error.field === 'lodging.price' && 'border-red-500 border-2 focus:border-red-500')} keyboardType="number-pad"
															 value={petsitter.services.lodging.price} onChange={setError}
															 onChangeText={(value) => handleChange(value, 'services', 'lodging', 'price')}
															 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="30"/>
										<Text className="mt-2 ml-1.5 font-medium text-slate-500">€</Text>
									</View>
								</View>
								<View>
									<Text className="font-medium text-slate-500 text-[13px]">Animal supplémentaire :</Text>
									<View className="flex-row items-center">
										<TextInput className={Class('bg-white shadow p-3 rounded-lg mt-2 font-text w-20 border-2 border-white', error.field === 'lodging.price_additional_animal' && 'border-red-500 border-2 focus:border-red-500')} keyboardType="number-pad"
															 value={petsitter.services.lodging.price_additional_animal} onChange={setError}
															 onChangeText={(value) => handleChange(value, 'services', 'lodging', 'price_additional_animal')}
															 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="8"/>
										<Text className="mt-2 ml-1.5 font-medium text-slate-500">€</Text>
									</View>
								</View>
							</View>
						)
					}
				</View>
				<View className="pt-0.5">
					<Switch value={petsitter.services.lodging.enable} trackColor={{true: Theme.colors.primary}} onChange={setError} onValueChange={(event) => handleChange(event, 'services', 'lodging', 'enable')}/>
				</View>
			</View>
			<View className={Class('bg-white shadow rounded-2xl mt-3 p-5 flex-row justify-between items-start border-2 border-white', error.field === 'services' && 'border-2 border-red-500')}>
				<View>
					<Text className="text-slate-800 text-[15.5px] font-medium">Garderie</Text>
					<Text className="text-slate-500 text-[13px]">Chez vous</Text>
					{
						petsitter.services.daycare.enable && (
							<View className="mt-3">
								<View className="mb-4">
									<Text className="font-medium text-slate-500 text-[13px]">Tarif par jour :</Text>
									<View className="flex-row items-center">
										<TextInput className={Class('bg-white shadow p-3 rounded-lg mt-2 font-text w-20 border-2 border-white', error.field === 'daycare.price' && 'border-red-500 border-2 focus:border-red-500')} keyboardType="number-pad"
															 value={petsitter.services.daycare.price} onChange={setError}
															 onChangeText={(value) => handleChange(value, 'services', 'daycare', 'price')}
															 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="10"/>
										<Text className="mt-2 ml-1.5 font-medium text-slate-500">€</Text>
									</View>
								</View>
								<View>
									<Text className="font-medium text-slate-500 text-[13px]">Animal supplémentaire :</Text>
									<View className="flex-row items-center">
										<TextInput className={Class('bg-white shadow p-3 rounded-lg mt-2 font-text w-20 border-2 border-white', error.field === 'daycare.price_additional_animal' && 'border-red-500 border-2 focus:border-red-500')} keyboardType="number-pad"
															 value={petsitter.services.daycare.price_additional_animal} onChange={setError}
															 onChangeText={(value) => handleChange(value, 'services', 'daycare', 'price_additional_animal')}
															 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="5"/>
										<Text className="mt-2 ml-1.5 font-medium text-slate-500">€</Text>
									</View>
								</View>
							</View>
						)
					}
				</View>
				<View className="pt-0.5">
					<Switch value={petsitter.services.daycare.enable} trackColor={{true: Theme.colors.primary}} onChange={setError} onValueChange={(event) => handleChange(event, 'services', 'daycare', 'enable')}/>
				</View>
			</View>
			<View className={Class('bg-white shadow rounded-2xl mt-3 p-5 flex-row justify-between items-start border-2 border-white', error.field === 'services' && 'border-2 border-red-500')}>
				<View>
					<Text className="text-slate-800 text-[15.5px] font-medium">Garde à domicile</Text>
					<Text className="text-slate-500 text-[13px]">Chez le propriétaire</Text>
					{
						petsitter.services.home_daycare.enable && (
							<View className="mt-3">
								<Text className="font-medium text-slate-500 text-[13px]">Tarif par 24h + gardiennage maison :</Text>
								<View className="flex-row items-center">
									<TextInput className={Class('bg-white shadow p-3 rounded-lg mt-2 font-text w-20 border-2 border-white', error.field === 'home_daycare.price' && 'border-red-500 border-2 focus:border-red-500')} keyboardType="number-pad"
														 value={petsitter.services.home_daycare.price} onChange={setError}
														 onChangeText={(value) => handleChange(value, 'services', 'home_daycare', 'price')}
														 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="50"/>
									<Text className="mt-2 ml-1.5 font-medium text-slate-500">€</Text>
								</View>
							</View>
						)
					}
				</View>
				<View className="pt-0.5">
					<Switch value={petsitter.services.home_daycare.enable} trackColor={{true: Theme.colors.primary}} onChange={setError} onValueChange={(event) => handleChange(event, 'services', 'home_daycare', 'enable')}/>
				</View>
			</View>
			<View className={Class('bg-white shadow rounded-2xl mt-3 p-5 flex-row justify-between items-start border-2 border-white', error.field === 'services' && 'border-2 border-red-500')}>
				<View>
					<Text className="text-slate-800 text-[15.5px] font-medium">Promenade</Text>
					<Text className="text-slate-500 text-[13px]">Autour de chez vous</Text>
					{
						petsitter.services.walk.enable && (
							<View className="mt-3">
								<View className="mb-4">
									<Text className="font-medium text-slate-500 text-[13px]">Prix par promenade :</Text>
									<View className="flex-row items-center">
										<TextInput className={Class('bg-white shadow p-3 rounded-lg mt-2 font-text w-20 border-2 border-white', error.field === 'walk.price' && 'border-red-500 border-2 focus:border-red-500')} keyboardType="number-pad"
															 value={petsitter.services.walk.price} onChange={setError}
															 onChangeText={(value) => handleChange(value, 'services', 'walk', 'price')}
															 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="7"/>
										<Text className="mt-2 ml-1.5 font-medium text-slate-500">€</Text>
									</View>
								</View>
								<View>
									<Text className="font-medium text-slate-500 text-[13px]">Animal supplémentaire :</Text>
									<View className="flex-row items-center">
										<TextInput className={Class('bg-white shadow p-3 rounded-lg mt-2 font-text w-20 border-2 border-white', error.field === 'walk.price_additional_animal' && 'border-red-500 border-2 focus:border-red-500')} keyboardType="number-pad"
															 value={petsitter.services.walk.price_additional_animal} onChange={setError}
															 onChangeText={(value) => handleChange(value, 'services', 'walk', 'price_additional_animal')}
															 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="5"/>
										<Text className="mt-2 ml-1.5 font-medium text-slate-500">€</Text>
									</View>
								</View>
							</View>
						)
					}
				</View>
				<View className="pt-0.5">
					<Switch value={petsitter.services.walk.enable} trackColor={{true: Theme.colors.primary}} onChange={setError} onValueChange={(event) => handleChange(event, 'services', 'walk', 'enable')}/>
				</View>
			</View>
			<View className={Class('bg-white shadow rounded-2xl mt-3 p-5 flex-row justify-between items-start border-2 border-white', error.field === 'services' && 'border-2 border-red-500')}>
				<View>
					<Text className="text-slate-800 text-[15.5px] font-medium">Visite à domicile</Text>
					<Text className="text-slate-500 text-[13px]">Au domicile du propriétaire</Text>
					{
						petsitter.services.visit.enable && (
							<View className="mt-3">
								<Text className="font-medium text-slate-500 text-[13px]">Tarif par visite :</Text>
								<View className="flex-row items-center">
									<TextInput className={Class('bg-white shadow p-3 rounded-lg mt-2 font-text w-20 border-2 border-white', error.field === 'visit.price' && 'border-red-500 border-2 focus:border-red-500')} keyboardType="number-pad"
														 value={petsitter.services.visit.price} onChange={setError}
														 onChangeText={(value) => handleChange(value, 'services', 'visit', 'price')}
														 placeholderTextColor={'rgb(148, 163, 184)'} placeholder="15"/>
									<Text className="mt-2 ml-1.5 font-medium text-slate-500">€</Text>
								</View>
							</View>
						)
					}
				</View>
				<View className="pt-0.5">
					<Switch value={petsitter.services.visit.enable} trackColor={{true: Theme.colors.primary}} onChange={setError} onValueChange={(event) => handleChange(event, 'services', 'visit', 'enable')}/>
				</View>
			</View>
			<Text className="text-slate-800 text-[15.5px] font-medium mb-1 mt-10">Disponibilité</Text>
			<View className="bg-white shadow rounded-2xl mt-2 p-5">
				<View className="flex-row justify-between items-center">
					<Text className="font-medium text-slate-800">Êtes-vous disponible chez vous{'\n'}à temps plein ?</Text>
					<Switch trackColor={{true: Theme.colors.primary}} value={petsitter.full_time} onValueChange={(event) => handleChange(event, 'full_time')}/>
				</View>
				<View className="mt-5">
					<Text className="font-medium text-slate-800 mb-3">Quels jours de la semaine êtes-vous disponible pour garder des animaux à domicile ?</Text>
					<View className="flex-row justify-around">
						<Pressable onPress={() => handleChange(!petsitter.weekdays.lun.enable, 'weekdays', 'lun', 'enable')} onPressIn={setError}
							className={Class(petsitter.weekdays.lun.enable ? 'bg-primary': 'bg-white', 'shadow rounded-lg h-10 w-10 items-center justify-center', error.field === 'weekdays' && 'border-red-500 border-2 focus:border-red-500')}>
							<Text className={Class(petsitter.weekdays.lun.enable ? 'text-white' : 'text-slate-800', 'text-xs font-medium')}>Lun</Text>
						</Pressable>
						<Pressable onPress={() => handleChange(!petsitter.weekdays.mar.enable, 'weekdays', 'mar', 'enable')} onPressIn={setError}
							className={Class(petsitter.weekdays.mar.enable ? 'bg-primary': 'bg-white', 'shadow rounded-lg h-10 w-10 items-center justify-center', error.field === 'weekdays' && 'border-red-500 border-2 focus:border-red-500')}>
							<Text className={Class(petsitter.weekdays.mar.enable ? 'text-white' : 'text-slate-800', 'text-xs font-medium')}>Mar</Text>
						</Pressable>
						<Pressable onPress={() => handleChange(!petsitter.weekdays.mer.enable, 'weekdays', 'mer', 'enable')} onPressIn={setError}
							className={Class(petsitter.weekdays.mer.enable ? 'bg-primary': 'bg-white', 'shadow rounded-lg h-10 w-10 items-center justify-center', error.field === 'weekdays' && 'border-red-500 border-2 focus:border-red-500')}>
							<Text className={Class(petsitter.weekdays.mer.enable ? 'text-white' : 'text-slate-800', 'text-xs font-medium')}>Mer</Text>
						</Pressable>
						<Pressable onPress={() => handleChange(!petsitter.weekdays.jeu.enable, 'weekdays', 'jeu', 'enable')} onPressIn={setError}
							className={Class(petsitter.weekdays.jeu.enable ? 'bg-primary': 'bg-white', 'shadow rounded-lg h-10 w-10 items-center justify-center', error.field === 'weekdays' && 'border-red-500 border-2 focus:border-red-500')}>
							<Text className={Class(petsitter.weekdays.jeu.enable ? 'text-white' : 'text-slate-800', 'text-xs font-medium')}>Jeu</Text>
						</Pressable>
						<Pressable onPress={() => handleChange(!petsitter.weekdays.ven.enable, 'weekdays', 'ven', 'enable')} onPressIn={setError}
							className={Class(petsitter.weekdays.ven.enable ? 'bg-primary': 'bg-white', 'shadow rounded-lg h-10 w-10 items-center justify-center', error.field === 'weekdays' && 'border-red-500 border-2 focus:border-red-500')}>
							<Text className={Class(petsitter.weekdays.ven.enable ? 'text-white' : 'text-slate-800', 'text-xs font-medium')}>Ven</Text>
						</Pressable>
						<Pressable onPress={() => handleChange(!petsitter.weekdays.sam.enable, 'weekdays', 'sam', 'enable')} onPressIn={setError}
							className={Class(petsitter.weekdays.sam.enable ? 'bg-primary': 'bg-white', 'shadow rounded-lg h-10 w-10 items-center justify-center', error.field === 'weekdays' && 'border-red-500 border-2 focus:border-red-500')}>
							<Text className={Class(petsitter.weekdays.sam.enable ? 'text-white' : 'text-slate-800', 'text-xs font-medium')}>Sam</Text>
						</Pressable>
						<Pressable onPress={() => handleChange(!petsitter.weekdays.dim.enable, 'weekdays', 'dim', 'enable')} onPressIn={setError}
							className={Class(petsitter.weekdays.dim.enable ? 'bg-primary': 'bg-white', 'shadow rounded-lg h-10 w-10 items-center justify-center', error.field === 'weekdays' && 'border-red-500 border-2 focus:border-red-500')}>
							<Text className={Class(petsitter.weekdays.dim.enable ? 'text-white' : 'text-slate-800', 'text-xs font-medium')}>Dim</Text>
						</Pressable>
					</View>
				</View>
			</View>
			<Text className="text-slate-800 text-[15.5px] font-medium mb-1 mt-10">Combien d'animaux pouvez-vous accueillir à votre domicile ?</Text>
			<View className="bg-white shadow rounded-2xl mt-2 p-5">
				<Text className="font-medium text-slate-800 mb-2">{ petsitter.how_many_animals } { petsitter.how_many_animals === 1 ? 'animal' : petsitter.how_many_animals === 10 ? 'animaux ou plus' : 'animaux' }</Text>
				<Slider value={petsitter.how_many_animals}
								step={1} minimumValue={1} maximumValue={10} minimumTrackTintColor={Theme.colors.primary}
								onValueChange={(value) => handleChange(value, 'how_many_animals')}
				/>
			</View>
			<Text className="text-slate-800 text-[15.5px] font-medium mb-1 mt-10">Quels types d'animaux souhaitez vous accueillir chez vous ?</Text>
			<Text className="text-slate-500 text-[14px] mb-1.5">Plusieurs choix possibles.</Text>
			<View className="bg-white shadow rounded-2xl mt-2 p-5">
				<Pressable onPress={() => handleTypeAnimals(TypeAnimal.PETIT)} className="flex-row items-center" onPressIn={setError}>
					<View className={Class(petsitter.type && petsitter.type.includes(TypeAnimal.PETIT) ? 'bg-primary': 'bg-white border-[1.2px] border-gray-200', 'shadow rounded-lg h-7 w-7 items-center justify-center', error.field === 'type' && 'border-red-500 border-2 focus:border-red-500')}>
						{
							petsitter.type && petsitter.type.includes(TypeAnimal.PETIT) && (
								<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-white ml-[1px]">
									<CheckIcon/>
								</SvgIcon>
							)
						}
					</View>
					<Text className="text-slate-800 font-medium ml-3">Petit chien</Text>
				</Pressable>
				<Pressable onPress={() => handleTypeAnimals(TypeAnimal.MOYEN)} className="flex-row items-center mt-3" onPressIn={setError}>
					<View className={Class(petsitter.type && petsitter.type.includes(TypeAnimal.MOYEN) ? 'bg-primary': 'bg-white border-[1.2px] border-gray-200', 'shadow rounded-lg h-7 w-7 items-center justify-center', error.field === 'type' && 'border-red-500 border-2 focus:border-red-500')}>
						{
							petsitter.type && petsitter.type.includes(TypeAnimal.MOYEN) && (
								<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-white ml-[1px]">
									<CheckIcon/>
								</SvgIcon>
							)
						}
					</View>
					<Text className="text-slate-800 font-medium ml-3">Moyen chien</Text>
				</Pressable>
				<Pressable onPress={() => handleTypeAnimals(TypeAnimal.GRAND)} className="flex-row items-center mt-3" onPressIn={setError}>
					<View className={Class(petsitter.type && petsitter.type.includes(TypeAnimal.GRAND) ? 'bg-primary': 'bg-white border-[1.2px] border-gray-200', 'shadow rounded-lg h-7 w-7 items-center justify-center', error.field === 'type' && 'border-red-500 border-2 focus:border-red-500')}>
						{
							petsitter.type && petsitter.type.includes(TypeAnimal.GRAND) && (
								<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-white ml-[1px]">
									<CheckIcon/>
								</SvgIcon>
							)
						}
					</View>
					<Text className="text-slate-800 font-medium ml-3">Grand chien</Text>
				</Pressable>
				<Pressable onPress={() => handleTypeAnimals(TypeAnimal.TRES_GRAND)} className="flex-row items-center mt-3" onPressIn={setError}>
					<View className={Class(petsitter.type && petsitter.type.includes(TypeAnimal.TRES_GRAND) ? 'bg-primary': 'bg-white border-[1.2px] border-gray-200', 'shadow rounded-lg h-7 w-7 items-center justify-center', error.field === 'type' && 'border-red-500 border-2 focus:border-red-500')}>
						{
							petsitter.type && petsitter.type.includes(TypeAnimal.TRES_GRAND) && (
								<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-white ml-[1px]">
									<CheckIcon/>
								</SvgIcon>
							)
						}
					</View>
					<Text className="text-slate-800 font-medium ml-3">Très grand chien</Text>
				</Pressable>
				<Pressable onPress={() => handleTypeAnimals(TypeAnimal.CHAT)} className="flex-row items-center mt-3" onPressIn={setError}>
					<View className={Class(petsitter.type && petsitter.type.includes(TypeAnimal.CHAT) ? 'bg-primary': 'bg-white border-[1.2px] border-gray-200', 'shadow rounded-lg h-7 w-7 items-center justify-center', error.field === 'type' && 'border-red-500 border-2 focus:border-red-500')}>
						{
							petsitter.type && petsitter.type.includes(TypeAnimal.CHAT) && (
								<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-white ml-[1px]">
									<CheckIcon/>
								</SvgIcon>
							)
						}
					</View>
					<Text className="text-slate-800 font-medium ml-3">Chat</Text>
				</Pressable>
			</View>
			<Text className="text-slate-800 text-[15.5px] font-medium mb-1 mt-10">Dans quel type de logement vivez-vous ?</Text>
			<View className={Class('bg-white shadow rounded-2xl mt-2 px-5 py-3 flex-row justify-between items-center border-2 border-white', error.field === 'home_type' && 'border-red-500 border-2 focus:border-red-500')}>
				<Text className="font-medium text-slate-800">Maison</Text>
				<View className="pt-0.5">
					<Switch value={petsitter.home_type === TypeHome.HOUSE} trackColor={{true: Theme.colors.primary}} onChange={(event) => {
						if (event && petsitter.home_type === TypeHome.HOUSE) {
							return;
						}
						Keyboard.dismiss()
						setError()
						handleChange(TypeHome.HOUSE, 'home_type')}}/>
				</View>
			</View>
			<View className={Class('bg-white shadow rounded-2xl mt-3 px-5 py-3 flex-row justify-between items-center border-2 border-white', error.field === 'home_type' && 'border-red-500 border-2 focus:border-red-500')}>
				<Text className="font-medium text-slate-800">Appartement</Text>
				<View className="pt-0.5">
					<Switch value={petsitter.home_type === TypeHome.APARTMENT} trackColor={{true: Theme.colors.primary}} onChange={(event) => {
						if (event && petsitter.home_type === TypeHome.APARTMENT) {
							return;
						}
						Keyboard.dismiss()
						setError()
						handleChange(TypeHome.APARTMENT, 'home_type')}}/>
				</View>
			</View>
			<View className={Class('bg-white shadow rounded-2xl mt-3 px-5 py-3 flex-row justify-between items-center border-2 border-white', error.field === 'home_type' && 'border-red-500 border-2 focus:border-red-500')}>
				<Text className="font-medium text-slate-800">Autre</Text>
				<View className="pt-0.5">
					<Switch value={petsitter.home_type === TypeHome.OTHER} trackColor={{true: Theme.colors.primary}} onChange={(event) => {
						if (event && petsitter.home_type === TypeHome.OTHER) {
							return;
						}
						setError()
						otherHomeTypeRef.current && otherHomeTypeRef.current.focus()
						handleChange(TypeHome.OTHER, 'home_type')}}/>
				</View>
			</View>
			<TextInput ref={otherHomeTypeRef}
								 placeholder="Précisez votre type de logement"
								 placeholderTextColor={'rgb(148, 163, 184)'}
								 value={petsitter.other_home_type}
								 onChangeText={(value) => handleChange(value, 'other_home_type')}
								 maxLength={30} onChange={setError}
								 className={Class(petsitter.home_type !== TypeHome.OTHER && 'hidden', 'bg-white shadow px-5 py-4 rounded-2xl font-text mt-4 border-2 border-white', error.field === 'other_home_type' && 'border-red-500 border-2 focus:border-red-500')}
			/>
			<Text className="text-slate-800 text-[15.5px] font-medium mb-1 mt-10">Votre jardin est...</Text>
			<View className={Class('bg-white shadow rounded-2xl mt-2 px-5 py-3 flex-row justify-between items-center border-2 border-white', error.field === 'type_garden' && 'border-red-500 border-2 focus:border-red-500')}>
				<Text className="font-medium text-slate-800">Clôturé</Text>
				<View className="pt-0.5">
					<Switch value={petsitter.type_garden === TypeGarden.CLOSED} trackColor={{true: Theme.colors.primary}} onChange={(event) => {
						if (event && petsitter.type_garden === TypeGarden.CLOSED) {
							return;
						}
						Keyboard.dismiss()
						setError()
						handleChange(TypeGarden.CLOSED, 'type_garden')}}/>
				</View>
			</View>
			<View className={Class('bg-white shadow rounded-2xl mt-3 px-5 py-3 flex-row justify-between items-center border-2 border-white', error.field === 'type_garden' && 'border-red-500 border-2 focus:border-red-500')}>
				<Text className="font-medium text-slate-800">Ouvert</Text>
				<View className="pt-0.5">
					<Switch value={petsitter.type_garden === TypeGarden.OPEN} trackColor={{true: Theme.colors.primary}} onChange={(event) => {
						if (event && petsitter.type_garden === TypeGarden.OPEN) {
							return;
						}
						Keyboard.dismiss()
						setError()
						handleChange(TypeGarden.OPEN, 'type_garden')}}/>
				</View>
			</View>
			<View className={Class('bg-white shadow rounded-2xl mt-3 px-5 py-3 flex-row justify-between items-center border-2 border-white', error.field === 'type_garden' && 'border-red-500 border-2 focus:border-red-500')}>
				<Text className="font-medium text-slate-800">Pas de jardin</Text>
				<View className="pt-0.5">
					<Switch value={petsitter.type_garden === TypeGarden.NOT_GARDEN} trackColor={{true: Theme.colors.primary}} onChange={(event) => {
						if (event && petsitter.type_garden === TypeGarden.NOT_GARDEN) {
							return;
						}
						setError()
						handleChange(TypeGarden.NOT_GARDEN, 'type_garden')}}/>
				</View>
			</View>
		</View>
	);
};

export default memo(ServicesPetsitterTab);
