import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Gathering } from '../../../../types/Gathering';
import { Colours, Sizes } from '../../../../shared/styles/Styles';
import { getTimeUntilEvent } from '../../../../shared/utils/TimeUntilEvent';
import { CalendarIcon, ClockIconO, InviteUserIcon, LockIcon } from '../../../../shared/components/Core/Icons';
import { DetailItem } from './DetailItem';
import { GrayButton } from '../../../../shared/components/Buttons/GrayButton';
import { LoadingSkeleton } from '../../../../shared/components/Core/LoadingSkeleton';
import { PlaceItemSkeleton } from '../../../../shared/components/PlaceItem';
import { GatheringPicture } from '../../../../shared/components/MainPictures/GatheringPicture';

interface GatheringDetailsProps {
    gathering: Gathering;
    navigateToChatRoomFromGathering: () => void;
    setShowInviteSheet: (show: boolean) => void;
    isUserAttending: boolean;
}

export const GatheringDetails = ({ gathering, navigateToChatRoomFromGathering, setShowInviteSheet, isUserAttending }: GatheringDetailsProps) => {
    const isGatheringFull = gathering.user_list.length >= gathering.max_count;

    return (
        <View style={styles.globalWrapper}>
            <View style={styles.infoWrapper}>
                <View style={styles.gatheringPicture}>
                    <GatheringPicture
                        uri={gathering.gathering_pic}
                        size='large'
                        icon={gathering.is_private && <LockIcon size={Sizes.ICON_SIZE_XS} />}
                    />
                </View>
                <View style={styles.detailsWrapper}>
                    <Text style={styles.gatheringName}>{gathering.gathering_name}</Text>
                    <View style={styles.gatheringDescriptionWrapper}>
                        <Text style={styles.gatheringDescription}>
                            {gathering.gathering_description.length > 0 ? gathering.gathering_description : 'No description provided.'}
                        </Text>
                    </View>
                    {isUserAttending && (
                        <View style={styles.messageBtnWrapper}>
                            <GrayButton label='Message' onPress={navigateToChatRoomFromGathering} containerStyle={{ flex: 1 }} />
                            {!isGatheringFull && (
                                <Pressable style={styles.shareBtn} onPress={() => setShowInviteSheet(true)}>
                                    <InviteUserIcon />
                                </Pressable>
                            )}
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.miscSection}>
                <DetailItem
                    icon={<CalendarIcon size={Sizes.ICON_SIZE_SM} color={Colours.DARK} />}
                    label={getTimeUntilEvent(gathering.event_date).full_split.date}
                />
                <DetailItem
                    icon={<ClockIconO size={Sizes.ICON_SIZE_SM} color={Colours.DARK} />}
                    label={getTimeUntilEvent(gathering.event_date).full_split.time}
                />
            </View>
        </View>
    );
};

export const GatheringDetailsSkeleton = () => {
    return (
        <View
            style={{
                width: '100%',
                paddingHorizontal: '4%',
                gap: 15,
            }}
        >
            <View style={[styles.infoWrapper, { alignItems: 'center', justifyContent: 'center' }]}>
                <LoadingSkeleton style={{ width: 90, height: 90, borderRadius: Sizes.BORDER_RADIUS_FULL }} />
                <View style={{ width: '70%', gap: 5, flexDirection: 'column', alignItems: 'center' }}>
                    <LoadingSkeleton style={{ width: '100%', height: 20, borderRadius: Sizes.BORDER_RADIUS_MD }} />
                    <LoadingSkeleton style={{ width: '100%', height: 20, borderRadius: Sizes.BORDER_RADIUS_MD }} />
                </View>
            </View>
            <LoadingSkeleton style={{ width: '100%', height: 30, borderRadius: Sizes.BORDER_RADIUS_MD }} />
            <PlaceItemSkeleton style={{ paddingHorizontal: 0 }} />
            <LoadingSkeleton style={{ width: '100%', height: 50, borderRadius: Sizes.BORDER_RADIUS_MD }} />
        </View>
    );
};

const styles = StyleSheet.create({
    globalWrapper: {
        width: '100%',
        paddingHorizontal: '4%',
        gap: 15,
        justifyContent: 'flex-start',
    },
    infoWrapper: {
        width: '100%',
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    gatheringPicture: {
        width: '25%',
    },
    detailsWrapper: {
        width: '70%',
        height: '90%',
        gap: 5,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    gatheringName: {
        fontSize: Sizes.FONT_SIZE_XL,
        fontWeight: 'bold',
    },
    gatheringDescriptionWrapper: {
        width: '100%',
        backgroundColor: Colours.WHITE,
        borderRadius: Sizes.BORDER_RADIUS_MD,
        padding: 7,
    },
    gatheringDescription: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.GRAY,
        flexWrap: 'wrap',
        flex: 1,
    },
    descriptionHeader: {
        color: Colours.DARK,
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: '500',
    },
    miscSection: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    messageBtnWrapper: {
        width: '100%',
        height: 35,
        flexDirection: 'row',
        gap: 5,
    },
    shareBtn: {
        width: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colours.LIGHT,
        borderRadius: Sizes.BORDER_RADIUS_MD,
    },
});
