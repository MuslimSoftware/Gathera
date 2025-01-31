import React, { useMemo } from 'react';
import { getNationalities } from '../../../utils/profileHelper';
import { MAX_NATIONALITY_COUNT } from '../../../../../gathera-lib/constants/user';
import { useFetch } from '../../../../../shared/hooks/useFetch';
import { PickerPage } from '../../../../../shared/components/Pages/PickerPage';

interface NationalityPickerProps {
    navigation: any;
    route: any;
}

export const NationalityPicker = ({ navigation, route }: NationalityPickerProps) => {
    const { currentSelection } = route.params;
    const currentSelectionArray = useMemo(() => (currentSelection ? currentSelection.split(', ') : []), [currentSelection]);
    const nationalities = getNationalities();
    const { error, isLoading, fetchAsync: saveNationalities } = useFetch();

    const handleSubmit = async (selectedNationalities: string[]) => {
        await saveNationalities(
            { url: '/user/details/upsert', method: 'POST', body: { updateFields: { nationality: selectedNationalities } } },
            (data: any) => {
                navigation.navigate({ name: 'ProfileEditSection', params: { details: data } });
            }
        );
    };

    return (
        <PickerPage
            pageTitle='Nationality'
            options={nationalities}
            initialSelectedData={currentSelectionArray}
            maxNumSelections={MAX_NATIONALITY_COUNT}
            onSubmit={handleSubmit}
            submitLoading={isLoading}
            error={error}
        />
    );
};
