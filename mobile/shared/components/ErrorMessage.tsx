import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colours, Sizes } from '../styles/Styles';

export interface ErrorMessageProps {
    message: string | null | undefined;
    containerStyle?: any;
    textStyle?: any;
}

export const ErrorMessage = ({ message, containerStyle, textStyle }: ErrorMessageProps) => {
    if (!message) {
        return null;
    }

    return (
        <View style={[styles.globalWrapper, containerStyle]}>
            <Text style={[styles.messageText, textStyle]}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    globalWrapper: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginHorizontal: 10,
        backgroundColor: Colours.GRAY_LIGHT,
        borderRadius: Sizes.BORDER_RADIUS_MD,
        alignItems: 'center',
        justifyContent: 'center',
    },
    messageText: {
        fontSize: Sizes.FONT_SIZE_MD,
        color: Colours.DARK,
    },
});
