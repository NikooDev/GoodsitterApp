import React from 'react';
import { Dimensions, View } from 'react-native';
import { SkeletonCircle, SkeletonRect } from '@Component/loader/skeletons';

const MessagesLoading = () => {
	const { width } = Dimensions.get('screen')

	return (
		<View className="flex flex-row bg-white shadow rounded-2xl items-center px-3 py-3 mx-3 mb-3" style={{shadowColor: 'rgb(210,219,232)'}}>
			<View className="bg-white shadow items-center justify-center rounded-full h-[60px] w-[60px] mr-4">
				<View className="border-4 border-white rounded-full">
					<SkeletonCircle widthCicle={60} heightCircle={60} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
				</View>
			</View>
			<View style={{width: width - 130}}>
				<SkeletonRect widthRect={width - 130} radius={30} marginBottom={4} heightRect={21} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
				<SkeletonRect widthRect={150} radius={30} marginBottom={4} heightRect={21} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
				<View className="ml-auto">
					<SkeletonRect widthRect={100} radius={30} heightRect={18} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
				</View>
			</View>
		</View>
	);
};

export default MessagesLoading;
