import React, { PropsWithChildren } from 'react';
import Loader from '@Component/loader/loader';

const LoaderLayout: React.FC<PropsWithChildren & { appLoading: boolean }> = ({
	children,
	appLoading}) => {
	return (
		<>
			{ !appLoading && children }

			<Loader appLoading={appLoading}/>
		</>
	);
};

export default LoaderLayout;
