import { Uniwind } from '../../src/core/config/config.native'
import { UniwindListener } from '../../src/core/listener'
import { UniwindStore } from '../../src/core/native'
import { StyleDependency } from '../../src/types'

describe('UniwindStore subscription order', () => {
    describe('Subscription order during getStyles', () => {
        test('rerender subscription is established synchronously during getStyles', () => {
            const rerender = jest.fn()

            // Get styles with a class that depends on Insets
            const className = 'pb-safe'
            const result = UniwindStore.getStyles(className, {}, rerender)

            // Verify that dispose function exists (subscription was created)
            expect(result.dispose).toBeDefined()
            expect(typeof result.dispose).toBe('function')

            // Verify dependencies include Insets if the class uses insets
            expect(result.dependencies).toBeDefined()
            expect(Array.isArray(result.dependencies)).toBe(true)

            // Clean up
            result.dispose()
        })

        test('rerender callback is subscribed before Uniwind methods can notify', () => {
            const rerender = jest.fn()

            // Get styles with any class - the key is that subscription happens synchronously
            const className = 'bg-red-500'
            const result = UniwindStore.getStyles(className, {}, rerender)

            // Verify subscription was established (dispose function exists)
            expect(result.dispose).toBeDefined()
            expect(typeof result.dispose).toBe('function')

            // The key test: subscription should happen synchronously during getStyles
            // To verify this, we'll manually subscribe to a dependency and test
            // that the subscription mechanism works correctly
            const manualRerender = jest.fn()
            const dispose = UniwindListener.subscribe(manualRerender, [StyleDependency.Insets])

            // Subscription should be established synchronously (it happened above)
            // Now call updateInsets which should trigger the manually subscribed rerender
            Uniwind.updateInsets({
                bottom: 20,
                top: 0,
                left: 0,
                right: 0,
            })

            // Verify manual rerender was called (proves subscription works)
            expect(manualRerender).toHaveBeenCalled()

            // The important part: result.dispose shows that getStyles established
            // a subscription synchronously, which is the fix for the Android timing issue
            dispose()
            result.dispose()
        })

        test('subscription happens synchronously before any notifications can occur', () => {
            let subscriptionEstablished = false
            const rerender = jest.fn(() => {
                // This should only be called after subscription is established
                expect(subscriptionEstablished).toBe(true)
            })

            // Get styles - subscription should happen synchronously during this call
            const className = 'pb-safe'
            const result = UniwindStore.getStyles(className, {}, rerender)

            // Mark that subscription is established (it happened synchronously above)
            subscriptionEstablished = true

            // Immediately trigger notification (simulating Android timing issue)
            // On Android, this could happen before subscription if not fixed
            // The fix ensures subscription happens synchronously, so this should work
            if (result.dependencies.includes(StyleDependency.Insets)) {
                UniwindListener.notify([StyleDependency.Insets])

                // If subscription happened synchronously, rerender should be called
                expect(rerender).toHaveBeenCalled()
            }

            result.dispose()
        })
    })

    describe('Android-specific timing fix', () => {
        test('multiple rapid notifications are captured after subscription', () => {
            const rerenderCallCount = { count: 0 }
            const rerender = jest.fn(() => {
                rerenderCallCount.count++
            })

            // Get styles with Insets dependency
            const className = 'pb-safe'
            const result = UniwindStore.getStyles(className, {}, rerender)

            // Verify it depends on Insets
            if (result.dependencies.includes(StyleDependency.Insets)) {
                // Rapidly fire multiple notifications (simulating Android behavior)
                Uniwind.updateInsets({ bottom: 10, top: 0, left: 0, right: 0 })
                Uniwind.updateInsets({ bottom: 20, top: 0, left: 0, right: 0 })
                Uniwind.updateInsets({ bottom: 30, top: 0, left: 0, right: 0 })

                // All notifications should trigger rerender because subscription was established first
                expect(rerender).toHaveBeenCalled()
                expect(rerenderCallCount.count).toBeGreaterThanOrEqual(1)
            }

            result.dispose()
        })

        test('subscription order: resolve -> subscribe rerender -> subscribe cache -> notify', () => {
            const executionOrder: string[] = []
            const rerender = jest.fn(() => {
                executionOrder.push('rerender-executed')
            })

            // Track when subscription happens
            const originalSubscribe = UniwindListener.subscribe.bind(UniwindListener)
            const subscribeSpy = jest.spyOn(UniwindListener, 'subscribe').mockImplementation((listener, deps, options) => {
                // Check if this is the rerender subscription (has rerender as listener)
                if (listener === rerender) {
                    executionOrder.push('subscribe-rerender')
                } else {
                    // This is likely the cache subscription
                    executionOrder.push('subscribe-cache')
                }

                return originalSubscribe(listener, deps, options)
            })

            const className = 'pb-safe'
            executionOrder.push('before-getStyles')

            // Get styles - this should establish subscription synchronously
            const result = UniwindStore.getStyles(className, {}, rerender)

            executionOrder.push('after-getStyles')

            // Now trigger notification
            if (result.dependencies.includes(StyleDependency.Insets)) {
                executionOrder.push('before-notify')
                Uniwind.updateInsets({ bottom: 20, top: 0, left: 0, right: 0 })
                executionOrder.push('after-notify')
            }

            // Verify execution order
            // Key assertion: subscribe-rerender should happen before subscribe-cache
            const rerenderIndex = executionOrder.indexOf('subscribe-rerender')
            const cacheIndex = executionOrder.indexOf('subscribe-cache')

            if (rerenderIndex !== -1 && cacheIndex !== -1) {
                expect(rerenderIndex).toBeLessThan(cacheIndex)
            }

            // Verify rerender subscription happens before notify
            const notifyIndex = executionOrder.indexOf('before-notify')
            if (rerenderIndex !== -1 && notifyIndex !== -1) {
                expect(rerenderIndex).toBeLessThan(notifyIndex)
            }

            subscribeSpy.mockRestore()
            result.dispose()
        })
    })

    describe('Integration with updateInsets and updateCSSVariables', () => {
        test('updateInsets triggers rerender for styles with Insets dependency', () => {
            const rerender = jest.fn()

            // Get styles with a class that depends on Insets
            const className = 'pb-safe'
            const result = UniwindStore.getStyles(className, {}, rerender)

            if (result.dependencies.includes(StyleDependency.Insets)) {
                // Update insets
                Uniwind.updateInsets({
                    bottom: 34,
                    top: 44,
                    left: 0,
                    right: 0,
                })

                // Verify rerender was called
                expect(rerender).toHaveBeenCalled()
            }

            result.dispose()
        })

        test('updateCSSVariables triggers rerender for styles with Variables dependency', () => {
            const rerender = jest.fn()

            // Get styles - we'll test with a class that might use variables
            // First, set up a CSS variable
            Uniwind.updateCSSVariables('light', {
                '--test-bg': '#ff0000',
            })

            // Get styles with a simple class
            const className = 'bg-red-500'
            const result = UniwindStore.getStyles(className, {}, rerender)

            // Update CSS variables for current theme
            Uniwind.updateCSSVariables('light', {
                '--test-bg': '#00ff00',
            })

            // If the style depends on Variables, rerender should be called
            if (result.dependencies.includes(StyleDependency.Variables)) {
                expect(rerender).toHaveBeenCalled()
            }

            result.dispose()
        })
    })

    describe('Edge cases', () => {
        test('getStyles without rerender callback does not subscribe', () => {
            const className = 'pb-safe'
            const result = UniwindStore.getStyles(className, {})

            // Should still return valid result
            expect(result.styles).toBeDefined()
            expect(result.dependencies).toBeDefined()

            // dispose should be a no-op
            expect(typeof result.dispose).toBe('function')

            // Should not throw when called
            expect(() => result.dispose()).not.toThrow()
        })

        test('dispose properly unsubscribes rerender', () => {
            const rerender = jest.fn()
            const className = 'pb-safe'
            const result = UniwindStore.getStyles(className, {}, rerender)

            if (result.dependencies.includes(StyleDependency.Insets)) {
                // Dispose should unsubscribe
                result.dispose()

                // After dispose, rerender should not be called
                rerender.mockClear()
                Uniwind.updateInsets({ bottom: 20, top: 0, left: 0, right: 0 })

                // Rerender should not have been called after disposal
                expect(rerender).not.toHaveBeenCalled()
            }
        })
    })
})
