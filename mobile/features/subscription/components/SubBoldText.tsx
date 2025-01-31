import { StyleSheet, Text } from 'react-native';
import React from 'react';
import { Colours } from '../../../shared/styles/Styles';

interface SubBoldTextProps {
    children: React.ReactNode;
}

export const SubBoldText = ({ children }: SubBoldTextProps) => {
    return <Text style={styles.boldText}>{children}</Text>;
};

const styles = StyleSheet.create({
    boldText: {
        fontWeight: 'bold',
        color: Colours.PREMIUM,
    },
});
