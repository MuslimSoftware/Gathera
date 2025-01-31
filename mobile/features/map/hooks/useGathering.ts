import { useEffect, useState } from 'react';
import { useFetch } from '../../../shared/hooks/useFetch';
import { Gathering } from '../../../types/Gathering';
import { getAuthContextValues } from '../../../shared/context/AuthContext';

export const useGathering = (gatheringId: string) => {
    const {
        user: { _id: userId },
    } = getAuthContextValues();
    const [gathering, setGathering] = useState<Gathering>();
    const [isUserAttending, setIsUserAttending] = useState<boolean>(false);

    const { isLoading, error, fetchAsync } = useFetch();

    const fetchGathering = async () => {
        await fetchAsync({ url: `/gathering/get/${gatheringId}` }, (data: any) => {
            // Determine if user is attending
            data.user_list.forEach((user: any) => {
                if (user._id == userId) {
                    setIsUserAttending(true);
                    return;
                }
            });

            setGathering(data);
        });
    };

    useEffect(() => {
        fetchGathering();
    }, []);

    return { gathering, setGathering, isUserAttending, setIsUserAttending, error, isLoading, fetchGathering };
};
