import React from 'react';
import { View } from 'react-native';
import { SkeletonRect } from '@Component/loader/skeletons';

const TabLoader = () => {
	return (
		<View className="mt-2">
			<SkeletonRect marginBottom={10} widthRect={300} radius={15} heightRect={32} colorContainer="#cbd5e1" colorGradient={{ center: '#f1f5f9', between: '#cbd5e1' }}/>
			<SkeletonRect marginBottom={10} widthRect={250} radius={15} heightRect={32} colorContainer="#cbd5e1" colorGradient={{ center: '#f1f5f9', between: '#cbd5e1' }}/>
			<SkeletonRect marginBottom={10} widthRect={200} radius={15} heightRect={32} colorContainer="#cbd5e1" colorGradient={{ center: '#f1f5f9', between: '#cbd5e1' }}/>
			<SkeletonRect marginBottom={10} radius={15} heightRect={250} colorContainer="#cbd5e1" colorGradient={{ center: '#f1f5f9', between: '#cbd5e1' }}/>
		</View>
	);
};

export default TabLoader;
