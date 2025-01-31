import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { PROFILE_PIC_SIZES } from '../../MainPictures/ProfilePicture';
import { Gathering } from '../../../../types/Gathering';
import { Colours, Sizes } from '../../../styles/Styles';
import { useNavigate } from '../../../hooks/useNavigate';
import { LoadingSkeleton } from '../../Core/LoadingSkeleton';
import { GatheringPicture } from '../../MainPictures/GatheringPicture';

export const GatheringListItemSkeleton = () => {
    return (
        <View style={styles.globalWrapper}>
            <LoadingSkeleton style={{ ...PROFILE_PIC_SIZES['small'], borderRadius: Sizes.BORDER_RADIUS_FULL, marginVertical: 5, marginLeft: 5 }} />
            <View style={styles.textWrapper}>
                <LoadingSkeleton style={{ height: 20, width: '50%' }} />
            </View>
        </View>
    );
};

interface GatheringListItemProps {
    gathering: Gathering;
    children?: React.ReactNode;
}

const GatheringListItem = ({ gathering, children }: GatheringListItemProps) => {
    const { pushScreen } = useNavigate();

    return (
        <Pressable style={styles.globalWrapper} onPress={() => pushScreen('Gathering', { gatheringId: gathering._id })}>
            <GatheringPicture uri={gathering.gathering_pic} />
            <View style={styles.textWrapper}>
                <Text style={styles.gatheringName} numberOfLines={1}>
                    {gathering.gathering_name}
                </Text>
                <Text style={styles.placeName} numberOfLines={1}>
                    {gathering.place.name}
                </Text>
                <Text style={styles.userCount} numberOfLines={1}>{`${gathering.user_list.length} users`}</Text>
            </View>
            {children}
        </Pressable>
    );
};

export default GatheringListItem;

const styles = StyleSheet.create({
    globalWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    textWrapper: {
        flex: 1,
    },
    inviteButton: {
        borderRadius: Sizes.BORDER_RADIUS_MD,
        paddingVertical: 0,
        backgroundColor: Colours.PRIMARY,
        borderColor: Colours.PRIMARY,
    },
    gatheringName: {
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: '400',
    },
    placeName: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.PRIMARY,
    },
    userCount: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.GRAY,
    },
});
