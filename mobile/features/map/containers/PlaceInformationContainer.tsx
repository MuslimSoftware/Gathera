import { RefreshControl, Text } from 'react-native';
import React from 'react';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { usePlace } from '../hooks/usePlace';
import { DetailPage, DetailPageSkeleton } from '../../../shared/components/Pages/DetailPage';
import { getMapContextValues } from '../../../shared/context/MapContext';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { ScrollView } from 'react-native-gesture-handler';

interface PlaceInformationContainerProps {
    route: any;
}

export const PlaceInformationContainer = ({ route }: PlaceInformationContainerProps) => {
    const { placeId } = route.params;
    const { places } = getMapContextValues();
    const { isLoading, error, fetchPlace } = usePlace(placeId);
    const place: any = places.get(placeId);

    if (isLoading) {
        return <DetailPageSkeleton />;
    }

    if (!place || error) {
        return (
            <HeaderPageLayout hasTopMargin title='Details'>
                <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={fetchPlace} />}>
                    <ErrorMessage message={error || 'Place not found'} />
                </ScrollView>
            </HeaderPageLayout>
        );
    }

    place.food_services = {
        ...place.food_services,
        reservable: place.reservable,
    };

    const details = {
        Address: place.address,
        Phone: place.phone_number,
        Website: place.website,
        'Google Maps': place.google_maps_url,
        Services: place.food_services,
        'Opening Hours': place.opening_hours,
    };

    return <DetailPage title={place.name} details={details} />;
};
