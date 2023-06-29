import { usersApi } from '@Service/api/users.api';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@Reducer/index';
import { roomsApi } from '@Service/api/rooms.api';

const Store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }).concat(usersApi.middleware, roomsApi.middleware),
});

export default Store;
