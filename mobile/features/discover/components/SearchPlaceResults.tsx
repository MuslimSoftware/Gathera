import React from 'react';
import { getSearchContextValues } from '../context/SearchContext';
import { PlaceList } from '../../../shared/components/PlaceList';

export const SearchPlaceResults = () => {
    const { places, isPlacesLoading, placesError, fetchPlaces, refreshPlaces } = getSearchContextValues();

    return (
        <PlaceList
            data={places}
            error={placesError}
            onEndReached={fetchPlaces}
            refresh={refreshPlaces}
            isLoading={isPlacesLoading}
            enableBottomPadding
        />
    );
};
