import { useState } from 'react';
import { useFetch } from '../../../shared/hooks/useFetch';
import { Profile } from '../../../types/User';
import { updateObject } from '../../../shared/utils/dataHelper';

export const useProfile = (profileId: string) => {
    const [profile, _setProfile] = useState<any>();
    const { isLoading, error, fetchAsync } = useFetch();

    const setProfile = (profile: any) => {
        _setProfile((prev: any) => updateObject(prev, profile));
    };

    const fetchProfile = async () => {
        await fetchAsync({ url: `/user/profile/get/${profileId}` }, (data: Profile) => setProfile(data));
    };

    return { profile, setProfile, error, isLoading, fetchProfile };
};
