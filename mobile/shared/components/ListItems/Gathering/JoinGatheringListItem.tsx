import { View } from 'react-native';
import React from 'react';
import { GrayButton } from '../../Buttons/GrayButton';
import { PrimaryButton } from '../../Buttons/PrimaryButton';
import GatheringListItem from './GatheringListItem';
import { Gathering } from '../../../../types/Gathering';
import { getAuthContextValues } from '../../../context/AuthContext';
import { useJoinGathering } from '../../../hooks/useJoinGathering';
import { UserPreview } from '../../../../types/User';
import { useToastError } from '../../../hooks/useToastError';

interface JoinGatheringListItemProps {
    gathering: Gathering;
}

export const JoinGatheringListItem = ({ gathering }: JoinGatheringListItemProps) => {
    const { updatedGathering, isAttending, setIsAttending, isLoading, error, joinGathering } = useJoinGathering(gathering);
    const {
        user: { _id: userId },
    } = getAuthContextValues();

    const isFull = updatedGathering.user_list.length === updatedGathering.max_count;
    const isRequested = updatedGathering.requested_user_list.some((reqUser: UserPreview) => reqUser._id === userId);
    const isPast = new Date(updatedGathering.event_date) < new Date();

    useToastError(error);

    return (
        <GatheringListItem gathering={updatedGathering}>
            <View>
                {isPast && <GrayButton label='Done' />}
                {!isPast && !isAttending && isFull && <GrayButton label='Full' />}
                {!isPast && !isAttending && !isFull && isRequested && <GrayButton label='Requested' />}
                {!isPast && !isAttending && !isFull && !isRequested && <PrimaryButton onPress={joinGathering} label='Join' />}
                {!isPast && isAttending && <GrayButton label='Attending' />}
            </View>
        </GatheringListItem>
    );
};
