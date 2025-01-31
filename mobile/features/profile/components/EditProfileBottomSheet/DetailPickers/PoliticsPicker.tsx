import React from 'react';
import { PoliticsIcon } from '../../../../../shared/components/Core/Icons';
import { Sizes, Colours } from '../../../../../shared/styles/Styles';
import OptionsPicker from './OptionsPicker';

export const PoliticsPicker = ({ route }: { route: any }) => {
    const { currentSelection } = route.params;
    return (
        <OptionsPicker
            detailName='politics'
            question='What is your political leaning?'
            icon={<PoliticsIcon size={Sizes.ICON_SIZE_XL} color={Colours.PRIMARY} />}
            options={['Conservative', 'Liberal', 'Libertarian', 'Socialist', 'Other']}
            currentSelection={currentSelection}
        />
    );
};
