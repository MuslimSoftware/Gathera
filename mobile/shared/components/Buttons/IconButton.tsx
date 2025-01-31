import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Colours, Sizes } from '../../styles/Styles';

interface IconButtonProps {
    onPress?: () => void;
    icon?: any;
    style?: any;
}

export const IconButton = ({ onPress, icon, style }: IconButtonProps) => {
    return (
        <Pressable style={[styles.wrapper, style]} onPress={onPress} disabled={!onPress}>
            {icon && icon}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
        backgroundColor: Colours.GRAY_LIGHT,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
    },
});
