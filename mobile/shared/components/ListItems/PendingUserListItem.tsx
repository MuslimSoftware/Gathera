import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { ProfilePicture } from '../MainPictures/ProfilePicture';
import { Colours, Sizes } from '../../styles/Styles';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../Core/Card';
import { GrayButton } from '../Buttons/GrayButton';

interface PendingUserListItemProps {
    user?: any;
    acceptBtnHandler: () => void;
    rejectBtnHandler: () => void;
}

export const PendingUserListItem = ({ user, acceptBtnHandler, rejectBtnHandler }: PendingUserListItemProps) => {
    const navigation: any = useNavigation();

    const navigateToProfile = () => {
        navigation.push('OtherProfile', { profileId: user?._id });
    };

    return (
        <Card style={styles.globalWrapper} onPress={navigateToProfile}>
            <View style={styles.infoWrapper}>
                <ProfilePicture uri={user.avatar_uri} border={user.border} />
                <View style={styles.textColumn}>
                    <Text style={styles.displayName} numberOfLines={1}>
                        {user.display_name}
                    </Text>
                    <Text style={styles.followerCountText} numberOfLines={1}>
                        {user.follower_count} followers
                    </Text>
                    {/* <Text style={styles.statusText}>Requested </Text> */}
                </View>
            </View>

            <View style={styles.buttonRow}>
                <PrimaryButton onPress={acceptBtnHandler} label='Accept' />
                <GrayButton label='Ignore' onPress={rejectBtnHandler} />
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    globalWrapper: {
        paddingHorizontal: 5,
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    infoWrapper: {
        width: '50%',
        flexDirection: 'row',
        gap: 5,
    },
    textColumn: {
        maxWidth: '80%',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    button: {
        flex: 0,
        padding: 0,
        width: 'auto',
        borderRadius: Sizes.BORDER_RADIUS_MD,
    },
    displayName: {
        width: '95%',
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: '500',
    },
    followerCountText: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.GRAY,
    },
    statusText: {
        fontSize: Sizes.FONT_SIZE_MD,
        color: Colours.GRAY,
    },
});
