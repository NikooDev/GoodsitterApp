import Theme from '@Asset/theme';
import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
	bottomSheet: {
		backgroundColor: Theme.colors.primary,
		borderRadius: 60,
		zIndex: 50,
		paddingBottom: 120,
		shadowRadius: 10,
		shadowColor: '#000',
		shadowOpacity: .2,
		shadowOffset: { width: 0, height: 0}
	},
	bottomSheetBackground: {
		backgroundColor: 'rgb(71 85 105)'
	},
	bottomSheetIndicator: {
		backgroundColor: '#fff'
	},
	tabBar: {
		backgroundColor: '#fff',
		overflow: 'hidden',
		marginTop: -5,
		height: 50,
		justifyContent: 'center',
		shadowOpacity: .15,
		shadowColor: '#000',
		shadowRadius: 10
	},
	indicator: {
		backgroundColor: Theme.colors.primary,
		borderRadius: 30,
		height: 5,
		bottom: -2.2
	},
	label: {
		color: Theme.colors.darkText,
		fontWeight: '500',
		fontFamily: 'Poppins'
	}
});

export const pickerSelectIdentityPetsitter = {
	viewContainer: { width: '100%', paddingVertical: 9, paddingHorizontal: 12 },
	placeholder: { fontSize: 14, fontWeight: '500', fontFamily: 'Poppins', color: '#fff' },
	chevron: { display: 'none' },
	inputIOS: { fontSize: 14, fontWeight: '500', fontFamily: 'Poppins', color: '#fff' },
	done: { color: '#fff', fontFamily: 'Poppins', fontSize: 17, fontWeight: '500', letterSpacing: -.5 },
	modalViewMiddle: { backgroundColor: Theme.colors.primary, marginBottom: -20 },
	modalViewBottom: { backgroundColor: '#fff', paddingBottom: 0 }
}
