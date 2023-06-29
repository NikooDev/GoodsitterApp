import { Appearance } from 'react-native';
import IAppState from '@Type/app';
import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
	name: 'appReducer',
	initialState: {
		guideDone: undefined,
		mapGuideDone: undefined,
		darkmode: Appearance.getColorScheme(),
		usersChat: {},
		pendingUpload: false,
		accessGuest: false,
		loadingMap: false,
	} as IAppState,
	reducers: {
		setGuideDone: (state, action) => {
			state.guideDone = action.payload;
		},
		setMapGuideDone: (state, action) => {
			state.mapGuideDone = action.payload;
		},
		setUsersChat: (state, action) => {
			state.usersChat = action.payload
		},
		setPendingUpload: (state, action) => {
			state.pendingUpload = action.payload
		},
		setAccessGuest: (state, action) => {
			state.accessGuest = action.payload
		},
		setLoadingMap: (state, action) => {
			state.loadingMap = action.payload
		}
	}
});

export const {
	setGuideDone, setMapGuideDone, setUsersChat, setPendingUpload, setAccessGuest, setLoadingMap
} = appSlice.actions;

export default appSlice.reducer;
