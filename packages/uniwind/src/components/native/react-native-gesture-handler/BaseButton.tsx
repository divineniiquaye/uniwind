import { BaseButton as RNGHBaseButton, BaseButtonProps } from 'react-native-gesture-handler'
import { copyComponentProperties } from '../../utils'
import { useStyle } from '../useStyle'

type BaseButtonPropsWithClassName = BaseButtonProps & { className?: string }

export const BaseButton = copyComponentProperties(RNGHBaseButton, (props: BaseButtonPropsWithClassName) => {
    const style = useStyle(props.className)

    return (
        <RNGHBaseButton
            {...props}
            style={[style, props.style]}
        />
    )
})

export default BaseButton
