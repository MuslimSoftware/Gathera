import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { PlaceFilter, IPlace } from '../../types/Place';
import { updateObject } from '../utils/dataHelper';

interface MapContextProps {
    places: Map<string, IPlace>;
    selectedPlace: IPlace | undefined;
    setSelectedPlaceId: React.Dispatch<string | undefined>;
    isPlacesLoading: boolean;
    filters: PlaceFilter[];
    setFilters: React.Dispatch<React.SetStateAction<PlaceFilter[]>>;
    refreshPlaces: () => void;
    updatePlace: (place: IPlace) => void;
    placesError: string;
}

const mapContextDefaultValues: MapContextProps = {
    places: new Map<string, IPlace>(),
    selectedPlace: undefined,
    setSelectedPlaceId: () => {},
    isPlacesLoading: true,
    filters: [],
    setFilters: () => {},
    refreshPlaces: () => {},
    updatePlace: () => {},
    placesError: '',
};

export const MapContext = createContext(mapContextDefaultValues);

export function getMapContextValues() {
    return useContext(MapContext);
}

interface MapProviderProps {
    children: ReactNode;
}

export const MapProvider = ({ children }: MapProviderProps) => {
    const [places, setPlaces] = useState<Map<string, IPlace>>(new Map<string, IPlace>()); // { placeId: place }
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(); // currently selected place id
    const [filters, setFilters] = useState<PlaceFilter[]>([]); // currently selected filters
    const { fetchAsync, isLoading: isPlacesLoading, error: placesError } = useFetch();

    const getAllPlaces = async () => {
        await fetchAsync({ url: '/place' }, async (places: any) => {
            // Set the places map to the response, making sure to keep any fields
            // that were already in the map that aren't in the response
            setPlaces((prevPlaces: Map<string, IPlace>) => {
                const newPlaces = new Map<string, IPlace>(prevPlaces);
                for (const place of places) {
                    const prevPlace = newPlaces.get(place._id) || {};
                    newPlaces.set(place._id, updateObject(prevPlace, place));
                }
                return newPlaces;
            });
        });
    };

    /**
     * Stores the currently selected place based on the selectedPlaceId
     * and the places map.
     */
    const selectedPlace = useMemo(() => {
        return places.get(selectedPlaceId || '');
    }, [places, selectedPlaceId]);

    /**
     * Takes a place and updates the place in the places map context.
     * @param place The place object to update
     */
    const updatePlace = (place: IPlace) => {
        // Update the place in the places map, making sure to keep the old values
        const prevPlace = places.get(place._id) || {};
        const updatedPlace = { ...prevPlace, ...place };
        const placesMap = new Map<string, IPlace>(places);
        placesMap.set(place._id, updatedPlace);
        setPlaces(placesMap);
    };

    /**
     * Stores the places that match the currently selected filters.
     */
    const filteredPlaces: Map<string, IPlace> = useMemo(() => {
        if (filters.length === 0) return places;

        const placesAccumulator: Map<string, IPlace> = new Map<string, IPlace>();

        for (const place of places.keys() || []) {
            const placeObj: IPlace = places.get(place)!;

            for (const filter of filters) {
                const isFilterLeafAndMatchesPlaceSubtype = filter.isLeaf() && filter.label.replace(' ', '_') === placeObj.subtype;
                const isFilterNotLeafAndMatchesPlaceType = !filter.isLeaf() && filter.label.replace(' ', '_') === placeObj.type;
                if (isFilterLeafAndMatchesPlaceSubtype || isFilterNotLeafAndMatchesPlaceType) {
                    placesAccumulator.set(place, placeObj);
                    break;
                }
            }
        }
        return placesAccumulator;
    }, [filters, places]);

    return (
        <MapContext.Provider
            value={{
                places: filteredPlaces,
                selectedPlace: selectedPlace,
                setSelectedPlaceId,
                filters,
                setFilters,
                isPlacesLoading: isPlacesLoading,
                refreshPlaces: getAllPlaces,
                updatePlace,
                placesError,
            }}
        >
            {children}
        </MapContext.Provider>
    );
};
