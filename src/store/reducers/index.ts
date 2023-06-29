import { usersApi } from '@Service/api/users.api';
import { roomsApi } from '@Service/api/rooms.api';
import appReducer from '@Reducer/app.reducer';
import authReducer from '@Reducer/auth.reducer';
import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
	app: appReducer,
	auth: authReducer,
	[usersApi.reducerPath]: usersApi.reducer,
	[roomsApi.reducerPath]: roomsApi.reducer
});

export default rootReducer
