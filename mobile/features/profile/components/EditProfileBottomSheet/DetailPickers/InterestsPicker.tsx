import React from 'react';
import { useInterests } from '../../../hooks/useInterests';
import { getAuthContextValues } from '../../../../../shared/context/AuthContext';
import { MAX_INTERESTS_COUNT } from '../../../../../gathera-lib/constants/user';
import { PickerPage } from '../../../../../shared/components/Pages/PickerPage';
import { useFetch } from '../../../../../shared/hooks/useFetch';

export const InterestsPicker = ({ profile, setProfile, navigation }: any) => {
    const { user, setUser } = getAuthContextValues();
    const { error, isLoading, fetchAsync: saveInterests } = useFetch();
    const { interests, isLoading: interestsIsLoading, error: interestsError } = useInterests();

    const handleSubmit = async (selectedInterests: string[]) => {
        await saveInterests({ url: '/user/interests', method: 'PATCH', body: { newInterests: selectedInterests } }, (data: any) => {
            setUser({ ...user, interests: data });
            setProfile({ ...profile, interests: data });
            navigation.goBack();
        });
    };

    return (
        <PickerPage
            pageTitle='Interests'
            options={interests}
            initialSelectedData={user.interests}
            maxNumSelections={MAX_INTERESTS_COUNT}
            onSubmit={handleSubmit}
            submitLoading={isLoading || interestsIsLoading}
            error={error || interestsError}
        />
    );
};
