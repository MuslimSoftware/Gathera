import { StyleSheet, View } from 'react-native';
import React from 'react';
import { TextButton } from '../../../../../shared/components/Buttons/TextButton';
import { Colours } from '../../../../../shared/styles/Styles';
import { useFocusEffect } from '@react-navigation/native';
import { useBottomSheet } from '@gorhom/bottom-sheet';

interface ReportBlockButtonsProps {
    isBlocked: boolean;
    navigation: any;
}

export const ReportBlockButtons = ({ isBlocked, navigation }: ReportBlockButtonsProps) => {
    const bottomSheet = useBottomSheet();
    useFocusEffect(
        React.useCallback(() => {
            bottomSheet.snapToIndex(0);
        }, [])
    );

    const onReportPress = () => {
        navigation.push('ReportUser');
    };

    const onBlockPress = () => {
        navigation.push('BlockUserInfo');
    };

    const onUnblockPress = () => {
        navigation.push('UnblockUserInfo');
    };

    return (
        <>
            <View style={[styles.buttonWrapper, styles.topBorder]}>
                <TextButton label='Report' textStyle={{ color: Colours.RED }} onPress={onReportPress} containerStyle={styles.button} />
            </View>
            {isBlocked && (
                <View style={[styles.buttonWrapper, styles.topBorder, styles.bottomBorder]}>
                    <TextButton label='Unblock' onPress={onUnblockPress} containerStyle={styles.button} />
                </View>
            )}
            {!isBlocked && (
                <View style={[styles.buttonWrapper, styles.topBorder, styles.bottomBorder]}>
                    <TextButton label='Block' onPress={onBlockPress} containerStyle={styles.button} />
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    buttonWrapper: {
        paddingVertical: 10,
    },
    button: {
        width: '100%',
        justifyContent: 'flex-start',
    },
    topBorder: {
        borderTopColor: Colours.GRAY_LIGHT,
        borderTopWidth: 1,
    },
    bottomBorder: {
        borderBottomColor: Colours.GRAY_LIGHT,
        borderBottomWidth: 1,
    },
});
