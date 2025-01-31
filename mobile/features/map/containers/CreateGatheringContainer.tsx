import React from 'react';
import CreateGathering from '../components/Gathering/CreateGathering';
import { getMapContextValues } from '../../../shared/context/MapContext';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';

export const CreateGatheringContainer = () => {
    const { selectedPlace } = getMapContextValues();

    if (!selectedPlace) {
        return (
            <HeaderPageLayout>
                <ErrorMessage message='Place not found' />
            </HeaderPageLayout>
        );
    }

    return <CreateGathering place={selectedPlace} />;
};
