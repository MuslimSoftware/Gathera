import React from 'react';
import { TextInputProps } from 'react-native';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { Sizes } from '../../styles/Styles';
import { AuthErrorMessage } from '../AuthErrorMessage';

export interface ValidatedTextInputProps extends TextInputProps {
    value: string;
    hasError?: boolean;
    onChangeText: (text: string) => void;
    placeholder: string;
    errorMessage: string;
    style?: any;
    containerStyle?: any;
    ref?: any;
}

export const ValidatedTextInput = ({
    value,
    onChangeText,
    hasError = false,
    placeholder,
    errorMessage,
    style,
    containerStyle,
    ...props
}: ValidatedTextInputProps) => {
    const handleInputChange = (text: string) => {
        onChangeText(text);
    };

    return (
        <View style={[styles.container, containerStyle && containerStyle, hasError && styles.errorContainer]}>
            <TextInput
                value={value}
                onChangeText={handleInputChange}
                placeholder={placeholder}
                style={[style, hasError && styles.errorInput]}
                {...props}
            />
            {hasError && <AuthErrorMessage message={errorMessage} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    errorContainer: {
        borderColor: 'red',
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        width: '100%',
        textAlign: 'center',
        fontWeight: '500',
        color: 'red',
        marginTop: 5,
        fontSize: Sizes.FONT_SIZE_SM,
    },
});
