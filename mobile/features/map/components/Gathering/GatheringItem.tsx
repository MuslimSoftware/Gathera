import { StyleSheet, Text, View, Pressable } from 'react-native';
import React, { useMemo } from 'react';
import { Sizes, Colours } from '../../../../shared/styles/Styles';
import { useNavigation } from '@react-navigation/native';
import { getTimeUntilEvent } from '../../../../shared/utils/TimeUntilEvent';
import { ProfilePicture } from '../../../../shared/components/MainPictures/ProfilePicture';
import { Gathering } from '../../../../types/Gathering';
import { LockIcon } from '../../../../shared/components/Core/Icons';
import { GatheringPicture } from '../../../../shared/components/MainPictures/GatheringPicture';
import { LoadingSkeleton } from '../../../../shared/components/Core/LoadingSkeleton';
import { sortArrayBySubscription } from '../../../../shared/utils/borderHelper';

// Stores the maximum number of profiles to be shown in the gathering item
// If the number of profiles exceeds this number, the rest will be hidden
const MAX_PROFILES_PREVIEW = 4;

interface GatheringItemProps {
    gathering: Gathering;
    hidePlaceName?: boolean;
}

export const GatheringItem = React.memo(
    ({ gathering, hidePlaceName = false }: GatheringItemProps) => {
        const navigation: any = useNavigation();
        const timeUntilEvent = getTimeUntilEvent(gathering.event_date).medium;

        const handleGatheringPress = () => navigation.push('Gathering', { gatheringId: gathering._id });

        // sort users by subscription status
        const sortedUsers = useMemo(() => sortArrayBySubscription(gathering.user_list), [gathering]).reverse();
        const profilesPreview = sortedUsers.slice(0, MAX_PROFILES_PREVIEW);

        const userCount = gathering.user_list.length;
        const maxCount = gathering.max_count;
        const numDummyProfiles = Math.max(0, maxCount - userCount);
        const dummyProfiles: any = [];
        while (dummyProfiles.length < numDummyProfiles && dummyProfiles.length + profilesPreview.length < MAX_PROFILES_PREVIEW) {
            dummyProfiles.push(`dummy_${dummyProfiles.length}`);
        }

        const imageSize = 'small';
        const hasMoreUsersThanPreview = userCount > MAX_PROFILES_PREVIEW;
        return (
            <Pressable style={styles.globalWrapper} onPress={handleGatheringPress}>
                <GatheringPicture uri={gathering.gathering_pic} icon={gathering.is_private && <LockIcon size={Sizes.ICON_SIZE_XS} />} />
                <View style={styles.textWrapper}>
                    <Text style={styles.gatheringName} numberOfLines={1}>
                        {gathering.gathering_name}
                    </Text>
                    {!hidePlaceName && (
                        <Text style={styles.placeName} numberOfLines={2}>
                            {gathering.place.name}
                        </Text>
                    )}
                    <Text style={{ fontSize: Sizes.FONT_SIZE_SM, color: Colours.GRAY }}>{timeUntilEvent}</Text>
                </View>
                <View style={styles.userPreviews}>
                    {dummyProfiles.map((dummy: any) => (
                        <ProfilePicture key={dummy} size={imageSize} isDummy />
                    ))}
                    {profilesPreview.map((profile) => (
                        <ProfilePicture key={profile._id} uri={profile.avatar_uri} size={imageSize} border={profile.border} />
                    ))}
                    {hasMoreUsersThanPreview && <Text style={styles.hasMoreUsersText}>+{gathering.user_list.length - MAX_PROFILES_PREVIEW}</Text>}
                </View>
            </Pressable>
        );
    },
    (prevProps, nextProps) => prevProps.gathering._id === nextProps.gathering._id
);

export const GatheringItemSkeleton = () => {
    return (
        <View style={styles.skeletonGlobalWrapper}>
            <View style={styles.skeletonLeftContent}>
                <LoadingSkeleton style={styles.skeletonImage} />
                <View style={styles.skeletonTextWrapper}>
                    <LoadingSkeleton style={styles.skeletonTextRow} />
                    <LoadingSkeleton style={styles.skeletonTextRow} />
                    <LoadingSkeleton style={styles.skeletonTextRow} />
                </View>
            </View>

            <View style={styles.skeletonImageRow}>
                <LoadingSkeleton style={styles.skeletonProfileImage} />
                <LoadingSkeleton style={styles.skeletonProfileImage} />
                <LoadingSkeleton style={styles.skeletonProfileImage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    globalWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        paddingHorizontal: 5,
    },
    textWrapper: {
        width: '40%',
    },
    gatheringName: {
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: 'bold',
        maxWidth: '99%',
    },
    placeName: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.TERTIARY,
        fontWeight: 'bold',
        maxWidth: '90%',
    },
    userPreviews: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: -25,
    },

    skeletonGlobalWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        alignSelf: 'flex-start',
        gap: 10,
        paddingHorizontal: 10,
    },
    skeletonLeftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
        gap: 10,
    },
    skeletonImage: {
        width: 60,
        height: 60,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
    },
    skeletonTextWrapper: {
        width: '50%',
        height: 50,
        justifyContent: 'space-evenly',
    },
    skeletonTextRow: {
        width: '100%',
        height: 10,
        justifyContent: 'center',
        borderRadius: Sizes.BORDER_RADIUS_FULL,
    },

    skeletonImageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: -15,
    },
    skeletonProfileImage: {
        width: 50,
        height: 50,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
    },
    hasMoreUsersText: {
        position: 'absolute',
        left: -5,
        backgroundColor: Colours.WHITE,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        padding: 2,
        fontSize: 14,
        color: Colours.GRAY,
    },
});
