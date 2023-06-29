import React, { memo } from 'react';
import { TextInput, View } from 'react-native';
import { IPetsitters } from '@Type/petsitter';
import Text from '@Component/ui/text';
import Class from 'classnames';

const DetailsProfilePetsitterTab = ({ petsitter, handleChange, error, setError }: IPetsitters) => {
	return (
		<View className="px-5 py-3 flex-col">
			<Text className="mt-2 font-medium text-lg text-slate-800 mb-8">Votre expériences avec les animaux</Text>

			<Text className="text-slate-800 text-[15.5px] font-medium mb-1">Combien d'années d'expérience avez-vous dans la garde d'animaux domestiques ?</Text>
			<TextInput className={Class('bg-white shadow p-3 rounded-lg mt-1.5 font-text w-1/5 border-2 border-white', error.field === 'number_experiences' && 'border-red-500 border-2 focus:border-red-500')}
								 onChangeText={(value) => handleChange(value, 'number_experiences')} onChange={setError}
								 defaultValue={petsitter.number_experiences}
								 keyboardType="numeric" placeholderTextColor={'rgb(148, 163, 184)'}/>

			<Text className="text-slate-800 text-[15.5px] font-medium mb-1 mt-5">Écrivez un titre accrocheur</Text>
			<Text className="text-slate-500 text-[14px] mb-1.5">50 caractères maximum pour donner envie aux propriétaires de lire votre profil.</Text>
			<TextInput className={Class('bg-white shadow p-3 rounded-lg mt-1.5 font-text border-2 border-white', error.field === 'title' && 'border-red-500 border-2 focus:border-red-500')}
								 onChangeText={(value) => handleChange(value, 'title')} onChange={setError}
								 defaultValue={petsitter.title}
								 maxLength={50} placeholderTextColor={'rgb(148, 163, 184)'}/>

			<Text className="text-slate-800 text-[15.5px] font-medium mb-1 mt-5">À propos de vous</Text>
			<Text className="text-slate-500 text-[14px] mb-1.5">
				Écrivez au moins 30 mots pour vous présenter et expliquer vos motivations.
				{'\n'}Partager votre passion des animaux aux propriétaires.
			</Text>
			<TextInput className={Class('bg-white shadow p-3 rounded-lg mt-1.5 font-text h-36 border-2 border-white', error.field === 'description' && 'border-red-500 border-2 focus:border-red-500')}
								 onChangeText={(value) => handleChange(value, 'description')} onFocus={setError}
								 defaultValue={petsitter.description}
								 multiline numberOfLines={5} maxLength={200} placeholderTextColor={'rgb(148, 163, 184)'}/>

			</View>
	);
};

export default memo(DetailsProfilePetsitterTab);
