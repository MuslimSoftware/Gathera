import React from 'react';
import { View, StyleSheet } from 'react-native';
import GatheringListItem from './GatheringListItem';
import { useInviteUserToGathering } from '../../../hooks/useInviteUserToGathering';
import { GrayButton } from '../../Buttons/GrayButton';
import { PrimaryButton } from '../../Buttons/PrimaryButton';
import { Gathering } from '../../../../types/Gathering';
import { BUTTON_DEFAULT_MIN_WIDTH } from '../../Buttons/Button';
import { useToastError } from '../../../hooks/useToastError';

interface InviteGatheringListItemProps {
    gathering: Gathering;
    setGatherings: (gatherings: any[]) => void;
    profileId: string;
}

export const InviteGatheringListItem = ({ gathering, setGatherings, profileId }: InviteGatheringListItemProps) => {
    const { inviteUserToGathering, isInvited, isAttending, error, isLoading } = useInviteUserToGathering(profileId, gathering, setGatherings);
    const isGatheringFull = gathering.user_list.length === gathering.max_count;

    useToastError(error);

    return (
        <GatheringListItem gathering={gathering}>
            <View>
                {!isInvited && isAttending && <GrayButton label='Attending' containerStyle={styles.button} />}
                {!isInvited && !isAttending && isGatheringFull && <GrayButton label='Full' containerStyle={styles.button} />}
                {!isInvited && !isAttending && !isGatheringFull && (
                    <PrimaryButton onPress={inviteUserToGathering} label='Invite' containerStyle={styles.button} />
                )}
                {isInvited && <GrayButton label='Invited' containerStyle={styles.button} />}
            </View>
        </GatheringListItem>
    );
};

const styles = StyleSheet.create({
    button: {
        minWidth: BUTTON_DEFAULT_MIN_WIDTH,
    },
});
