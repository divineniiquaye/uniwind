module.exports = {
    get BaseButton() {
        return require('./BaseButton').BaseButton
    },
    get BorderlessButton() {
        return require('./BorderlessButton').BorderlessButton
    },
    get DrawerLayoutAndroid() {
        return require('./DrawerLayoutAndroid').DrawerLayoutAndroid
    },
    get FlatList() {
        return require('./FlatList').FlatList
    },
    get GestureHandlerRootView() {
        return require('./GestureHandlerRootView').GestureHandlerRootView
    },
    get Pressable() {
        return require('./Pressable').Pressable
    },
    get PureNativeButton() {
        return require('./PureNativeButton').PureNativeButton
    },
    get RawButton() {
        return require('./RawButton').RawButton
    },
    get RectButton() {
        return require('./RectButton').RectButton
    },
    get RefreshControl() {
        return require('./RefreshControl').RefreshControl
    },
    get ScrollView() {
        return require('./ScrollView').ScrollView
    },
    get Switch() {
        return require('./Switch').Switch
    },
    get Text() {
        return require('./Text').Text
    },
    get TextInput() {
        return require('./TextInput').TextInput
    },
    get TouchableNativeFeedback() {
        return require('./TouchableNativeFeedback').TouchableNativeFeedback
    },
    get TouchableOpacity() {
        return require('./TouchableOpacity').TouchableOpacity
    },
    get TouchableWithoutFeedback() {
        return require('./TouchableWithoutFeedback').TouchableWithoutFeedback
    },

    // Re-export non-component exports from react-native-gesture-handler
    get DrawerLayout() {
        return require('react-native-gesture-handler').DrawerLayout
    },
    get Swipeable() {
        return require('react-native-gesture-handler').Swipeable
    },
    get TouchableHighlight() {
        return require('react-native-gesture-handler').TouchableHighlight
    },
    get Directions() {
        return require('react-native-gesture-handler').Directions
    },
    get State() {
        return require('react-native-gesture-handler').State
    },
    get PointerType() {
        return require('react-native-gesture-handler').PointerType
    },
    get gestureHandlerRootHOC() {
        return require('react-native-gesture-handler').gestureHandlerRootHOC
    },
    get GestureDetector() {
        return require('react-native-gesture-handler').GestureDetector
    },
    get Gesture() {
        return require('react-native-gesture-handler').Gesture
    },
    get TapGestureHandler() {
        return require('react-native-gesture-handler').TapGestureHandler
    },
    get ForceTouchGestureHandler() {
        return require('react-native-gesture-handler').ForceTouchGestureHandler
    },
    get LongPressGestureHandler() {
        return require('react-native-gesture-handler').LongPressGestureHandler
    },
    get PanGestureHandler() {
        return require('react-native-gesture-handler').PanGestureHandler
    },
    get PinchGestureHandler() {
        return require('react-native-gesture-handler').PinchGestureHandler
    },
    get RotationGestureHandler() {
        return require('react-native-gesture-handler').RotationGestureHandler
    },
    get FlingGestureHandler() {
        return require('react-native-gesture-handler').FlingGestureHandler
    },
    get createNativeWrapper() {
        return require('react-native-gesture-handler').createNativeWrapper
    },
    get NativeViewGestureHandler() {
        return require('react-native-gesture-handler').NativeViewGestureHandler
    },
    get HoverEffect() {
        return require('react-native-gesture-handler').HoverEffect
    },
    get MouseButton() {
        return require('react-native-gesture-handler').MouseButton
    },
    get enableExperimentalWebImplementation() {
        return require('react-native-gesture-handler').enableExperimentalWebImplementation
    },
    get enableLegacyWebImplementation() {
        return require('react-native-gesture-handler').enableLegacyWebImplementation
    },
}
