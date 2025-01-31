import React from 'react';
import { WeedIcon } from '../../../../../shared/components/Core/Icons';
import { Sizes, Colours } from '../../../../../shared/styles/Styles';
import OptionsPicker from './OptionsPicker';

export const CannabisPicker = ({ route }: { route: any }) => {
    const { currentSelection } = route.params;
    return (
        <OptionsPicker
            detailName='weed'
            question='Do you smoke weed?'
            icon={<WeedIcon size={Sizes.ICON_SIZE_XL} color={Colours.PRIMARY} />}
            options={['Never', 'Rarely', 'Socially', 'Often']}
            currentSelection={currentSelection}
        />
    );
};
