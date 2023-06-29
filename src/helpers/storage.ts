import AsyncStorage from '@react-native-async-storage/async-storage'

export const setStorage = async (key: string, value: string) => {
	try {
		await AsyncStorage.setItem(key, value)
	} catch (e) {
		console.log(e)
	}
}

export const getStorage = async (key: string) => {
	try {
		const value = await AsyncStorage.getItem(key)
		if (value !== null) {
			return value
		}
	} catch(e) {
		console.log(e)
	}
}

export const removeStorage = async (key: string) => {
	try {
		await AsyncStorage.removeItem(key)
	} catch(e) {
		console.log(e)
	}
}