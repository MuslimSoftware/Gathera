import { StyleSheet, Text } from 'react-native';
import React from 'react';
import { Sizes } from '../../styles/Styles';

export const FormLabel = ({ label, labelHint }: { label: string; labelHint?: string }) => {
    return (
        <Text style={styles.inputLabel}>
            {label}
            {labelHint && <Text style={styles.hintLabel}> {labelHint}</Text>}
        </Text>
    );
};

const styles = StyleSheet.create({
    inputLabel: {
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: '600',
    },
    hintLabel: {
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: '400',
        color: 'gray',
    },
});
