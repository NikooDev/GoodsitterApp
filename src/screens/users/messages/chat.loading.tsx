import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Dimensions, View } from 'react-native';
import { SkeletonCircle, SkeletonRect } from '@Component/loader/skeletons';
import Class from 'classnames';

const ChatLoading = () => {
	const { width } = Dimensions.get('screen')

	return (
		<>
			<View className="py-5 px-3">
				<View className="mr-auto flex-row items-start mb-3">
					<View className="bg-white shadow h-9 w-9 rounded-full mr-3 justify-center items-center">
						<View className="border-[2.5px] border-white rounded-full">
							<SkeletonCircle widthCicle={35} heightCircle={35} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
						</View>
					</View>
					<View className={Class('bg-white shadow p-3 max-w-[80%] self-start rounded-2xl align-baseline')}>
						<SkeletonRect widthRect={width - 150} radius={12} heightRect={14} marginBottom={7} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
						<SkeletonRect widthRect={width - 190} radius={12} heightRect={14} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
					</View>
				</View>
				<View className="ml-auto flex-row items-start mb-3">
					<View className={Class('bg-white shadow p-3 max-w-[80%] self-start rounded-2xl align-baseline')}>
						<SkeletonRect widthRect={width - 150} radius={12} heightRect={14} marginBottom={7} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
						<SkeletonRect widthRect={width - 270} radius={12} heightRect={14} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
					</View>
				</View>
				<View className="ml-auto flex-row items-start mb-3">
					<View className={Class('bg-white shadow p-3 max-w-[80%] self-start rounded-2xl align-baseline')}>
						<SkeletonRect widthRect={width - 220} radius={12} heightRect={14} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
					</View>
				</View>
				<View className="mr-auto flex-row items-start mb-3">
					<View className="bg-white shadow h-9 w-9 rounded-full mr-3 justify-center items-center">
						<View className="border-[2.5px] border-white rounded-full">
							<SkeletonCircle widthCicle={35} heightCircle={35} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
						</View>
					</View>
					<View className={Class('bg-white shadow p-3 max-w-[80%] self-start rounded-2xl align-baseline')}>
						<SkeletonRect widthRect={width - 180} radius={12} heightRect={14} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
					</View>
				</View>
				<View className="mr-auto flex-row items-start mb-3">
					<View className="bg-white shadow h-9 w-9 rounded-full mr-3 justify-center items-center">
						<View className="border-[2.5px] border-white rounded-full">
							<SkeletonCircle widthCicle={35} heightCircle={35} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
						</View>
					</View>
					<View className={Class('bg-white shadow p-3 max-w-[80%] self-start rounded-2xl align-baseline')}>
						<SkeletonRect widthRect={width - 180} radius={12} heightRect={14} marginBottom={7} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
						<SkeletonRect widthRect={width - 290} radius={12} heightRect={14} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
					</View>
				</View>
				<View className="ml-auto flex-row items-start mb-3">
					<View className={Class('bg-white shadow p-3 max-w-[80%] self-start rounded-2xl align-baseline')}>
						<SkeletonRect widthRect={width - 180} radius={12} heightRect={14} marginBottom={7} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
						<SkeletonRect widthRect={width - 200} radius={12} heightRect={14} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
					</View>
				</View>
				<View className="mr-auto flex-row items-start mb-3">
					<View className="bg-white shadow h-9 w-9 rounded-full mr-3 justify-center items-center">
						<View className="border-[2.5px] border-white rounded-full">
							<SkeletonCircle widthCicle={35} heightCircle={35} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
						</View>
					</View>
					<View className={Class('bg-white shadow p-3 max-w-[80%] self-start rounded-2xl align-baseline')}>
						<SkeletonRect widthRect={width - 200} radius={12} heightRect={14} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
					</View>
				</View>
				<View className="ml-auto flex-row items-start mb-3">
					<View className={Class('bg-white shadow p-3 max-w-[80%] self-start rounded-2xl align-baseline')}>
						<SkeletonRect widthRect={width - 230} radius={12} heightRect={14} marginBottom={7} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
						<SkeletonRect widthRect={width - 150} radius={12} heightRect={14} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
					</View>
				</View>
				<View className="mr-auto flex-row items-start mb-3">
					<View className="bg-white shadow h-9 w-9 rounded-full mr-3 justify-center items-center">
						<View className="border-[2.5px] border-white rounded-full">
							<SkeletonCircle widthCicle={35} heightCircle={35} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
						</View>
					</View>
					<View className={Class('bg-white shadow p-3 max-w-[80%] self-start rounded-2xl align-baseline')}>
						<SkeletonRect widthRect={width - 250} radius={12} heightRect={14} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
					</View>
				</View>
				<View className="mr-auto flex-row items-start mb-3">
					<View className="bg-white shadow h-9 w-9 rounded-full mr-3 justify-center items-center">
						<View className="border-[2.5px] border-white rounded-full">
							<SkeletonCircle widthCicle={35} heightCircle={35} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
						</View>
					</View>
					<View className={Class('bg-white shadow p-3 max-w-[80%] self-start rounded-2xl align-baseline')}>
						<SkeletonRect widthRect={width - 150} radius={12} heightRect={14} colorContainer="#e2e8f0" colorGradient={{ center: '#f1f5f9', between: '#e2e8f0' }}/>
					</View>
				</View>
			</View>
			<LinearGradient style={{width: width}} className={Class('absolute h-full z-40 mt-[62px]')} start={{x: 0, y: 0}} end={{x: 0, y: 1}} colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}/>
		</>
	);
};

export default ChatLoading;
