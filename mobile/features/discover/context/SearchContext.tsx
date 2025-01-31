import { createContext, useContext } from 'react';
import { Gathering } from '../../../types/Gathering';
import { IPlace } from '../../../types/Place';
import { UserPreview } from '../../../types/User';
import { useQuery } from '../hooks/useQuery';

interface SearchContextProps {
    query: string;
    users: UserPreview[];
    isUsersLoading: boolean;
    usersError: string;
    gatherings: Gathering[];
    isGatheringsLoading: boolean;
    gatheringsError: string;
    places: IPlace[];
    isPlacesLoading: boolean;
    placesError: string;

    setQuery: any;

    fetchUsers: any;
    fetchGatherings: any;
    fetchPlaces: any;

    refreshUsers: any;
    refreshGatherings: any;
    refreshPlaces: any;
}

const SearchContextDefaultValues: SearchContextProps = {
    query: '',
    users: [],
    isUsersLoading: false,
    usersError: '',
    gatherings: [],
    isGatheringsLoading: false,
    gatheringsError: '',
    places: [],
    isPlacesLoading: false,
    placesError: '',

    setQuery: () => {},

    fetchUsers: () => {},
    fetchGatherings: () => {},
    fetchPlaces: () => {},

    refreshUsers: () => {},
    refreshGatherings: () => {},
    refreshPlaces: () => {},
};

export const SearchContext = createContext(SearchContextDefaultValues);

export const getSearchContextValues = () => {
    return useContext(SearchContext);
};

export const SearchContextProvider = ({ children }: { children: React.ReactNode }) => {
    const {
        query,
        setQuery,
        users,
        isUsersLoading,
        usersError,
        fetchUsers,
        refreshUsers,
        gatherings,
        isGatheringsLoading,
        gatheringsError,
        fetchGatherings,
        refreshGatherings,
        places,
        isPlacesLoading,
        placesError,
        fetchPlaces,
        refreshPlaces,
    } = useQuery();

    return (
        <SearchContext.Provider
            value={{
                query,
                setQuery,
                users,
                isUsersLoading,
                usersError,
                fetchUsers,
                refreshUsers,
                gatherings,
                isGatheringsLoading,
                gatheringsError,
                fetchGatherings,
                refreshGatherings,
                places,
                isPlacesLoading,
                placesError,
                fetchPlaces,
                refreshPlaces,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};
