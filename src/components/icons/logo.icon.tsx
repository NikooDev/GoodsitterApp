import React from 'react';
import { Ellipse, G, Path } from 'react-native-svg'

const LogoIcon = () => {
	return (
		<G xmlns="http://www.w3.org/2000/svg">
			<Path d="m40,83.82l18.05-18.05c3.32-3.32,8.71-3.32,12.03,0l18.05,18.05c6.65,6.65,6.64,17.42,0,24.07-5.41,5.41-13.53,6.42-19.96,3.03-2.59-1.36-5.63-1.36-8.22,0-6.42,3.39-14.55,2.38-19.96-3.03-6.64-6.64-6.65-17.41,0-24.07Z" />
			<G>
				<Ellipse cx="48.38" cy="33.36" rx="12.8" ry="18.57" transform="translate(-6.99 13.66) rotate(-15)" />
				<Ellipse cx="78.92" cy="33.36" rx="18.57" ry="12.8" transform="translate(26.27 100.96) rotate(-75)" />
			</G>
			<G>
				<Ellipse cx="29.46" cy="58.31" rx="12.8" ry="18.57" transform="translate(-25.21 22.54) rotate(-30)" />
				<Ellipse cx="98.54" cy="58.86" rx="18.57" ry="12.8" transform="translate(-1.7 114.77) rotate(-60)" />
			</G>
		</G>
	);
};

export default LogoIcon;
