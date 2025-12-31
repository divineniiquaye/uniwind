import { ComponentPropsWithRef, ElementType, useMemo } from 'react'
import { withUniwind } from '../hoc'
import { ApplyUniwind } from '../hoc/types'
import { Uniwind as UniwindConfig } from './config'

type BoxProps<T extends ElementType> = {
    as: T
} & ApplyUniwind<Omit<ComponentPropsWithRef<T>, 'as'>>

const Box = <T extends ElementType>({ as, ...props }: BoxProps<T>) => {
    const StyledComponent = useMemo(() => withUniwind(as as any), [as])
    return <StyledComponent {...props} />
}

export const Uniwind = Object.assign(
    Box,
    UniwindConfig,
) as typeof UniwindConfig & typeof Box
