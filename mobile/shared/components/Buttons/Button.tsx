import React from 'react';
import { GestureResponderEvent, Pressable, PressableProps, StyleSheet, Text, TextProps, TextStyle, ViewStyle } from 'react-native';
import { Colours, Sizes } from '../../styles/Styles';
import * as Haptics from 'expo-haptics';

export const BUTTON_DEFAULT_MIN_WIDTH = 80;

export interface CustomButtonProps extends PressableProps {
    label: string; // The text to display inside the button
    vibrateOnPress?: boolean; // Whether to vibrate the device when the button is pressed
    isLoading?: boolean; // Whether to show a loading indicator & disable the button
    containerStyle?: ViewStyle; // The style of the button container (Pressable)
    textStyle?: TextStyle; // The style of the button text (Text)
    textProps?: TextProps; // The props of the button text (Text)

    children?: React.ReactNode; // Elements to render within the button (e.g., icons). Hint: use absolute positioning to place them.
}

export const Button = ({
    label,
    vibrateOnPress,
    isLoading,
    containerStyle,
    textStyle,
    textProps,
    children,
    ...pressableProps
}: CustomButtonProps) => {
    const handlePress = (event: GestureResponderEvent) => {
        if (isLoading === true) return;
        vibrateOnPress && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        pressableProps.onPress && pressableProps.onPress(event);
    };

    const containerStyleObj = containerStyle ? { ...styles.wrapper, ...containerStyle } : styles.wrapper;
    const textStyleObj = textStyle ? { ...styles.text, ...textStyle } : styles.text;

    // Create new props object with the custom styles
    const buttonProps = {
        ...pressableProps,
        onPress: handlePress,
        style: [containerStyleObj, isLoading && styles.loading],
        android_disableSound: true,
    };

    return (
        <Pressable {...buttonProps}>
            {label && label !== '' && (
                <Text style={textStyleObj} {...textProps}>
                    {label}
                </Text>
            )}
            {children && children}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: Sizes.BORDER_RADIUS_MD,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12.5,
        paddingVertical: 7.5,
        flexDirection: 'row',
    },
    loading: {
        opacity: 0.5,
    },
    text: {
        color: Colours.DARK,
        fontWeight: '500',
    },
});
