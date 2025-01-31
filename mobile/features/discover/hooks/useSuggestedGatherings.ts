import { useEffect, useState } from 'react';
import { usePaginatedFetch } from '../../../shared/hooks/usePaginatedFetch';
import { Gathering } from '../../../types/Gathering';
import { useUpcomingGatherings } from './useUpcomingGatherings';

export type DisplayedGatheringType = 'Suggested' | 'Upcoming';

/**
 * Gets suggested gatherings for the user, uses Upcoming gatherings as fallback
 */
export const useSuggestedGatherings = () => {
    const [displayedGatherings, setDisplayedGatherings] = useState<Gathering[]>([]);
    const [displayedGatheringType, setDisplayedGatheringType] = useState<DisplayedGatheringType>('Suggested');

    const {
        data: suggestedGatherings,
        error: suggestedGatheringsError,
        isLoading: isLoadingSuggestedGatherings,
        loadMore: fetchSuggestedGatherings,
        refresh: refreshSuggestedGatherings,
    } = usePaginatedFetch<Gathering>(`/gathering/suggested`);

    const { upcomingGatheringsError, isUpcomingGatheringsLoading, getUpcomingGatherings } = useUpcomingGatherings();

    useEffect(() => {
        if (suggestedGatheringsError || (!isLoadingSuggestedGatherings && suggestedGatherings.length === 0)) {
            getUpcomingGatherings((data) => setDisplayedGatherings(data.data));
            setDisplayedGatheringType('Upcoming');
        } else {
            setDisplayedGatherings(suggestedGatherings);
            setDisplayedGatheringType('Suggested');
        }
    }, [suggestedGatherings, isLoadingSuggestedGatherings]);

    return {
        displayedGatherings,
        displayedGatheringType,
        fetchDisplayedGatherings: fetchSuggestedGatherings,
        refreshDisplayedGatherings: refreshSuggestedGatherings,
        isLoading: isLoadingSuggestedGatherings || isUpcomingGatheringsLoading,
        error: upcomingGatheringsError,
    };
};
