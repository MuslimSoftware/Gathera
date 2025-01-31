import { Image, Animated, Easing, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colours, Sizes } from '../styles/Styles';
import Constants from 'expo-constants';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { navigateToScreenFromPushNotification } from '../utils/PushNotifications';
import { getPlaceBottomSheetContextValues } from '../context/PlaceBottomSheetContext';

const entranceAnimationConfig = {
    toValue: 1,
    duration: 500,
    useNativeDriver: false,
    easing: Easing.elastic(1),
};

const exitAnimationConfig = {
    toValue: 0,
    duration: 500,
    useNativeDriver: false,
    easing: Easing.elastic(1),
};

export const PushNotification = () => {
    const { notification, clearPreviousNotification } = usePushNotifications();
    const { appNavigationContainerRef } = getPlaceBottomSheetContextValues();
    const [animation] = React.useState(new Animated.Value(0));

    React.useEffect(() => {
        Animated.timing(animation, entranceAnimationConfig).start();

        const timeoutID = setTimeout(() => {
            Animated.timing(animation, exitAnimationConfig).start(() => clearPreviousNotification());
        }, 5000);

        return () => {
            clearTimeout(timeoutID);
        };
    }, [notification]);

    // Define pan responder for swipe gesture
    const panResponder = React.useMemo(
        () =>
            PanResponder.create({
                onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy < 0,
                onPanResponderRelease: (_, gestureState) => {
                    if (gestureState.dy < -10) {
                        // If user has swiped enough to dismiss
                        Animated.timing(animation, exitAnimationConfig).start(() => clearPreviousNotification());
                    }
                },
            }),
        [animation, clearPreviousNotification]
    );

    if (!notification) return null; // No notification to display

    const notificationPressHandler = () => {
        // Clear notification
        Animated.timing(animation, exitAnimationConfig).start(() => clearPreviousNotification());

        // Navigate to screen
        navigateToScreenFromPushNotification(notification.data, appNavigationContainerRef);
    };

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, Constants.statusBarHeight + 10],
    });

    const title = notification.title;
    const body = notification.body;
    const picture_uri = notification.data.picture_uri;

    return (
        <Animated.View style={[styles.wrapper, { top: translateY }]} {...panResponder.panHandlers}>
            <Pressable style={styles.innerWrapper} onPress={notificationPressHandler}>
                {picture_uri && <Image source={{ uri: picture_uri }} style={styles.profilePic} />}

                <View style={styles.textWrapper}>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>
                        {title}
                    </Text>
                    {body && (
                        <Text style={styles.body} numberOfLines={1} ellipsizeMode='tail'>
                            {body}
                        </Text>
                    )}
                </View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        // Dimensions
        height: 65,
        left: 15,
        right: 15,
        zIndex: 1000,
        position: 'absolute',

        // Box shadow
        elevation: 10, // Android only
        shadowColor: Colours.BLACK, // iOS only
        shadowOffset: { width: 0, height: 5 }, // iOS only
        shadowOpacity: 0.2, // iOS only
        shadowRadius: 10, // iOS only

        // Styling
        backgroundColor: Colours.WHITE,
        padding: 10,
        borderColor: Colours.GRAY_LIGHT,
        borderWidth: 1,
        borderRadius: Sizes.BORDER_RADIUS_MD,
    },
    innerWrapper: {
        // Dimensions
        flex: 1,

        // Layout
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 15,
    },
    profilePic: {
        // Dimensions
        width: 50,
        height: 50,

        // Styling
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        borderWidth: 1,
        borderColor: Colours.GRAY_LIGHT,
    },
    textWrapper: {
        // Dimensions
        flex: 1,

        // Layout
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: '500',
        color: Colours.DARK,
    },
    subtitle: {
        fontSize: Sizes.FONT_SIZE_SM,
        fontWeight: '400',
        color: Colours.DARK,
    },
    body: {
        fontSize: Sizes.FONT_SIZE_SM,
        fontWeight: '400',
        color: Colours.GRAY,
    },
});
