import React from 'react';
import { StyleSheet } from 'react-native';
import { GatheringItem, GatheringItemSkeleton } from './GatheringItem';
import { PaginatedList } from '../../../../shared/components/Core/PaginatedList';
import { getNavigationBarBottomPadding } from '../../../../shared/utils/uiHelper';
import { Gathering } from '../../../../types/Gathering';

interface GatheringListProps {
    gatherings: any[];
    isLoading: boolean;
    error: string | null | undefined;
    fetchGatherings?: () => void;
    refresh?: () => void;
    maxGatherings?: number;
    contentContainerStyle?: any;
    enableBottomPadding?: boolean;
    hidePlaceName?: boolean;
}

export const GatheringList = React.memo(
    ({
        gatherings,
        fetchGatherings,
        error,
        refresh,
        isLoading,
        maxGatherings,
        contentContainerStyle,
        enableBottomPadding = false,
        hidePlaceName = false,
    }: GatheringListProps) => {
        const bottomPadding = getNavigationBarBottomPadding() + 10;
        return (
            <PaginatedList
                data={gatherings}
                isLoading={isLoading}
                renderItem={({ item }: { item: Gathering }) => <GatheringItem gathering={item} hidePlaceName={hidePlaceName} />}
                renderSkeletonItem={GatheringItemSkeleton}
                numSkeletonItemsToRender={5}
                maxDataItemsToRender={maxGatherings}
                onEndReached={fetchGatherings}
                refresh={refresh}
                error={error}
                style={styles.container}
                contentContainerStyle={[styles.contentContainer, contentContainerStyle, enableBottomPadding && { paddingBottom: bottomPadding }]}
                dataName='gatherings'
            />
        );
    },
    (prevProps, nextProps) => prevProps.gatherings.length === nextProps.gatherings.length && prevProps.isLoading === nextProps.isLoading
);

const styles = StyleSheet.create({
    container: {
        padding: 5,
    },
    contentContainer: {
        gap: 5,
        paddingVertical: 5,
    },
});
