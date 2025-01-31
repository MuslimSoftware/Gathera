import { StyleSheet } from 'react-native';
import React from 'react';
import { getSearchContextValues } from '../context/SearchContext';
import { GatheringList } from '../../map/components/Gathering/GatheringList';

export const SearchGatheringResults = () => {
    const { gatherings, isGatheringsLoading, gatheringsError, fetchGatherings, refreshGatherings } = getSearchContextValues();

    return (
        <GatheringList
            gatherings={gatherings}
            error={gatheringsError}
            isLoading={isGatheringsLoading}
            fetchGatherings={fetchGatherings}
            enableBottomPadding
            refresh={refreshGatherings}
        />
    );
};

const styles = StyleSheet.create({
    listContent: {
        width: '100%',
        paddingHorizontal: 10,
    },
});
