import React, { useEffect, useRef } from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import IButtonGroupProps from '@Type/buttonGroup';

const ButtonGroup = ({
	values,
	value,
	height = 50,
	onSelect,
	style,
	highlightBackgroundColor,
	highlightTextColor,
	inactiveBackgroundColor,
	inactiveTextColor,
	textStyle = {},
}: IButtonGroupProps) => {
	const [prevSelectedIndex, setPrevSelectedIndex] = React.useState(0);
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const selectedPanelLeft = useRef(new Animated.Value(0));

	const widthSize = 100 / values.length;
	const interpolatedValuesInput = values.map((_, i) => {
		return widthSize * i;
	});
	const interpolatedValuesOutput = values.map((_, i) => {
		return `${widthSize * i}%`;
	});

	useEffect(() => {
		const left = widthSize * selectedIndex;

		Animated.timing(selectedPanelLeft.current, {
			toValue: left,
			duration: 300,
			easing: Easing.inOut(Easing.ease),
			useNativeDriver: false,
		}).start(() => {
			setPrevSelectedIndex(selectedIndex);
		});
	}, [widthSize, selectedPanelLeft, selectedIndex]);

	useEffect(() => {
		const newIndex = values.findIndex((v) => v === value);
		setPrevSelectedIndex(selectedIndex);
		setSelectedIndex(newIndex);
	}, [values, value, selectedIndex])

	const maxIndex = selectedIndex > prevSelectedIndex ? selectedIndex : prevSelectedIndex;
	const minIndex = selectedIndex > prevSelectedIndex ? prevSelectedIndex : selectedIndex;

	const highlightMask = {
		backgroundColor: highlightBackgroundColor,
	};

	const highlightText = {
		color: highlightTextColor,
	};

	const inactiveText = {
		color: inactiveTextColor,
	};

	const inactiveBackground = {
		backgroundColor: inactiveBackgroundColor,
	};

	const inactiveContainerIOS = Platform.OS === 'ios' ? { zIndex: -1 } : {};


	return (
		<View accessible accessibilityRole="radiogroup" style={[styles.container, style, { height }]}>
			<MaskedView
				importantForAccessibility="no-hide-descendants"
				accessibilityElementsHidden={true}
				key={selectedIndex}
				style={styles.maskViewContainer}
				androidRenderingMode="software" maskElement={
				<Animated.View
					style={[
						styles.blueMaskContainer,
						{
							width: `${widthSize}%`,
							left: selectedPanelLeft.current.interpolate({
								inputRange: interpolatedValuesInput,
								outputRange: interpolatedValuesOutput,
							})
						}
					]}
				/>
			}>
				<View style={[styles.baseButtonContainer, highlightMask]}>
					{ values.map((value, i) => (
						<Pressable
							key={i}
							style={styles.baseTouchableRipple}
							onPress={() => {
								setSelectedIndex(i);
								onSelect(values[i]);
							}}>
							<Text numberOfLines={1} style={[styles.baseButtonText, styles.highlightText, textStyle, highlightText]}>
								{value}
							</Text>
						</Pressable>
					)) }
				</View>
			</MaskedView>
			<View style={[styles.baseButtonContainer, styles.inactiveButtonContainer, inactiveContainerIOS]}>
				{values.map((value, i) => (
					<Pressable
						accessibilityRole="radio"
						accessibilityState={{ checked: selectedIndex === i }}
						accessibilityLiveRegion="polite"
						key={i}
						style={[styles.baseTouchableRipple, { zIndex: minIndex <= i && maxIndex >= i ? -1 : 0 }, inactiveBackground]}
						onPress={() => {
							setSelectedIndex(i);
							onSelect(values[i]);
						}}>
						<Text style={[styles.baseButtonText, textStyle, inactiveText]} numberOfLines={1}>
							{value}
						</Text>
					</Pressable>
				))}
			</View>
		</View>
	);
};

export default ButtonGroup;

const styles = StyleSheet.create({
	container: {
		position: 'relative'
	},
	maskViewContainer: {
		width: '100%',
		height: '100%',
		position: 'relative'
	},
	blueMaskContainer: {
		position: 'absolute',
		backgroundColor: 'black',
		borderRadius: 10,
		height: '100%',
		left: 0,
		top: 0,
	},
	baseButtonContainer: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'nowrap',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	inactiveButtonContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
	},
	baseTouchableRipple: {
		height: '100%',
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	baseButtonText: {
		paddingHorizontal: 16,
	},
	highlightText: {
		zIndex: 1,
	}
});
