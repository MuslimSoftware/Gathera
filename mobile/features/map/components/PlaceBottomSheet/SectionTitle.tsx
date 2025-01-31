import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Sizes, Colours } from '../../../../shared/styles/Styles';

interface SectionTitleProps {
    icon?: any;
    title: string;
    expand?: boolean;
    thin?: boolean;
}

export const SectionTitle = ({ icon, title, expand = true, thin = false }: SectionTitleProps) => {
    return (
        <View style={styles.headerWrapper}>
            {icon && icon}
            <Text
                style={[
                    styles.title,
                    expand && { width: '100%' },
                    thin && {
                        fontWeight: '400',
                        fontSize: Sizes.FONT_SIZE_LG,
                    },
                ]}
            >
                {title}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    title: {
        fontSize: Sizes.FONT_SIZE_H2,
        color: Colours.DARK,
        fontWeight: '600',
        textAlign: 'left',
    },
});
