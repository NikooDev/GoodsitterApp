import { PropsWithChildren } from 'react'
import { StatusBarStyle, StyleProp, ViewStyle } from 'react-native'
import Class from 'classnames'

interface ILayout extends PropsWithChildren {
	classNames?: Class.Argument
	styles?: StyleProp<ViewStyle> | undefined
	statusBarStyle?: StatusBarStyle
	paddingTop?: boolean
	paddingBottom?: boolean
	profileLayout?: boolean
}

export default ILayout
