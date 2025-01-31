import { useState } from 'react';
import { useFetch } from './useFetch';
import { Gathering } from '../../types/Gathering';
import { getAuthContextValues } from '../context/AuthContext';

export const useJoinGathering = (gathering: Gathering) => {
    const {
        user: { _id: userId },
    } = getAuthContextValues();
    const [data, setData] = useState(gathering);
    const [isAttending, setIsAttending] = useState(gathering.user_list.some((u: any) => u._id === userId));
    const { error, isLoading, fetchAsync } = useFetch();

    const joinGathering = async () => {
        await fetchAsync({ url: `/gathering/join/${gathering._id}`, method: 'POST' }, (data: any) => {
            setIsAttending(data.user_list.some((u: any) => u._id === userId));
            setData(data);
        });
    };

    return { updatedGathering: data, isAttending, setIsAttending, error, isLoading, joinGathering };
};
