import React, { PropsWithChildren } from 'react';
import { Text as T, TextProps } from 'react-native';
import Class from 'classnames';

const Text: React.FC<PropsWithChildren & TextProps & { title?: boolean }> = (props) => {
	return (
		<T { ...props } className={Class(props.className, !props.title ? 'font-text tracking-tight' : 'font-title')}>
			{ props.children }
		</T>
	);
};

export default Text
