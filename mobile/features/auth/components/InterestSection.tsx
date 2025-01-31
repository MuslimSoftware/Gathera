import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Sizes, Colours } from '../../../shared/styles/Styles';

interface InterestSectionProps {
    title: string;
    headerColor?: string;
    children?: React.ReactNode;
}

const InterestSection = ({ title, children, headerColor = Colours.WHITE }: InterestSectionProps) => {
    return (
        <View style={styles.section}>
            <Text style={[styles.header, { color: headerColor }]}>{title}</Text>
            <View style={styles.interests}>{children}</View>
        </View>
    );
};

export default InterestSection;

const styles = StyleSheet.create({
    section: {
        width: '100%',

        gap: 10,
    },
    header: {
        fontSize: Sizes.FONT_SIZE_2XL,
        fontWeight: '600',
    },
    interests: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 10,
        columnGap: 5,
        justifyContent: 'flex-start',
    },
});
