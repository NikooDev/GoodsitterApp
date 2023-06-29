import { createSlice } from '@reduxjs/toolkit'
import { ILoginState } from '@Type/auth'

export const authSlice = createSlice({
	name: 'authReducer',
	initialState: {
		isAuth: undefined,
		role: 'petowner'
	} as ILoginState,
	reducers: {
		setLoginSuccess: (state) => {
			state.isAuth = true
		},
		setLogout: (state) => {
			state.isAuth = false
		}
	}
})

export const {
	setLoginSuccess, setLogout
} = authSlice.actions

export default authSlice.reducer
