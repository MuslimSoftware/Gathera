import React from 'react';
import { useGathering } from '../hooks/useGathering';
import { GatheringSettings, GatheringSettingsSkeleton } from '../components/Gathering/GatheringSettings';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';

interface GatheringSettingsContainerProps {
    route: any;
}

export const GatheringSettingsContainer = ({ route }: GatheringSettingsContainerProps) => {
    const { gatheringId }: { gatheringId: any } = route.params as any;
    const { gathering, isLoading, error, fetchGathering } = useGathering(gatheringId);

    if (isLoading) {
        return <GatheringSettingsSkeleton />;
    }

    if (error || !gathering) {
        return (
            <HeaderPageLayout>
                <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={fetchGathering} />}>
                    <ErrorMessage message={error || 'Gathering not found'} />
                </ScrollView>
            </HeaderPageLayout>
        );
    }

    return <GatheringSettings gathering={gathering} />;
};
