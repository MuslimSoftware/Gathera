import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { Colours, Sizes } from '../../../shared/styles/Styles';

interface CardProps {
    children?: React.ReactNode;
    onPress?: () => void;
    style?: Object;
    hasPadding?: boolean;
}

export const Card = ({ onPress, children, style, hasPadding = true }: CardProps) => {
    const paddingStyle = hasPadding ? {} : {};
    return (
        <>
            {onPress && (
                <Pressable
                    style={({ pressed }) => (pressed ? [styles.wrapper, styles.pressed, paddingStyle, style] : [styles.wrapper, paddingStyle, style])}
                    onPress={onPress}
                >
                    {children}
                </Pressable>
            )}

            {!onPress && <View style={[styles.wrapper, style]}>{children}</View>}
        </>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 7,
        backgroundColor: Colours.LIGHT,
        borderRadius: Sizes.BORDER_RADIUS_LG,
        overflow: 'hidden',
        position: 'relative',
    },
    pressed: {
        opacity: 0.5,
    },
});
