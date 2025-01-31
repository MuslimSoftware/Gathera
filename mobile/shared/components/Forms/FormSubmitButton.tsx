import { Pressable, StyleSheet, Text } from 'react-native';
import React from 'react';
import { Colours } from '../../styles/Styles';

interface FormSubmitButtonProps {
    text?: string;
    children?: React.ReactNode;
    onSubmit: () => void;
}

const FormSubmitButton = ({ text, children, onSubmit }: FormSubmitButtonProps) => {
    return (
        <Pressable style={styles.btnWrapper} onPress={onSubmit}>
            {text && <Text style={styles.btnText}>{text}</Text>}
            {children}
        </Pressable>
    );
};

export default FormSubmitButton;

const styles = StyleSheet.create({
    btnWrapper: {
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 5,
    },
    btnText: {
        fontSize: 17,
        color: Colours.PRIMARY,
    },
});
