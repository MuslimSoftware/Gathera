import React, { useMemo } from 'react';
import { HeaderPageLayout } from '../../../../shared/layouts/HeaderPageLayout';
import { PlaceList } from '../../../../shared/components/PlaceList';
import { getMapContextValues } from '../../../../shared/context/MapContext';
import SearchBar from '../../../discover/components/SearchBar';
import { filterArray } from '../../../../shared/utils/dataHelper';
import { IPlace } from '../../../../types/Place';

export const PlaceSearch = () => {
    const { places, isPlacesLoading, placesError } = getMapContextValues();
    const [searchQuery, setSearchQuery] = React.useState('');

    const placesArray = useMemo(() => {
        return Array.from(places.values());
    }, [places]);

    const filteredPlaces = useMemo(() => {
        return filterArray<IPlace>(placesArray, searchQuery, 'name');
    }, [places, searchQuery]);

    return (
        <HeaderPageLayout title={<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}>
            <PlaceList data={filteredPlaces} error={placesError} isLoading={isPlacesLoading} enableBottomPadding />
        </HeaderPageLayout>
    );
};
