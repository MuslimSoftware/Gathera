import { useState } from 'react';
import { useFetch } from '../../../shared/hooks/useFetch';
import { showToast } from '../../../shared/utils/uiHelper';

interface UpdateUserFields {
    avatar_uri?: string;
    border?: string;
    display_name?: string;
    bio?: string;
    is_public?: boolean;
    instagram_username?: string;
    fname?: string;
    lname?: string;
    email?: string;
    phone_number?: string;
}

/**
 * Use this hook to update a user's profile information.
 * @param fields The fields to update.
 * @param setProfile The function to set the profile state, if applicable.
 */
export const useUpdateProfile = () => {
    const [profile, setProfile] = useState<any>(null);
    const { error, isLoading, fetchAsync } = useFetch();

    const updateProfile = async (fields: UpdateUserFields) => {
        await fetchAsync({ url: '/user/profile/update', method: 'PATCH', body: { fields } }, (data: any) => {
            setProfile(data);
            showToast('Profile updated successfully.');
        });
    };

    return { profile, error, isLoading, updateProfile };
};
