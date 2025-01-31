import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Sizes } from '../../../shared/styles/Styles';
import { SubscribeButton } from './SubscribeButton';

export const SubCTA = () => {
    return (
        <View style={styles.globalWrapper}>
            <Text style={styles.headerText}>Try Premium Now</Text>
            <Text style={styles.priceText}>USD$12.99/month • Cancel anytime</Text>
            <SubscribeButton />
        </View>
    );
};

const styles = StyleSheet.create({
    globalWrapper: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 10,
        gap: 20,
    },
    priceText: {
        fontSize: Sizes.FONT_SIZE_LG,
    },
    headerText: {
        fontSize: Sizes.FONT_SIZE_4XL,
        fontWeight: 'bold',
    },
});
