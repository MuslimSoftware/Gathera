import React from 'react';
import { ZodiacIcon } from '../../../../../shared/components/Core/Icons';
import { Sizes, Colours } from '../../../../../shared/styles/Styles';
import OptionsPicker from './OptionsPicker';

export const ZodiacPicker = ({ route }: { route: any }) => {
    const { currentSelection } = route.params;
    return (
        <OptionsPicker
            detailName='zodiac'
            question='What is your zodiac sign?'
            icon={<ZodiacIcon size={Sizes.ICON_SIZE_XL} color={Colours.PRIMARY} />}
            options={['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagitarius', 'Capricorn', 'Aquarius', 'Pisces']}
            currentSelection={currentSelection}
        />
    );
};
