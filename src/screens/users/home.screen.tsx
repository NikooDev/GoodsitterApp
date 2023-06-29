import React, { useCallback, useMemo, useState } from 'react';
import Theme from '@Asset/theme';
import LocaleConfig, { RANGE, initialDate, horizontalView, days } from '@Constant/calendar';
import { Image, ScrollView, StyleSheet, TextStyle, View } from 'react-native';
import { IRootStackProps } from '@Type/stack';
import { Calendar, DateData } from 'react-native-calendars';
import ScreenLayout from '@Component/layouts/screen.layout';
import Text from '@Component/ui/text';
import { Api } from '@Config/api';

LocaleConfig.defaultLocale = 'fr';

const HomeScreen = ({}: IRootStackProps<'Home'>) => {
	const [selected, setSelected] = useState(initialDate);
	const marked = useMemo(() => {
		return days(selected)
	}, [selected]);

	const onDayPress = useCallback((day: DateData) => {
		setSelected(day.dateString);
	}, []);

	return (
		<ScreenLayout classNames="flex-1">
			<ScrollView contentContainerStyle={{paddingBottom: 60}} contentInset={{ bottom: 60 }}>
				<Text className="px-5 pt-3 font-medium text-lg text-slate-800">Calendrier</Text>
				<Text className="text-xs px-5 text-slate-500 text-[14px] mb-4">Retrouvez toutes vos réservations, en cours et à venir en un seul endroit pour une visibilité simplifiée.</Text>
				<View className="bg-white shadow rounded-3xl py-2 mx-5">
					<Calendar
						testID="calendar"
						current={initialDate}
						pastScrollRange={RANGE}
						futureScrollRange={RANGE}
						onDayPress={day => onDayPress(day)}
						firstDay={1}
						markingType={'period'}
						markedDates={marked}
						enableSwipeMonths={true}
						renderHeader={renderCustomHeader}
						// @ts-ignore
						theme={theme}
						style={{backgroundColor: 'rgba(0,0,0,0)'}}
						horizontal={horizontalView}
					/>
					<View className="pt-1 pb-3 px-5">
						<View className="flex-row items-center mb-2">
							<View className="h-5 w-5 bg-[#94a3b8] rounded-full"/>
							<Text className="font-medium ml-2 text-slate-800">Réservations terminées</Text>
						</View>
						<View className="flex-row items-center mb-2">
							<View className="h-5 w-5 bg-primary rounded-full"/>
							<Text className="font-medium ml-2 text-slate-800">Réservations à venir</Text>
						</View>
						<View className="flex-row items-center">
							<View className="h-5 w-5 bg-green-500 rounded-full"/>
							<Text className="font-medium ml-2 text-slate-800">Réservations en cours</Text>
						</View>
					</View>
				</View>
				<Text className="px-5 pt-3 font-medium text-lg text-slate-800 mt-5 mb-3">Historique de vos réservations</Text>
				<View className="bg-white shadow rounded-t-3xl rounded-b-lg p-5 mx-5 mb-2">
					<Text className="text-base font-medium text-slate-800 mb-2">16 au 17 juin 2023</Text>
					<Text className="font-medium text-slate-800">Prestation : Hébergement</Text>
					<View className="flex-row mt-2">
						<Text className="font-medium text-slate-800 mr-2">Pet-sitter :</Text>
						<View className="flex-row items-center">
							<Image source={{ uri: Api+'/static/avatars/0ad40357-aa99-4526-bf82-ed7a941ea060.jpg' }} className="h-14 w-14 rounded-full mr-2"/>
							<Text className="font-medium text-slate-800" numberOfLines={2}>Ethan{'\n'}Taylor</Text>
						</View>
					</View>
					<Text className="font-medium text-slate-800 mt-2">Type de paiement : PayPal</Text>
					<Text className="text-right font-medium text-slate-800">TOTAL</Text>
					<Text className="text-right text-base font-medium text-slate-800">55€</Text>
				</View>
				<View className="bg-white shadow rounded-t-lg rounded-b-3xl p-5 mx-5 mb-7">
					<Text className="text-base font-medium text-slate-800 mb-2">20 juin 2023</Text>
					<Text className="font-medium text-slate-800">Prestation : Garderie</Text>
					<View className="flex-row mt-2">
						<Text className="font-medium text-slate-800 mr-2">Pet-sitter :</Text>
						<View className="flex-row items-center">
							<Image source={{ uri: Api+'/static/avatars/91e286d4-5dfc-4cc3-acbe-75344020310a.jpg' }} className="h-14 w-14 rounded-full mr-2"/>
							<Text className="font-medium text-slate-800" numberOfLines={2}>Emma{'\n'}Smith</Text>
						</View>
					</View>
					<Text className="font-medium text-slate-800 mt-2">Type de paiement : Carte bancaire</Text>
					<Text className="font-medium text-slate-800 mt-2">Animal supplémentaire : 1</Text>
					<Text className="text-right font-medium text-slate-800">TOTAL</Text>
					<Text className="text-right text-base text-slate-800">12€</Text>
					<Text className="text-right text-base text-slate-800">+5€</Text>
					<View className="h-[2px] w-12 ml-auto bg-slate-800"/>
					<Text className="text-right text-base font-medium text-slate-800">17€</Text>
				</View>
			</ScrollView>
		</ScreenLayout>
	);
};

const theme = {
	todayTextColor: '#fff',
	textSectionTitleColor: '#94a3b8',
	todayBackgroundColor: '#00adf5',
	dayTextColor: '#334155',
	textDayFontFamily: 'Poppins',
	textMonthFontFamily: 'Poppins',
	textDayHeaderFontFamily: 'Poppins',
	textDayHeaderFontWeight: '500',
	textDayFontWeight: '400',
	'stylesheet.day.basic': {
		today: {
			borderColor: '#48BFE3',
			borderRadius: 0
		},
	}
};

function renderCustomHeader(date: any) {
	const header = date.toString('MMMM yyyy');
	const [month, year] = header.split(' ');

	const textStyle: TextStyle = {
		fontSize: 18,
		fontWeight: 'bold',
		fontFamily: 'PaytoneOne-Regular',
		paddingBottom: 10,
		color: Theme.colors.primary,
		paddingRight: 5
	}

	return (
		<View style={styles.header}>
			<Text style={[styles.month, textStyle]}>{`${month}`}</Text>
			<Text style={[styles.year, textStyle]}>{year}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
		marginBottom: 10
	},
	month: {
		marginLeft: 5
	},
	year: {
		marginRight: 5
	}
});

export default HomeScreen;
