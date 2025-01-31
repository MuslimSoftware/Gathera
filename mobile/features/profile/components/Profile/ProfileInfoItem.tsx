import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colours, Sizes } from '../../../../shared/styles/Styles';

interface ProfileInfoItemProps {
    icon?: any;
    label: string;
    isHighlighted?: boolean;
}

export const ProfileInfoItem = ({ icon, label, isHighlighted = false }: ProfileInfoItemProps) => {
    return (
        <View key={label} style={[styles.detail, isHighlighted && { backgroundColor: Colours.PRIMARY_LIGHT, borderColor: Colours.WHITE }]}>
            {icon && icon}
            <Text style={[styles.characteristicText, isHighlighted && { color: Colours.WHITE }]}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colours.GRAY_LIGHT,
        borderRadius: Sizes.BORDER_RADIUS_LG,
        paddingVertical: 5,
        paddingHorizontal: 7,
        gap: 5,
    },
    characteristicText: {
        fontSize: Sizes.FONT_SIZE_P,
        color: Colours.DARK,
    },
});
