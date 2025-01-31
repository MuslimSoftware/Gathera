import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Sizes, Colours } from '../../../../shared/styles/Styles';

export const DetailItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => {
    return (
        <View style={styles.miscItem}>
            {icon}
            <Text style={styles.miscLabel}> {label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    miscItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        padding: 7,
        backgroundColor: Colours.WHITE,
        borderRadius: Sizes.BORDER_RADIUS_MD,
    },
    miscLabel: {
        color: Colours.DARK,
        fontSize: Sizes.FONT_SIZE_SM,
    },
});
