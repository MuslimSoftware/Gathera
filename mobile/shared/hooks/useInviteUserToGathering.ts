import { useState } from 'react';
import { useFetch } from './useFetch';
import { Gathering } from '../../types/Gathering';

export const useInviteUserToGathering = (userIdToAdd: string, gathering: Gathering, updateGatherings: any) => {
    const [isAttending] = useState(gathering.user_list.some((user: any) => user._id === userIdToAdd));
    const [isInvited, setIsInvited] = useState(gathering.invited_user_list?.some((user: any) => user._id === userIdToAdd));
    const { error, isLoading, fetchAsync } = useFetch();

    const inviteUserToGathering = async () => {
        await fetchAsync({ url: `/gathering/invite/${gathering._id}`, method: 'POST', body: { user_id_to_add: userIdToAdd } }, (data: any) => {
            setIsInvited(true);

            updateGatherings((gatherings: any[]) => {
                return gatherings.map((gathering: any) => {
                    if (gathering._id === data._id) {
                        return data;
                    }

                    return gathering;
                });
            });
        });
    };

    return { isInvited, setIsInvited, isAttending, error, isLoading, inviteUserToGathering };
};
