import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colours, Sizes } from '../../styles/Styles';

interface DetailPageItemProps {
    name: string;
    children: React.ReactNode;
}

export const DetailPageItem = ({ name, children }: DetailPageItemProps) => {
    return (
        <View style={styles.detailItemWrapper}>
            <View style={styles.textWrapper}>
                <Text style={styles.labelText} numberOfLines={1}>
                    {name}
                </Text>
                {children}
            </View>
            <View style={styles.separator} />
        </View>
    );
};

const styles = StyleSheet.create({
    detailItemWrapper: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: 15,
    },

    textWrapper: {
        width: '100%',
        paddingVertical: 10,
        alignItems: 'flex-start',
        gap: 5,
    },
    labelText: {
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: '500',
        color: Colours.GRAY,
    },

    separator: {
        width: '100%',
        height: 1,
        backgroundColor: Colours.GRAY_LIGHT,
    },
});
