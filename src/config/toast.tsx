import { ErrorToast, SuccessToast, ToastProps } from 'react-native-toast-message';
import React from 'react';
import { Dimensions, StyleProp, TextStyle } from 'react-native';

const { width } = Dimensions.get('screen')

const error = {
	backgroundColor: 'rgb(30 41 59)', borderLeftColor: '#ff3434', height: 65, width: width - 30, borderRadius: 10, zIndex: 999
}
const success = {
	backgroundColor: 'rgb(30 41 59)', borderLeftColor: '#0bd915', height: 65, width: width - 30, borderRadius: 10, zIndex: 999
}
const text1: StyleProp<TextStyle> = {
	fontSize: 15,
	fontWeight: '600',
	fontFamily: 'Poppins',
	color: '#cbd5e1',
	textAlign: 'center'
}
const text2: StyleProp<TextStyle> = {
	fontSize: 13,
	fontWeight: '500',
	color: '#94a3b8',
	fontFamily: 'Poppins',
	textAlign: 'center'
}

const toastConfig = {
	error: (props: ToastProps) => (
		<ErrorToast style={error} {...props} text1Style={text1} text2Style={text2}/>
	),
	success: (props: ToastProps) => (
		<SuccessToast style={success} {...props} text1Style={text1} text2Style={text2}/>
	)
}

export default toastConfig
