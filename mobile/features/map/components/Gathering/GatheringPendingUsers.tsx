import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colours, Sizes } from '../../../../shared/styles/Styles';
import { PendingUserListItem } from '../../../../shared/components/ListItems/PendingUserListItem';

interface GatheringPendingUsersProps {
    isUserAttending: boolean;
    pendingUsers: any[];
    respondToUserRequest: (userId: string, join: boolean) => void;
}

export const GatheringPendingUsers = ({ isUserAttending, pendingUsers, respondToUserRequest }: GatheringPendingUsersProps) => {
    if (!isUserAttending || pendingUsers.length === 0) {
        return <></>;
    }

    return (
        <View style={styles.userSection}>
            <Text style={styles.headerText}>Requested To Join</Text>
            <View style={styles.profileList}>
                {pendingUsers.map((pendingUser: any) => (
                    <PendingUserListItem
                        acceptBtnHandler={() => respondToUserRequest(pendingUser._id, true)}
                        rejectBtnHandler={() => respondToUserRequest(pendingUser._id, false)}
                        key={pendingUser._id}
                        user={pendingUser}
                    />
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
