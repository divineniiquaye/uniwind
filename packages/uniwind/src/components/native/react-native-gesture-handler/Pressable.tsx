import { Pressable as RNGHPressable, PressableProps } from 'react-native-gesture-handler'
import { UniwindStore } from '../../../core/native'
import { copyComponentProperties } from '../../utils'
import { useStyle } from '../useStyle'

export const Pressable = copyComponentProperties(RNGHPressable, (props: PressableProps) => {
    const style = useStyle(props.className, {
        isDisabled: Boolean(props.disabled),
    })

    return (
        <RNGHPressable
            {...props}
            style={state => {
                if (state.pressed) {
                    return [
                        UniwindStore.getStyles(
                            props.className,
                            { isDisabled: Boolean(props.disabled), isPressed: true },
                        ).styles,
                        typeof props.style === 'function' ? props.style(state) : props.style,
                    ]
                }

                return [style, typeof props.style === 'function' ? props.style(state) : props.style]
            }}
        />
    )
})

export default Pressable
