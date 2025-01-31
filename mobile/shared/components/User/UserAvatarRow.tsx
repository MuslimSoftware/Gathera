import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import { ProfilePicture } from '../MainPictures/ProfilePicture';
import { ProfilePictureSize } from '../../../types/User';
import { SubscriptionType, UserBorder } from '../../../gathera-lib/enums/user';
import { sortArrayBySubscription } from '../../utils/borderHelper';

type Avatar = { uri: string; subscription: SubscriptionType; border: UserBorder };
interface UserAvatarRowProps {
    avatars: Avatar[];
    avatarSize?: ProfilePictureSize;
}

export const UserAvatarRow = React.memo(({ avatars, avatarSize = 'xsmall' }: UserAvatarRowProps) => {
    // sort avatars by subscription status
    const sortedAvatars = useMemo(() => {
        const sortedAvatars = sortArrayBySubscription(avatars);
        return sortedAvatars.reverse();
    }, [avatars]);

    return (
        <View style={styles.globalWrapper}>
            {sortedAvatars.map((avatar: Avatar, index: number) => {
                return <ProfilePicture key={index.toString()} uri={avatar.uri} size={avatarSize} border={avatar.border} />;
            })}
        </View>
    );
});

const styles = StyleSheet.create({
    globalWrapper: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: -25,
    },
});
