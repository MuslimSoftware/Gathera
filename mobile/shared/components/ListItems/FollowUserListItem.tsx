import React from 'react';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { UserListItem, UserListItemSkeleton } from './UserListItem';
import { GrayButton } from '../Buttons/GrayButton';
import { useFollowUser } from '../../hooks/useFollowUser';
import { ProfilePictureSize, UserPreview } from '../../../types/User';
import { View, StyleSheet } from 'react-native';
import { LoadingSkeleton } from '../Core/LoadingSkeleton';
import { BUTTON_DEFAULT_MIN_WIDTH } from '../Buttons/Button';
import { Loading } from '../Core/Loading';
import { FollowingStatus } from '../../utils/userHelper';
import { useToastError } from '../../hooks/useToastError';

interface FollowUserListItemProps {
    profile: UserPreview;
    textComponent?: React.ReactNode;
    profilePicSize?: ProfilePictureSize;
    leftChildren?: React.ReactNode;
}

const areEqual = (prevProps: FollowUserListItemProps, nextProps: FollowUserListItemProps) => {
    return (
        prevProps.profile._id === nextProps.profile._id &&
        prevProps.profile.display_name === nextProps.profile.display_name &&
        prevProps.profile.avatar_uri === nextProps.profile.avatar_uri &&
        prevProps.profile.isFollowing === nextProps.profile.isFollowing &&
        prevProps.profile.subscription === nextProps.profile.subscription &&
        prevProps.profile.border === nextProps.profile.border &&
        prevProps.profile.isRequested === nextProps.profile.isRequested &&
        prevProps.textComponent === nextProps.textComponent &&
        prevProps.profilePicSize === nextProps.profilePicSize &&
        prevProps.leftChildren === nextProps.leftChildren
    );
};

export const FollowUserListItem = React.memo(({ profile, textComponent, profilePicSize, leftChildren }: FollowUserListItemProps) => {
    const { error, isLoading, followUser, unfollowUser, cancelFollowRequest, followingStatus } = useFollowUser(profile);

    useToastError(error);

    return (
        <UserListItem profile={profile} textComponent={textComponent} profilePicSize={profilePicSize} leftChildren={leftChildren}>
            {isLoading && (
                <GrayButton label='' containerStyle={styles.button}>
                    <Loading size={18} />
                </GrayButton>
            )}
            {followingStatus === FollowingStatus.REQUESTED && !isLoading && (
                <GrayButton onPress={cancelFollowRequest} label='Requested' containerStyle={styles.button} />
            )}
            {followingStatus === FollowingStatus.FOLLOWING && !isLoading && (
                <GrayButton label='Unfollow' onPress={unfollowUser} containerStyle={styles.button} />
            )}
            {followingStatus === FollowingStatus.NOT_FOLLOWING && !isLoading && (
                <PrimaryButton label='Follow' onPress={followUser} containerStyle={styles.button} />
            )}
        </UserListItem>
    );
}, areEqual);

export const FollowUserListItemSkeleton = ({ profilePicSize }: { profilePicSize?: ProfilePictureSize }) => {
    return (
        <View style={styles.skeletonWrapper}>
            <UserListItemSkeleton profilePicSize={profilePicSize} />
            <LoadingSkeleton style={styles.skeletonButton} />
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        minWidth: BUTTON_DEFAULT_MIN_WIDTH,
    },
    skeletonButton: {
        width: 80,
        height: 30,
    },
    skeletonWrapper: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' },
});
