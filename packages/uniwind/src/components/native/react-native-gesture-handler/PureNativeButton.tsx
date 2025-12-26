import { PureNativeButton as RNGHPureNativeButton, RawButtonProps } from 'react-native-gesture-handler'
import { copyComponentProperties } from '../../utils'
import { useStyle } from '../useStyle'

export const PureNativeButton = copyComponentProperties(RNGHPureNativeButton, (props: RawButtonProps) => {
    const style = useStyle(props.className)

    return (
        <RNGHPureNativeButton
            {...props}
            style={[style, props.style]}
        />
    )
})

export default PureNativeButton
