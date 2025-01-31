import { Platform, StyleSheet } from 'react-native';
import React from 'react';
import { BlurView } from 'expo-blur';

interface Props {
    onPress?: () => void;
    style?: any;
}

export const Backdrop = ({ onPress, style }: Props) => {
    return (
        <BlurView
            intensity={Platform.OS === 'android' ? 15 : 20}
            style={[StyleSheet.absoluteFillObject, style]}
            onTouchStart={onPress}
            experimentalBlurMethod='dimezisBlurView'
            tint='light'
        />
    );
};
