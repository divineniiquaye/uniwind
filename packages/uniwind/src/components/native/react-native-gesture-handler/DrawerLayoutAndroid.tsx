import { DrawerLayoutAndroidProps } from 'react-native'
import { DrawerLayoutAndroid as RNGHDrawerLayoutAndroid } from 'react-native-gesture-handler'
import { copyComponentProperties } from '../../utils'
import { useStyle } from '../useStyle'

export const DrawerLayoutAndroid = copyComponentProperties(
    RNGHDrawerLayoutAndroid,
    (props: DrawerLayoutAndroidProps) => {
        const style = useStyle(props.className)

        return (
            <RNGHDrawerLayoutAndroid
                {...props}
                style={[style, props.style]}
            />
        )
    },
)

export default DrawerLayoutAndroid
