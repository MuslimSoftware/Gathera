import { StyleSheet } from 'react-native';
import React from 'react';
import { Button, CustomButtonProps } from './Button';

export const TextButton = (props: CustomButtonProps) => {
    const containerStyle = props.containerStyle ? { ...styles.wrapper, ...props.containerStyle } : styles.wrapper;

    // Create new props object with the custom styles
    const newProps = { ...props, containerStyle };

    return <Button {...newProps} />;
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'transparent',
    },
});
