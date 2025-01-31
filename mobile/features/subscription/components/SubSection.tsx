import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Sizes, Colours } from '../../../shared/styles/Styles';

interface SubSectionProps {
    headerText: string;
    subHeaderText: string | React.ReactNode;
    children: React.ReactNode;
}

export const SubSection = ({ children, headerText, subHeaderText }: SubSectionProps) => {
    return (
        <View style={styles.globalWrapper}>
            <View style={styles.textWrapper}>
                <Text style={styles.headerText}>{headerText}</Text>
                <Text style={styles.subHeaderText}>{subHeaderText}</Text>
            </View>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    globalWrapper: {
        width: '100%',
        gap: 20,
        alignItems: 'center',
    },
    textWrapper: {
        width: '100%',
        gap: 5,
    },
    headerText: {
        fontSize: Sizes.FONT_SIZE_2XL,
        fontWeight: '600',
    },
    subHeaderText: {
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: '400',
        color: Colours.DARK,
    },
    boldText: {
        fontWeight: 'bold',
        color: Colours.PREMIUM,
    },
});
