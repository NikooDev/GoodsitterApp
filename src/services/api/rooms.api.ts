import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { baseQuery } from '@Config/api';
import { IRoom } from '@Type/chat';

export const roomsApi = createApi({
	reducerPath: 'roomsApi',
	baseQuery,
	endpoints: (builder) => ({
		getRoom: builder.query<IRoom[], void>({
			query: () => '/messages/room/getRooms'
		})
	})
})

export const {
	useGetRoomQuery
} = roomsApi
