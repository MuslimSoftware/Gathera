import React from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import { ProfilePicture, PROFILE_PIC_SIZES } from '../MainPictures/ProfilePicture';
import { getAuthContextValues } from '../../context/AuthContext';
import { Sizes, Colours } from '../../styles/Styles';
import { ProfilePictureSize, UserPreview } from '../../../types/User';
import { useNavigation } from '@react-navigation/native';
import { LoadingSkeleton } from '../Core/LoadingSkeleton';

interface UserListItemProps {
    profile: UserPreview;
    textComponent?: React.ReactNode;
    children?: React.ReactNode;
    leftChildren?: React.ReactNode;
    profilePicSize?: ProfilePictureSize;
    onPress?: () => void;
    disableNavigation?: boolean;
}

export const UserListItem = ({
    profile,
    textComponent,
    children,
    leftChildren,
    profilePicSize,
    onPress,
    disableNavigation = false,
}: UserListItemProps) => {
    const navigation: any = useNavigation();
    const {
        user: { _id: userId },
    } = getAuthContextValues();
    const isSelfProfile = userId === profile._id;

    const navigateToProfile = () => {
        onPress && onPress();
        !disableNavigation && navigation.push('OtherProfile', { profileId: profile._id });
    };

    const text = textComponent ? (
        textComponent
    ) : (
        <Text style={styles.profileText} numberOfLines={1}>
            {profile.display_name}
        </Text>
    );

    return (
        <Pressable onPress={navigateToProfile} style={styles.profileCard} key={profile._id} android_disableSound>
            {leftChildren && leftChildren}
            <ProfilePicture uri={profile.avatar_uri} size={profilePicSize ? profilePicSize : 'medium'} border={profile.border} />
            <View style={styles.textComponentWrapper}>{text}</View>
            {!isSelfProfile && <View style={styles.followButtonWrapper}>{children}</View>}
            {isSelfProfile && <View style={styles.followButtonWrapper} />}
        </Pressable>
    );
};

export const UserListItemSkeleton = ({ profilePicSize = 'medium' }: { profilePicSize?: ProfilePictureSize }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <LoadingSkeleton style={{ ...PROFILE_PIC_SIZES[profilePicSize], borderRadius: Sizes.BORDER_RADIUS_FULL, marginVertical: 5 }} />
            <LoadingSkeleton style={{ height: 15, width: '50%' }} />
        </View>
    );
};

const styles = StyleSheet.create({
    profileCard: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    textComponentWrapper: {
        maxWidth: '60%',
    },
    followButtonWrapper: {
        marginLeft: 'auto',
    },
    profileText: {
        color: Colours.DARK,
        fontSize: Sizes.FONT_SIZE_SM,
    },
});
