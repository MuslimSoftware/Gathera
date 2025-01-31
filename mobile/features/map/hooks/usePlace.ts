import { useEffect, useState } from 'react';
import { useFetch } from '../../../shared/hooks/useFetch';
import { getMapContextValues } from '../../../shared/context/MapContext';

export const usePlace = (placeId: string) => {
    const { updatePlace } = getMapContextValues();
    const [isInterested, setIsInterested] = useState<boolean>(false);
    const { isLoading, error, fetchAsync } = useFetch();

    const fetchPlace = async () => {
        await fetchAsync({ url: `/place/get/${placeId}` }, (data: any) => {
            updatePlace(data);
            setIsInterested(data.isInterested);
        });
    };

    useEffect(() => {
        fetchPlace();
    }, [placeId]);

    return { isLoading, error, fetchPlace, isInterested, setIsInterested };
};
