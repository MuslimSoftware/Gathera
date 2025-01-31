import { StyleSheet } from 'react-native';
import React from 'react';
import { ErrorMessage, ErrorMessageProps } from './ErrorMessage';
import { Colours } from '../styles/Styles';

interface AuthErrorMessageProps extends ErrorMessageProps {}

export const AuthErrorMessage = ({ ...props }: AuthErrorMessageProps) => {
    return <ErrorMessage message={props.message} containerStyle={styles.wrapper} textStyle={styles.text} />;
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colours.RED_LIGHT,
    },
    text: {
        color: Colours.RED,
    },
});
