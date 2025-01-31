import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { ProfileActionButtons } from './ProfileActionButtons';
import { Colours, Sizes } from '../../../../shared/styles/Styles';
import { ProfilePicture, PROFILE_PIC_SIZES } from '../../../../shared/components/MainPictures/ProfilePicture';
import { LoadingSkeleton } from '../../../../shared/components/Core/LoadingSkeleton';
import { useNavigate } from '../../../../shared/hooks/useNavigate';

interface InfoProps {
    profile: any;
    loading?: boolean;
    setProfile: any;
    setShowEditSheet?: any;
    isVisible: boolean;
}

export const ProfileInfo: React.FC<InfoProps> = ({ profile, loading, setProfile, setShowEditSheet, isVisible }) => {
    const { pushScreen } = useNavigate();

    const displayedImageUri = profile.avatar_uri?.includes('/images/default_pp.png')
        ? `${process.env.EXPO_PUBLIC_API_HOSTNAME}${profile.avatar_uri}`
        : profile.avatar_uri;

    const handleGatheringsPress = () => {
        isVisible && pushScreen('ProfileInfoDetails', { profileId: profile._id, title: profile.display_name, screen: 'Gatherings' });
    };

    const handleFollowersPress = () => {
        isVisible &&
            pushScreen('ProfileInfoDetails', {
                profileId: profile._id,
                title: profile.display_name,
                screen: 'Followers',
            });
    };

    const handleFollowingPress = () => {
        isVisible &&
            pushScreen('ProfileInfoDetails', {
                profileId: profile._id,
                title: profile.display_name,
                screen: 'Following',
            });
    };

    return (
        <View style={styles.wrapper}>
            <ProfilePicture size='large' uri={displayedImageUri} enableImageModal border={profile.border} />
            <View style={styles.profileStatsContainer}>
                <View style={styles.profileStats}>
                    <Pressable style={styles.profileStat} onPress={handleGatheringsPress}>
                        <Text style={styles.statText}>{profile.gathering_count}</Text>
                        <Text style={styles.statLabel}>Gatherings</Text>
                    </Pressable>
                    <Pressable style={styles.profileStat} onPress={handleFollowersPress}>
                        <Text style={styles.statText}>{profile.follower_count}</Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </Pressable>
                    <Pressable style={styles.profileStat} onPress={handleFollowingPress}>
                        <Text style={styles.statText}>{profile.following_count}</Text>
                        <Text style={styles.statLabel}>Following</Text>
                    </Pressable>
                </View>
                <ProfileActionButtons profile={profile} setProfile={setProfile} setShowEditSheet={setShowEditSheet} />
            </View>
        </View>
    );
};

export const ProfileInfoSkeleton = ({ hasError }: { hasError?: boolean }) => {
    return (
        <View style={[styles.wrapper, { marginBottom: 2 }]}>
            <LoadingSkeleton hasError={hasError} style={{ ...PROFILE_PIC_SIZES.large, borderRadius: Sizes.BORDER_RADIUS_FULL }} />
            <View style={styles.profileStatsContainer}>
                <View style={[styles.profileStats, { gap: 30 }]}>
                    <View style={styles.profileStat}>
                        <LoadingSkeleton hasError={hasError} style={{ height: 40, width: 40 }} />
                    </View>
                    <View style={styles.profileStat}>
                        <LoadingSkeleton hasError={hasError} style={{ height: 40, width: 40 }} />
                    </View>
                    <View style={styles.profileStat}>
                        <LoadingSkeleton hasError={hasError} style={{ height: 40, width: 40 }} />
                    </View>
                </View>
                <View style={styles.profileActionButtons}>
                    <LoadingSkeleton hasError={hasError} style={{ width: 220, height: 30, borderRadius: Sizes.BORDER_RADIUS_MD }} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileStatsContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    profileStats: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    profileStat: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statText: {
        fontSize: 18,
        color: Colours.DARK,
        fontWeight: '700',
    },
    loadingStatText: {
        width: 10,
        height: 20,
    },
    statLabel: {
        fontSize: 13,
        fontWeight: '400',
        color: Colours.DARK,
    },
    profileActionButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    profileActionButton: {
        width: '45%',
        height: 30,
        borderRadius: Sizes.BORDER_RADIUS_LG,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colours.PRIMARY_TRANSPARENT_50,
    },
    profileActionButtonText: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.PRIMARY,
        fontWeight: 'bold',
    },
});
