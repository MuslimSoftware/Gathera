import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { MoreActionsLayout } from './MoreActionsLayout';
import { Colours, Sizes } from '../../../../../shared/styles/Styles';
import { ActionButton } from './ActionButton';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';

export const BlockUserInfo = ({ navigation }: { navigation: any }) => {
    const bottomSheet = useBottomSheet();
    useFocusEffect(
        React.useCallback(() => {
            bottomSheet.snapToIndex(1);
        }, [bottomSheet])
    );

    return (
        <MoreActionsLayout
            title='Are you sure you want to block this user?'
            subtitle='All gathering invites, conversations and messages with this user will be permanently deleted. You can unblock them at any time.'
        >
            <Text style={styles.text}>The user will be unable to:</Text>
            <BulletPoint>Message you</BulletPoint>
            <BulletPoint>See your posts</BulletPoint>
            <BulletPoint>See your follows</BulletPoint>
            <BulletPoint>See your followers</BulletPoint>
            <BulletPoint>Follow you</BulletPoint>
            <BulletPoint>Invite you to their gatherings</BulletPoint>

            <ActionButton label='Continue to block' onPress={() => navigation.push('BlockUser')} showRightArrow />
        </MoreActionsLayout>
    );
};

const BulletPoint = ({ children }: { children: React.ReactNode }) => {
    return (
        <View style={styles.bulletPoint}>
            <View style={styles.bulletPointCircle} />
            <Text style={styles.bulletPointText}>{children}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    bulletPoint: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7.5,
    },
    bulletPointCircle: {
        width: 6,
        height: 6,
        borderRadius: 6,
        backgroundColor: Colours.DARK,
    },
    text: {
        fontSize: Sizes.FONT_SIZE_MD,
    },
    bulletPointText: {
        fontSize: Sizes.FONT_SIZE_SM,
    },
});
