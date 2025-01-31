import { Keyboard, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Colours, Sizes } from '../../../../../shared/styles/Styles';
import BackBtn from '../../../../../shared/components/Buttons/BackBtn';
import { useBottomSheet } from '@gorhom/bottom-sheet';

interface MoreActionsLayoutProps {
    title: string;
    titleIcon?: React.ReactNode;
    subtitle?: string;
    children?: React.ReactNode;
    submit?: React.ReactNode;
}

export const MoreActionsLayout = ({ title, titleIcon, subtitle, children, submit }: MoreActionsLayoutProps) => {
    const bottomSheet = useBottomSheet();

    useEffect(() => {
        Keyboard.addListener('keyboardWillShow', (e: any) => bottomSheet.snapToIndex(2));
        Keyboard.addListener('keyboardWillHide', (e: any) => bottomSheet.snapToIndex(1));

        // Clean up listeners when component unmounts
        return () => {
            Keyboard.removeAllListeners('keyboardWillShow');
            Keyboard.removeAllListeners('keyboardWillHide');
        };
    });

    return (
        <View style={styles.wrapper}>
            <View style={styles.headerRow}>
                <BackBtn positionRelative />
            </View>
            <View style={styles.titleRow}>
                <View style={styles.titleWrapper}>
                    {titleIcon && titleIcon}
                    <Text style={styles.title}>{title}</Text>
                </View>
                {submit && submit}
            </View>
            {subtitle && <Text style={styles.subTitle}>{subtitle}</Text>}
            {children && children}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        height: 420,
        gap: 10,
        paddingHorizontal: 20,
    },
    headerRow: {
        position: 'relative',
        flexDirection: 'row',
        marginLeft: -10,
    },
    titleRow: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    title: {
        fontSize: Sizes.FONT_SIZE_LG,
        fontWeight: 'bold',
        color: Colours.DARK,
    },
    subTitle: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.GRAY,
    },
});
