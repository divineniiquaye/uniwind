/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useEffect, useMemo, useReducer } from 'react'
import { UniwindStore } from '../../core/native'
import { ComponentState, RNStyle } from '../../core/types'
import { StyleDependency } from '../../types'

const emptyState = { styles: {} as RNStyle, dependencies: [] as Array<StyleDependency>, dispose: () => ({}) }

export const useStyle = (className?: string, state?: ComponentState) => {
    const [_, rerender] = useReducer(() => ({}), {})
    const styleState = useMemo(
        () =>
            className
                ? UniwindStore.getStyles(className, {
                    isDisabled: state?.isDisabled,
                    isFocused: state?.isFocused,
                    isPressed: state?.isPressed,
                }, rerender)
                : emptyState,
        [className, _, state?.isDisabled, state?.isFocused, state?.isPressed],
    )

    useEffect(() => styleState.dispose, [])

    return styleState.styles
}
