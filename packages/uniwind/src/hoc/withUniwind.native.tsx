import { ComponentProps, useEffect, useReducer } from 'react'
import { UniwindStore } from '../core/native'
import { AnyObject, Component, OptionMapping, WithUniwind } from './types'
import { classToColor, classToStyle, isClassProperty, isColorClassProperty, isStyleProperty } from './withUniwindUtils'

export const withUniwind: WithUniwind = <
    TComponent extends Component,
    TOptions extends Record<keyof ComponentProps<TComponent>, OptionMapping>,
>(
    Component: TComponent,
    options?: TOptions,
) => options
    ? withManualUniwind(Component, options)
    : withAutoUniwind(Component)

const withAutoUniwind = (Component: Component<AnyObject>) => (props: AnyObject) => {
    const [, rerender] = useReducer(() => ({}), {})
    const { dependencies, generatedProps } = Object.entries(props).reduce((acc, [propName, propValue]) => {
        if (isColorClassProperty(propName)) {
            const colorProp = classToColor(propName)

            if (props[colorProp] !== undefined) {
                return acc
            }

            const { styles, dispose } = UniwindStore.getStyles(propValue, {}, rerender)

            acc.dependencies.push(dispose)
            acc.generatedProps[colorProp] = styles.accentColor

            return acc
        }

        if (isClassProperty(propName)) {
            const styleProp = classToStyle(propName)
            const { styles, dispose } = UniwindStore.getStyles(propValue, {}, rerender)

            acc.dependencies.push(dispose)
            acc.generatedProps[styleProp] ??= []
            acc.generatedProps[styleProp][0] = styles

            return acc
        }

        if (isStyleProperty(propName)) {
            acc.generatedProps[propName] ??= []
            acc.generatedProps[propName][1] = propValue

            return acc
        }

        return acc
    }, { generatedProps: {} as AnyObject, dependencies: [] as Array<() => void> })

    useEffect(() => () => dependencies.forEach(dispose => dispose()), [dependencies])

    return (
        <Component
            {...props}
            {...generatedProps}
        />
    )
}

const withManualUniwind = (Component: Component<AnyObject>, options: Record<PropertyKey, OptionMapping>) => (props: AnyObject) => {
    const [, rerender] = useReducer(() => ({}), {})
    const { generatedProps, dependencies } = Object.entries(options).reduce((acc, [propName, option]) => {
        const className = props[option.fromClassName]

        if (className === undefined) {
            return acc
        }

        if (option.styleProperty !== undefined) {
            // If the prop is already defined, we don't want to override it
            if (props[propName] !== undefined) {
                return acc
            }

            const { styles, dispose } = UniwindStore.getStyles(className, {}, rerender)

            acc.generatedProps[propName] = styles[option.styleProperty]
            acc.dependencies.push(dispose)

            return acc
        }

        const { styles, dispose } = UniwindStore.getStyles(className, {}, rerender)

        acc.generatedProps[propName] = styles
        acc.dependencies.push(dispose)

        return acc
    }, { generatedProps: {} as AnyObject, dependencies: [] as Array<() => void> })

    useEffect(() => () => dependencies.forEach(dispose => dispose()), [dependencies])

    return (
        <Component
            {...props}
            {...generatedProps}
        />
    )
}
