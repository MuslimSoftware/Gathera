import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colours } from '../../../../shared/styles/Styles';

interface AuthButtonProps {
    label: string;
    onPress: () => void;
    backgroundColor: string;
    textColor: string;
}

export const AuthButton = ({ label, onPress, backgroundColor, textColor }: AuthButtonProps) => {
    return (
        <Pressable style={[styles.wrapper, { backgroundColor }]} onPress={onPress}>
            <Text style={[styles.text, { color: textColor }]}>{label}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        paddingVertical: 12.5,
        borderColor: Colours.WHITE,
        borderWidth: 2,
        borderRadius: 30,
    },
    text: {
        width: '100%',
        textAlign: 'center',
        fontWeight: '600',
    },
});
