import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { UserPreviewCard } from '../../../../shared/components/UserPreviewCard';
import { Sizes, Colours } from '../../../../shared/styles/Styles';
import { getAuthContextValues } from '../../../../shared/context/AuthContext';

interface GatheringAttendingUsersProps {
    attendingUsers: any[];
    gatheringHostId: string;
    maxCount: number;
    setShowInviteSheet: any;
}

export const GatheringAttendingUsers = ({ attendingUsers, gatheringHostId, maxCount, setShowInviteSheet }: GatheringAttendingUsersProps) => {
    const {
        user: { _id: userId },
    } = getAuthContextValues();
    const isUserAttending = attendingUsers.some((attendingUser) => attendingUser._id == userId);
    const emptySlotCount = (maxCount - attendingUsers.length) as any;
    const dummySlots = Array.from({ length: emptySlotCount }, (_, index) => index);

    return (
        <View style={styles.userSection}>
            <Text style={styles.headerText}>Attending</Text>
            <View style={styles.profileList}>
                {attendingUsers.map((attendingUser: any) => {
                    const isUserHost = attendingUser._id == gatheringHostId;

                    return <UserPreviewCard key={attendingUser._id} user={attendingUser} label={isUserHost ? 'Host' : undefined} />;
                })}
                {dummySlots.map((slot) => (
                    <Pressable
                        key={slot}
                        style={{
                            width: '49%',
                            height: 80,
                            paddingHorizontal: 5,
                            backgroundColor: Colours.WHITE,
                            borderWidth: 1,
                            borderColor: Colours.GRAY_LIGHT,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: Sizes.BORDER_RADIUS_LG,
                        }}
                        onPress={isUserAttending ? setShowInviteSheet : undefined}
                    >
                        <UserPreviewCard isDummy />
                    </Pressable>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    userSection: {
        paddingHorizontal: '4%',
        width: '100%',
        backgroundColor: Colours.WHITE,
        gap: 5,
    },
    headerText: {
        width: '100%',
        textAlign: 'left',
        fontSize: Sizes.FONT_SIZE_LG,
        color: Colours.DARK,
        fontWeight: '500',
    },
    profileList: {
        width: '100%',
        flexWrap: 'wrap',
        gap: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
