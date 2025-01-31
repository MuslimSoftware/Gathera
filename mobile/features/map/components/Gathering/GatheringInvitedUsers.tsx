import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { UserListItem } from '../../../../shared/components/ListItems/UserListItem';
import { Colours, Sizes } from '../../../../shared/styles/Styles';

interface GatheringInvitedUsersProps {
    isUserAttending: boolean;
    invitedUsers: any[];
}

export const GatheringInvitedUsers = ({ isUserAttending, invitedUsers }: GatheringInvitedUsersProps) => {
    if (!isUserAttending || invitedUsers.length === 0) {
        return <></>;
    }

    return (
        <View style={styles.userSection}>
            <Text style={styles.headerText}>Invited</Text>
            <View style={styles.profileList}>
                {invitedUsers.map((invitedUser: any) => (
                    <UserListItem profile={invitedUser} key={invitedUser._id} />
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
