import React from 'react';
import { WineOIcon } from '../../../../../shared/components/Core/Icons';
import { Sizes, Colours } from '../../../../../shared/styles/Styles';
import OptionsPicker from './OptionsPicker';

export const AlcoholPicker = ({ route }: { route: any }) => {
    const { currentSelection } = route.params;
    return (
        <OptionsPicker
            detailName='alcohol'
            question='Do you drink alcohol?'
            icon={<WineOIcon size={Sizes.ICON_SIZE_XL} color={Colours.PRIMARY} />}
            options={['Never', 'Rarely', 'Socially', 'Often']}
            currentSelection={currentSelection}
        />
    );
};
