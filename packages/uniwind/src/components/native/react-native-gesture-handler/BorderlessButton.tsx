import { BorderlessButton as RNGHBorderlessButton, BorderlessButtonProps } from 'react-native-gesture-handler'
import { copyComponentProperties } from '../../utils'
import { useStyle } from '../useStyle'

export const BorderlessButton = copyComponentProperties(
    RNGHBorderlessButton,
    (props: BorderlessButtonProps) => {
        const style = useStyle(props.className)

        return (
            <RNGHBorderlessButton
                {...props}
                style={[style, props.style]}
            />
        )
    },
)

export default BorderlessButton
