import React from 'react';
import { useGatherings } from '../hooks/useGatherings';
import { GatheringList } from '../components/Gathering/GatheringList';

interface PlaceGatheringListProps {
    placeId: string;
}

export const PlaceGatheringList = ({ placeId }: PlaceGatheringListProps) => {
    const { gatherings, fetchGatherings, error, isLoading, refresh } = useGatherings(placeId);

    return (
        <GatheringList
            error={error}
            gatherings={gatherings}
            fetchGatherings={fetchGatherings}
            isLoading={isLoading}
            refresh={refresh}
            enableBottomPadding
            hidePlaceName
        />
    );
};
