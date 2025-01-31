import React from 'react';
import { HumanIcon } from '../../../../../shared/components/Core/Icons';
import { Sizes, Colours } from '../../../../../shared/styles/Styles';
import OptionsPicker from './OptionsPicker';

export const GenderPicker = ({ route }: { route: any }) => {
    const { currentSelection } = route.params;
    return (
        <OptionsPicker
            detailName='gender'
            question='What is your gender?'
            icon={<HumanIcon size={Sizes.ICON_SIZE_XL} color={Colours.PRIMARY} />}
            options={['Male', 'Female', 'Other']}
            currentSelection={currentSelection}
        />
    );
};
