import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colours, Sizes } from '../styles/Styles';

interface PriceLevelProps {
    priceLevel: number;
}

export const PriceLevel = ({ priceLevel }: PriceLevelProps) => {
    // display price level as dollar signs
    // e.g. price level of 2, since its 2/4 will display $$ and then 2 empty dollar signs
    return (
        <View style={styles.priceLevel}>
            {Array.from({ length: priceLevel }, (_, i) => (
                <Text key={i} style={styles.activeDollarSign}>
                    $
                </Text>
            ))}
            {Array.from({ length: 4 - priceLevel }, (_, i) => (
                <Text key={i} style={styles.inactiveDollarSign}>
                    $
                </Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    priceLevel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeDollarSign: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.DARK,
    },
    inactiveDollarSign: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.GRAY,
    },
});
