import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@Config/api';
import { IMapSettings, ISettings } from '@Type/setting';
import { IUser } from '@Type/users';

/**
 * Récupération / Modification des données relatives à l'utilisateur
 * - Profile
 * - Settings
 * - MapSettings
 */
export const usersApi = createApi({
	reducerPath: 'usersApi',
	tagTypes: ['User', 'Settings', 'MapSettings'],
	baseQuery,
	endpoints: (builder) => ({
		pingUser: builder.query<void, void>({
			query: () => '/user/ping',
			providesTags: ['User']
		}),
		getUser: builder.query<IUser, void>({
			query: () => '/user/get',
			transformResponse(response: IUser) {
				// Simulation de latence d'un serveur en production
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve(response);
					}, 1500);
				});
			},
			providesTags: ['User']
		}),
		setUser: builder.mutation({
			query: (data) => ({
				url: '/user/set',
				method: 'PATCH',
				body: data
			}),
			invalidatesTags: ['User']
		}),
		getSettings: builder.query<ISettings, void>({
			query: () => '/user/settings/get',
			providesTags: ['Settings']
		}),
		setSettings: builder.mutation({
			query: (data) => ({
				url: '/user/settings/set',
				method: 'PATCH',
				body: data
			}),
			invalidatesTags: ['Settings']
		}),
		getMapSettings: builder.query<IMapSettings, void>({
			query: () => '/user/map/settings/get',
			providesTags: ['MapSettings']
		}),
		setMapSettings: builder.mutation({
			query: (data) => ({
				url: '/user/map/settings/set',
				method: 'PATCH',
				body: data
			}),
			invalidatesTags: ['MapSettings']
		})
	})
});

export const {
	useGetUserQuery,
	useSetUserMutation,
	useGetSettingsQuery,
	useSetSettingsMutation,
	usePingUserQuery,
	useGetMapSettingsQuery,
	useSetMapSettingsMutation
} = usersApi;
