import React from 'react';
import { StyleSheet } from 'react-native';
import { UserListItem } from './UserListItem';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { GrayButton } from '../Buttons/GrayButton';
import { BUTTON_DEFAULT_MIN_WIDTH } from '../Buttons/Button';
import { UserPreview } from '../../../types/User';

interface InviteUserListItemProps {
    profile: UserPreview;
    inviteUser: (user: any) => void;
    isInvited: boolean;
}

export const InviteUserListItem = ({ profile, inviteUser, isInvited }: InviteUserListItemProps) => {
    return (
        <UserListItem profile={profile}>
            {!isInvited && <PrimaryButton onPress={() => inviteUser(profile._id)} label='Invite' containerStyle={styles.button} />}
            {isInvited && <GrayButton label='Invited' containerStyle={styles.button} />}
        </UserListItem>
    );
};

const styles = StyleSheet.create({
    button: {
        minWidth: BUTTON_DEFAULT_MIN_WIDTH,
    },
});
