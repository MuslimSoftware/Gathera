import React, { useMemo } from 'react';
import { FilterRow } from '../../../../shared/components/FilterRow';
import { PlaceList } from '../../../../shared/components/PlaceList';
import { getMapContextValues } from '../../../../shared/context/MapContext';
import { Filter, PLACE_FILTERS } from '../../../../types/Place';

const areEqual = () => true;

export const PlaceNavigationPage = React.memo(() => {
    const { places, isPlacesLoading, placesError, setFilters, refreshPlaces } = getMapContextValues();

    const onFilter = (selectedFilters: Filter[]) => {
        setFilters(selectedFilters);
    };

    // sort places by number of gatherings, then by rating count
    const placesSortedByNumGatherings = useMemo(() => {
        return Array.from(places.values()).sort((a, b) => {
            const aGatheringCount = a.gathering_count ?? 0;
            const bGatheringCount = b.gathering_count ?? 0;
            if (aGatheringCount === bGatheringCount) return (b.rating_count ?? 0) - (a.rating_count ?? 0);

            return (b.gathering_count ?? 0) - (a.gathering_count ?? 0);
        });
    }, [places]);

    return (
        <>
            <FilterRow filters={PLACE_FILTERS} onChangeFilters={onFilter} />
            <PlaceList
                data={placesSortedByNumGatherings}
                isLoading={isPlacesLoading}
                error={placesError}
                refresh={refreshPlaces}
                enableBottomPadding
            />
        </>
    );
}, areEqual);
