import React from 'react';
import { SmokingIcon } from '../../../../../shared/components/Core/Icons';
import { Sizes, Colours } from '../../../../../shared/styles/Styles';
import OptionsPicker from './OptionsPicker';

export const SmokingPicker = ({ route }: { route: any }) => {
    const { currentSelection } = route.params;
    return (
        <OptionsPicker
            detailName='smoke'
            question='Do you smoke?'
            icon={<SmokingIcon size={Sizes.ICON_SIZE_XL} color={Colours.PRIMARY} />}
            options={['Never', 'Rarely', 'Socially', 'Often']}
            currentSelection={currentSelection}
        />
    );
};
