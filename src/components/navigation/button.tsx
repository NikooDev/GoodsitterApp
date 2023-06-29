import React, { PropsWithChildren } from 'react';
import { Pressable } from 'react-native';

const Button: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<Pressable>
			{ children }
		</Pressable>
	);
};

export default Button;
