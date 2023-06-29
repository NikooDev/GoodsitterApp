import React from 'react';
import { Dimensions, View } from 'react-native';
import { tabsLeft, tabCenter, tabsRight, tabsGuest } from '@Navigator/tabs';
import { IRootState } from '@Type/state';
import { IRouteUsers } from '@Type/stack';
import { useSelector } from 'react-redux';
import BottomTabIcon from '@Component/icons/bottomTab.icon';
import ButtonTab from '@Navigator/tabs/button.tab';

const BottomTabs = (route: { name: IRouteUsers }) => {
	const { auth } = useSelector((state: IRootState) => state);
	const { width } = Dimensions.get('screen');
	const originalWidth = 450;
	const originalHeight = 153;
	const aspectRatio = originalWidth / originalHeight;

	return (
		<View className="absolute flex flex-row items-center bottom-0" style={{width}}>
			<View className="absolute bottom-0" style={{width, aspectRatio}}>
				<BottomTabIcon/>
			</View>
			<View className="flex flex-row h-24 justify-around pr-14 pl-3" style={{width: width / 2}}>
				{
					auth.isAuth && tabsLeft.map((props, index) => (
						<ButtonTab
							key={index}
							title={props.title}
							iconPath={props.iconPath}
							routeName={props.routeName as IRouteUsers}
							currentRoute={route.name}/>
					))

				}
				{
					!auth.isAuth && tabsGuest[0].map((props, index) => (
						<ButtonTab
							key={index}
							guest={true}
							title={props.title}
							iconPath={props.iconPath}
							routeName={props.routeName as IRouteUsers}
							currentRoute={route.name}/>
					))
				}
			</View>
			<View className="z-10">
				<View className="absolute -top-[60px] -left-8">
					{
						tabCenter.map((props, index) => (
							<ButtonTab
								key={index}
								title={props.title}
								iconPathList={props.iconPathList}
								iconPath={props.iconPath}
								routeName={props.routeName as IRouteUsers}
								currentRoute={route.name}/>
						))
					}
				</View>
			</View>
			<View className="flex flex-row h-24 justify-around pl-14 pr-3" style={{width: width / 2}}>
				{
					auth.isAuth && tabsRight.map((props, index) => (
						<ButtonTab
							key={index}
							title={props.title}
							notifications={props.notifications}
							iconPath={props.iconPath}
							routeName={props.routeName as IRouteUsers}
							currentRoute={route.name}/>
					))
				}
				{
					!auth.isAuth && tabsGuest[1].map((props, index) => (
						<ButtonTab
							key={index}
							guest={true}
							title={props.title}
							iconPath={props.iconPath}
							routeName={props.routeName as IRouteUsers}
							currentRoute={route.name}/>
					))
				}
			</View>
		</View>
	);
};

export default BottomTabs;
