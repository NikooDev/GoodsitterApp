import { ColorSchemeName } from 'react-native';
import { Animation, CustomAnimation } from 'react-native-animatable';

interface IAppState {
	guideDone: boolean | undefined
	mapGuideDone: boolean | undefined
	darkmode: ColorSchemeName
	offline: boolean
	usersChat: {
		to_id: string
	},
	pendingUpload: boolean
	accessGuest: boolean,
	loadingMap: boolean
}

export type ViewRef = {
	animate: (animation: Animation | string | CustomAnimation) => void;
};

export type IMethods = 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH' | 'post' | 'get' | 'delete' | 'put' | 'patch';

export default IAppState
