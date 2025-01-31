import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MoreActionsLayout } from './MoreActionsLayout';
import { Sizes } from '../../../../../shared/styles/Styles';
import { ActionButton } from './ActionButton';
import { useFocusEffect } from '@react-navigation/native';
import { useBottomSheet } from '@gorhom/bottom-sheet';

export const UnblockUserInfo = ({ navigation }: { navigation: any }) => {
    const bottomSheet = useBottomSheet();
    useFocusEffect(
        React.useCallback(() => {
            bottomSheet.snapToIndex(1);
        }, [bottomSheet])
    );

    return (
        <MoreActionsLayout title='Are you sure you want to unblock this user?' subtitle='You can block them at any time.'>
            <Text style={styles.text}>The user will be able to:</Text>
            <BulletPoint>Message you</BulletPoint>
            <BulletPoint>See your posts</BulletPoint>
            <BulletPoint>See your follows</BulletPoint>
            <BulletPoint>See your followers</BulletPoint>
            <BulletPoint>Follow you</BulletPoint>
            <BulletPoint>Invite you to their gatherings</BulletPoint>

            <ActionButton label='Continue to unblock' onPress={() => navigation.push('UnblockUser')} showRightArrow />
        </MoreActionsLayout>
    );
};

const BulletPoint = ({ children }: { children: React.ReactNode }) => {
    return (
        <View style={styles.bulletPoint}>
            <View style={styles.bulletPointCircle} />
            <Text style={styles.text}>{children}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    bulletPoint: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    bulletPointCircle: {
        width: 7.5,
        height: 7.5,
        borderRadius: 7.5,
        backgroundColor: 'black',
    },
    text: {
        fontSize: Sizes.FONT_SIZE_MD,
    },
});
