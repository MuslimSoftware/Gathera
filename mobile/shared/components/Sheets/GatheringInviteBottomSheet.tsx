import React, { useMemo } from 'react';
import { ListSheet } from './ListSheet';
import { useUserGatherings } from '../../../features/profile/hooks/useUserGatherings';
import { getAuthContextValues } from '../../context/AuthContext';
import { InviteGatheringListItem } from '../ListItems/Gathering/InviteGatheringListItem';
import { RefreshControl } from 'react-native-gesture-handler';
import { filterArray } from '../../utils/dataHelper';

interface GatheringInviteBottomSheetProps {
    setShowGatheringSheet: (show: boolean) => void;
    profileId: string;
}

export const GatheringInviteBottomSheet = ({ setShowGatheringSheet, profileId }: GatheringInviteBottomSheetProps) => {
    const {
        user: { _id: userId },
    } = getAuthContextValues();
    const [searchQuery, setSearchQuery] = React.useState('');
    const { isLoading, gatherings, setGatherings, fetchGatherings, refresh } = useUserGatherings(userId);

    const searchResults = useMemo(() => filterArray(gatherings, searchQuery, ['gathering_name', 'place.name']), [searchQuery, gatherings]);

    return (
        <ListSheet
            setShowSheet={setShowGatheringSheet}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            title='Invite to'
            flatListData={{
                data: searchResults,
                renderItem: ({ item }: any) => (
                    <InviteGatheringListItem key={item._id} gathering={item} setGatherings={setGatherings} profileId={profileId} />
                ),
                keyExtractor: (item: any) => item._id,
                onEndReached: fetchGatherings,
                onEndReachedThreshold: 0.5,
                RefreshControl: <RefreshControl refreshing={false} onRefresh={refresh} />,
            }}
            isEmpty={gatherings.length === 0}
            enableDrag
            emptyText={'You are not in any gatherings. Once you join a gathering you can invite users!'}
        />
    );
};
