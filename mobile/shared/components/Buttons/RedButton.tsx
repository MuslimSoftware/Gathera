import { StyleSheet } from 'react-native';
import React from 'react';
import { Button, CustomButtonProps } from './Button';
import { Colours } from '../../styles/Styles';

export const RedButton = (props: CustomButtonProps) => {
    const textStyle = props.textStyle ? { ...styles.text, ...props.textStyle } : styles.text;
    const containerStyle = props.containerStyle ? { ...styles.wrapper, ...props.containerStyle } : styles.wrapper;

    // Create new props object with the custom styles
    const newProps = { ...props, textStyle, containerStyle };

    return <Button {...newProps} />;
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colours.RED,
    },
    text: {
        color: Colours.LIGHT,
    },
});
