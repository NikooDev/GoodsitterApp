import React, {memo, useCallback, useEffect, useState} from 'react';
import RNPickerSelect, {PickerStyle} from 'react-native-picker-select';
import Theme from '@Asset/theme';
import { pickerSelectIdentityPetsitter } from '@Constant/styles';
import { Image, Pressable, View } from 'react-native';
import { IPetsitters } from '@Type/petsitter';
import { Image as ICropImage } from 'react-native-image-crop-picker';
import { PhotoIcon } from '@Component/icons';
import { DownIcon } from '@Component/icons/navigation.icon';
import Text from '@Component/ui/text';
import SvgIcon from '@Component/icons/svg';
import useUpload from '@Hook/useUpload';

interface ICrop { ci: ICropImage[], permis: ICropImage[], passeport: ICropImage[], [key: string]: ICropImage[] }

const IdentityPetsitterTab = ({ petsitter, handleChange }: IPetsitters) => {
	const [photos, setPhotos] = useState<ICrop>({
		ci: petsitter.identity.ci ? petsitter.identity.ci.file : [],
		permis: petsitter.identity.permis ? petsitter.identity.permis.file : [],
		passeport: petsitter.identity.passeport ? petsitter.identity.passeport.file : []
	})
	const [typeIdentity, setTypeIdentity] = useState<'ci' | 'passeport' | 'permis' | undefined>(petsitter.type_identity ? petsitter.type_identity : undefined)
	const { handleUpload } = useUpload()

	const handleSelectValue = (value: 'ci' | 'passeport' | 'permis') => {
		setTypeIdentity(value)
		handleChange(value, 'type_identity')
	}

	const handleAddIdentity = useCallback(async (recto: boolean) => {
		let title: string

		switch (typeIdentity) {
			case 'ci':
				title = 'Carte d\'identité'
				break
			case 'passeport':
				title = 'Passeport'
				break
			case 'permis':
				title = 'Permis de conduire'
				break
			default:
				title = ''
				break
		}

		const images = await handleUpload('onePhoto', title, 1100, 1500);

		if (images[0] !== 'E_PICKER_CANCELLED') {
			setPhotos((prevState) => {
				const updatedPhotos = { ...prevState }

				for (let i = 0; i < images.length; i++) {
					const image = images[i];
					const photoIndex = recto ? 0 : 1;

					if (typeIdentity === 'ci') {
						if (photoIndex < updatedPhotos.ci.length) {
							updatedPhotos.ci[photoIndex] = image
						} else {
							updatedPhotos.ci.push(image)
						}
					} else if (typeIdentity === 'permis') {
						if (updatedPhotos.permis.includes(petsitter.identity.permis.file[0])) {
							updatedPhotos.permis[photoIndex] = image
						} else {
							updatedPhotos.permis.push(image)
						}
					} else if (typeIdentity === 'passeport') {
						if (updatedPhotos.passeport.includes(petsitter.identity.passeport.file[0])) {
							updatedPhotos.passeport[photoIndex] = image
						} else {
							updatedPhotos.passeport.push(image)
						}
					}
				}

				return updatedPhotos;
			});
		}
	}, [typeIdentity, petsitter.identity])

	const handleAddPhoto = useCallback(() => {
		if (photos[typeIdentity as keyof ICrop] && photos[typeIdentity as keyof ICrop].length > 0) {
			handleChange(photos[typeIdentity as keyof ICrop], 'identity', typeIdentity, 'file')
		}
	}, [photos, typeIdentity])

	useEffect(() => handleAddPhoto(), [handleAddPhoto])

	return (
		<View className="px-5 py-3 flex-col flex-1">
			<Text className="mt-2 font-medium text-lg text-slate-800">Faites vérifier votre identité</Text>
			<Text className="text-slate-500 text-[14px]">Dernière étape pour la sécurité et l'intégrité de votre identité.</Text>
			<Pressable className="bg-primary flex-row items-center rounded-lg mt-5">
				<RNPickerSelect
					doneText="Terminer"
					style={pickerSelectIdentityPetsitter as PickerStyle}
					placeholder={{label: 'Choisissez votre document', value: null, color: Theme.colors.primary}}
					onValueChange={(value) => handleSelectValue(value)}
					value={petsitter.type_identity ? petsitter.type_identity : undefined}
					items={[
						{ label: 'Carte d\'identité', value: 'ci' },
						{ label: 'Permis de conduire', value: 'permis' },
						{ label: 'Passeport', value: 'passeport' },
					]}
				/>
				<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-white ml-auto mr-2">
					<DownIcon/>
				</SvgIcon>
			</Pressable>
			{
				(typeIdentity === 'ci' || typeIdentity === 'permis' || typeIdentity === 'passeport') && (
					<>
						<Text className="font-medium text-slate-800 text-[14px] mt-5 mb-3">
							Pour que la photo soit valide, assurez-vous que les informations suivantes sont clairement visibles : {'\n\n'}
							- Votre photo d'identité{'\n'}
							- Vos nom et prénom{'\n'}
							- Votre adresse{'\n\n'}
							Pour un passeport ou un permis, transférez votre document dans l'emplacement Recto.
						</Text>
						<View className="m-auto bg-white rounded-2xl border-white w-full border-4 shadow mt-4">
							<View className="bg-white rounded-2xl h-56 justify-center items-center">
								<View className="bg-white rounded-2xl shadow h-56 w-full justify-center items-center">
									{
										petsitter.identity && petsitter.identity[typeIdentity] && petsitter.identity[typeIdentity].file.length > 0 ? (
											<Image source={{uri: petsitter.identity[typeIdentity].file[0].path}} loadingIndicatorSource={{uri: petsitter.identity[typeIdentity].file[0].path}} resizeMode="cover" className="rounded-2xl h-56 w-full"/>
										) : (
											<Text className="font-medium text-center">Recto</Text>
										)
									}
								</View>
							</View>
						</View>
						<Pressable onPress={() => handleAddIdentity(true)} className="bg-primary mx-5 flex-row items-center justify-center rounded-lg py-2 px-3 mt-6 ml-auto mr-auto">
							<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-white mr-1.5">
								<PhotoIcon/>
							</SvgIcon>
							<Text className="text-white font-medium">Ajouter votre pièce d'identité</Text>
						</Pressable>
					</>
				)
			}
			{
				typeIdentity === 'ci' && (
					<>
						<View className="m-auto bg-white rounded-2xl border-white w-full border-4 shadow mt-10">
							<View className="bg-white rounded-2xl h-56 justify-center items-center">
								<View className="bg-white rounded-2xl shadow h-56 w-full justify-center items-center">
									{
										petsitter.identity && petsitter.identity[typeIdentity]?.file.length > 1 ? (
											<Image source={{uri: petsitter.identity[typeIdentity]?.file[1].path}} loadingIndicatorSource={{uri: petsitter.identity[typeIdentity]?.file[1].path}} resizeMode="cover" className="rounded-2xl h-56 w-full"/>
										) : (
											<Text className="font-medium text-center">Verso</Text>
										)
									}
								</View>
							</View>
						</View>
						<Pressable onPress={() => handleAddIdentity(false)} className="bg-primary mx-5 flex-row items-center justify-center rounded-lg py-2 px-3 mt-6 ml-auto mr-auto">
							<SvgIcon viewBox="0 0 24 24" height={24} width={24} className="fill-white mr-1.5">
								<PhotoIcon/>
							</SvgIcon>
							<Text className="text-white font-medium">Ajouter votre pièce d'identité</Text>
						</Pressable>
					</>
				)
			}
			<Text className="font-medium text-slate-800 text-[15.5px] mt-10">
				Après soumission du formulaire, votre candidature sera examinée par notre équipe.{'\n\n'}
				Une fois votre candidature examinée, vous recevrez une notification par e-mail et un message de confirmation ou de refus dans le chat de l'application.
			</Text>
		</View>
	);
};

export default memo(IdentityPetsitterTab);
