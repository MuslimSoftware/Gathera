import { StyleSheet } from 'react-native';
import React, { useMemo } from 'react';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { useSuggestedGatherings } from '../hooks/useSuggestedGatherings';
import { JoinGatheringListItem } from '../../../shared/components/ListItems/Gathering/JoinGatheringListItem';
import { InfoIcon } from '../../../shared/components/Core/Icons';
import { Overlay } from '../../../shared/components/Overlays/Overlay';
import { PaginatedList } from '../../../shared/components/Core/PaginatedList';
import { GatheringListItemSkeleton } from '../../../shared/components/ListItems/Gathering/GatheringListItem';

export const SuggestedGatheringsPage = () => {
    const [showInfoOverlay, setShowInfoOverlay] = React.useState(false);
    const {
        displayedGatherings,
        fetchDisplayedGatherings,
        isLoading: isLoadingDisplayedGatherings,
        refreshDisplayedGatherings,
    } = useSuggestedGatherings();

    const infoContent = useMemo(
        () => ({
            title: 'How it works',
            description: 'Gatherings are suggested based on your interests, the places you like, and the number of premium members in the gathering.',
            imageSource: require('../../../assets/images/services/location.png'),
        }),
        []
    );

    return (
        <HeaderPageLayout title='Suggested Gatherings' headerRight={<InfoIcon style={{ padding: 10 }} onPress={() => setShowInfoOverlay(true)} />}>
            <Overlay
                content={infoContent}
                modalProps={{ visible: showInfoOverlay }}
                dismissOverlay={() => setShowInfoOverlay(false)}
                dismissOnBackdropPress
                dismissButtonLabel='Got it!'
            />
            <PaginatedList
                data={displayedGatherings}
                style={styles.wrapper}
                contentContainerStyle={styles.listWrapper}
                isLoading={isLoadingDisplayedGatherings}
                onEndReached={fetchDisplayedGatherings}
                refresh={refreshDisplayedGatherings}
                renderSkeletonItem={GatheringListItemSkeleton}
                numFooterSkeletonItemsToRender={1}
                renderItem={({ item }) => <JoinGatheringListItem gathering={item} />}
                dataName='gatherings'
            />
        </HeaderPageLayout>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    listWrapper: {
        gap: 10,
        padding: 10,
    },
});
