import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useGathering } from '../hooks/useGathering';
import { GatheringContent } from '../components/Gathering/GatheringContent';
import { getMapContextValues } from '../../../shared/context/MapContext';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { GatheringDetailsSkeleton } from '../components/Gathering/GatheringDetails';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';

export const GatheringContentContainer = ({ route }: any) => {
    const { gatheringId }: { gatheringId: string } = route.params as any;
    const { places } = getMapContextValues();

    const { gathering, setGathering, isUserAttending, setIsUserAttending, fetchGathering, isLoading } = useGathering(gatheringId);

    if (isLoading) {
        return (
            <HeaderPageLayout>
                <View>
                    <GatheringDetailsSkeleton />
                </View>
            </HeaderPageLayout>
        );
    }

    if (!gathering) {
        return (
            <HeaderPageLayout>
                <ErrorMessage message='No Gathering Found!' />
            </HeaderPageLayout>
        );
    }

    return (
        <GatheringContent
            place={places.get(gathering.place._id)!}
            gathering={gathering}
            setGathering={setGathering}
            fetchGathering={fetchGathering}
            isUserAttending={isUserAttending}
            setIsUserAttending={setIsUserAttending}
        />
    );
};
