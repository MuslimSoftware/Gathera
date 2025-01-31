import { StyleSheet } from 'react-native';
import React from 'react';
import { Colours } from '../../../shared/styles/Styles';
import { ValidatedTextInput, ValidatedTextInputProps } from '../../../shared/components/Inputs/ValidatedTextInput';

export const AuthTextInput = ({ ...props }: ValidatedTextInputProps) => {
    return <ValidatedTextInput {...props} style={styles.input} placeholderTextColor='#aaa' />;
};

const styles = StyleSheet.create({
    input: {
        width: '100%',
        borderWidth: 2,
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 18,
        backgroundColor: Colours.WHITE,
        borderColor: Colours.WHITE,
    },
});
