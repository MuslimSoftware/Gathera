import React, { useMemo } from 'react';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { useTrendingPlaces } from '../hooks/useTrendingPlaces';
import { PlaceList } from '../../../shared/components/PlaceList';
import { InfoIcon } from '../../../shared/components/Core/Icons';
import { Overlay } from '../../../shared/components/Overlays/Overlay';

export const TrendingPlacesPage = () => {
    const { trendingPlaces, fetchTrendingPlaces, isLoadingTrendingPlaces, refreshTrendingPlaces, trendingPlacesError } = useTrendingPlaces();
    const [showInfoOverlay, setShowInfoOverlay] = React.useState(false);

    const infoContent = useMemo(
        () => ({
            title: 'How it works',
            description:
                'Places are ranked by how popular they are on the app, how many people have viewed them, and their number of gatherings within the last week.',
            imageSource: require('../../../assets/images/services/location.png'),
        }),
        []
    );

    return (
        <HeaderPageLayout title='Trending Places' headerRight={<InfoIcon style={{ padding: 10 }} onPress={() => setShowInfoOverlay(true)} />}>
            <Overlay
                content={infoContent}
                modalProps={{ visible: showInfoOverlay }}
                dismissOverlay={() => setShowInfoOverlay(false)}
                dismissOnBackdropPress
                dismissButtonLabel='Got it!'
            />
            <PlaceList
                data={trendingPlaces}
                isLoading={isLoadingTrendingPlaces}
                error={trendingPlacesError}
                onEndReached={fetchTrendingPlaces}
                refresh={refreshTrendingPlaces}
                enableBottomPadding
            />
        </HeaderPageLayout>
    );
};
