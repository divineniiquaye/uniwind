import { GestureHandlerRootView as RNGestureHandlerRootView } from 'react-native-gesture-handler'
import { GestureHandlerRootViewProps } from 'react-native-gesture-handler/lib/typescript/components/GestureHandlerRootView'
import { copyComponentProperties } from '../../utils'
import { useStyle } from '../useStyle'

export const GestureHandlerRootView = copyComponentProperties(
    RNGestureHandlerRootView,
    (props: GestureHandlerRootViewProps) => {
        const style = useStyle(props.className)

        return (
            <RNGestureHandlerRootView
                {...props}
                style={[style, props.style]}
            />
        )
    },
)

export default GestureHandlerRootView
