import { launchImageLibrary } from 'react-native-image-picker';
import { openCropper } from 'react-native-image-crop-picker';
import { ImageLibraryOptions } from 'react-native-image-picker/src/types';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setPendingUpload } from '@Reducer/app.reducer';

export type IUploadType = 'avatar' | 'cover' | 'photos' | 'onePhoto'

const useUpload = () => {
	const dispatch = useDispatch()

	const handleCropper = async (path: string, height: number, width: number, type: IUploadType, titleName: string | undefined) => {
		let title: string | undefined
		let size = {} as { height: number, width: number }

		switch (type) {
			case 'avatar':
				title = 'Photo de profil'
				size = { height: 800, width: 800 }
				break
			case 'cover':
				title = 'Photo de couverture'
				size = { height: 800, width: 1500 }
				break
			case 'photos':
				title = 'Photos'
				size = { height, width }
				break
			case 'onePhoto':
				title = titleName
				size = { height, width }
				break
			default:
				title = undefined
				break
		}

		return openCropper({
			path,
			width: size.width,
			height: size.height,
			mediaType: 'photo',
			forceJpg: true,
			waitAnimationEnd: true,
			loadingLabelText: 'Chargement...',
			cropperCancelText: 'Annuler',
			cropperChooseText: 'Ajouter',
			includeExif: true,
			cropperToolbarTitle: title,
			cropperCircleOverlay: type !== 'cover' && type !== 'photos' && type !== 'onePhoto',
			cropperRotateButtonsHidden: true
		}).then(image => image)
			.catch(reason => {
				return reason.code
			})
	}

	const handleUpload = async (type: IUploadType, title?: string, height?: number, width?: number) => {
		const selectionLimit =
			type === 'photos' ? 4 :
			type === 'onePhoto' ? 1 : 1
		const config = { mediaType: 'photo', selectionLimit, quality: 1, includeExtra: true } as ImageLibraryOptions
		const result: any[] = []

		try {
			dispatch(setPendingUpload(true))
			const response = await launchImageLibrary(config)

			if (response.assets) {
				await new Promise(resolve => setTimeout(resolve, 500))
				for (const image of response.assets) {
					if (image.uri) {
						result.push(
							await handleCropper(image.uri, height ? height : 800, width ? width : 800, type, title ? title : undefined)
						)
					}
				}
				dispatch(setPendingUpload(false))
			}

			if (response.didCancel || response.errorCode && response.errorCode.length !== 0) {
				dispatch(setPendingUpload(false))
				if (response.errorCode === 'permission') {
					Alert.alert('Autorisation refusée', 'Vous devez autoriser l\'accès aux photos dans les réglages de votre téléphone.')
				} else if (response.errorCode === 'camera_unavailable') {
					Alert.alert('Caméra indisponible', 'La caméra est indisponible sur votre téléphone.')
				}
			}
		} catch (e) {
			console.log(e);
			setPendingUpload(false)
		}

		return result
	}

	return {
		handleUpload
	}
}

export default useUpload
