import React, { PropsWithChildren } from 'react';
import Svg, { SvgProps } from 'react-native-svg';

const SvgIcon: React.FC<PropsWithChildren & SvgProps> = (props) => {
	return (
		<Svg { ...props }>
			{ props.children }
		</Svg>
	);
};

export default SvgIcon
