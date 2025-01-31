import { StyleSheet, View } from 'react-native';
import React from 'react';

export const FormRow = ({ children }: { children: React.ReactNode }) => {
    return <View style={styles.wrapper}>{children}</View>;
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        alignItems: 'flex-start',
        gap: 5
    }
});
