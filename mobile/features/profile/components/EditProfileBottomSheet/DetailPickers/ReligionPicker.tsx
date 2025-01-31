import React from 'react';
import { PrayerIcon } from '../../../../../shared/components/Core/Icons';
import { Sizes, Colours } from '../../../../../shared/styles/Styles';
import OptionsPicker from './OptionsPicker';

export const ReligionPicker = ({ route }: { route: any }) => {
    const { currentSelection } = route.params;
    return (
        <OptionsPicker
            detailName='religion'
            question='What is your religious identity?'
            icon={<PrayerIcon size={Sizes.ICON_SIZE_XL} color={Colours.PRIMARY} />}
            options={['Muslim', 'Christian', 'Catholic', 'Spiritual', 'Jewish', 'Hindu', 'Buddhist', 'Other']}
            currentSelection={currentSelection}
        />
    );
};
