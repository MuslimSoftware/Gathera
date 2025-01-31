import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useUserGatherings } from '../../hooks/useUserGatherings';
import { JoinGatheringListItem } from '../../../../shared/components/ListItems/Gathering/JoinGatheringListItem';
import { PaginatedList } from '../../../../shared/components/Core/PaginatedList';
import { GatheringListItemSkeleton } from '../../../../shared/components/ListItems/Gathering/GatheringListItem';
import { getNavigationBarBottomPadding } from '../../../../shared/utils/uiHelper';
import { Gathering } from '../../../../types/Gathering';

export type EventFields = {
    id: number;
    name: string;
    description: string;
    start_time: string;
    end_time: string;
    location: string;
    image: string;
};

export const ProfileGatheringsList = ({ route }: { route: any }) => {
    const { profileId } = route.params;
    const { gatherings, isLoading, error, fetchGatherings, refresh } = useUserGatherings(profileId);

    if (error) {
        return (
            <View style={styles.messageWrapper}>
                <Text>There was an error fetching this user's gatherings: {error}</Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: Gathering }) => <JoinGatheringListItem gathering={item} />;

    return (
        <PaginatedList
            data={gatherings}
            renderItem={renderItem}
            contentContainerStyle={[styles.gatheringListContent, { paddingBottom: getNavigationBarBottomPadding() }]}
            onEndReached={fetchGatherings}
            refresh={refresh}
            isLoading={isLoading}
            renderSkeletonItem={GatheringListItemSkeleton}
            numSkeletonItemsToRender={5}
            dataName='gatherings'
        />
    );
};

const styles = StyleSheet.create({
    loading: {
        width: '100%',
        height: 40,
        alignItems: 'center',
    },
    eventsListWrapper: {
        flex: 1,
    },
    messageWrapper: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
    },
    gatheringListContent: {
        paddingTop: 5,
        paddingRight: 10,
        paddingLeft: 8,
        gap: 10,
        width: '100%',
        alignItems: 'center',
    },
});
