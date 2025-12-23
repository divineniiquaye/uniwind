import { NativeAppEventEmitter } from 'react-native'
import { StyleDependency } from '../types'

type SubscribeOptions = {
    once?: boolean
}

// Event name prefix for uniwind events
const EVENT_PREFIX = 'uniwind:'

// Generate event name for a dependency
const getEventName = (dependency: StyleDependency): string => {
    return `${EVENT_PREFIX}${StyleDependency[dependency]}`
}

// Event name for notifyAll
const ALL_EVENT_NAME = `${EVENT_PREFIX}all`

class UniwindListenerBuilder {
    notify(dependencies: Array<StyleDependency>) {
        dependencies.forEach(dep => {
            const eventName = getEventName(dep)
            NativeAppEventEmitter.emit(eventName, { dependency: dep })
        })
    }

    notifyAll() {
        NativeAppEventEmitter.emit(ALL_EVENT_NAME, {})
    }

    subscribe(listener: () => void, dependencies: Array<StyleDependency>, options?: SubscribeOptions) {
        const subscriptions: Array<{ remove: () => void }> = []
        let disposed = false

        const wrappedListener = () => {
            if (disposed) return
            listener()

            if (options?.once) {
                dispose()
            }
        }

        const dispose = () => {
            if (disposed) return
            disposed = true
            subscriptions.forEach(subscription => {
                subscription.remove()
            })
        }

        // Subscribe to specific dependency events
        dependencies.forEach(dep => {
            const eventName = getEventName(dep)
            const subscription = NativeAppEventEmitter.addListener(eventName, wrappedListener)
            subscriptions.push(subscription)
        })

        // Also subscribe to the "all" event so listeners are notified when notifyAll() is called
        const allEventSubscription = NativeAppEventEmitter.addListener(ALL_EVENT_NAME, wrappedListener)
        subscriptions.push(allEventSubscription)

        // Return dispose function that removes all subscriptions
        return dispose
    }
}

export const UniwindListener = new UniwindListenerBuilder()
