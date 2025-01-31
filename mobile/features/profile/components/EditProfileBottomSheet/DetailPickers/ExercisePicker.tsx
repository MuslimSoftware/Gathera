import React from 'react';
import OptionsPicker from './OptionsPicker';
import { DumbbellIcon } from '../../../../../shared/components/Core/Icons';
import { Sizes, Colours } from '../../../../../shared/styles/Styles';

export const ExercisePicker = ({ route }: { route: any }) => {
    const { currentSelection } = route.params;
    return (
        <OptionsPicker
            detailName='fitness'
            question='What is your exercise frequency?'
            icon={<DumbbellIcon size={Sizes.ICON_SIZE_XL} color={Colours.PRIMARY} />}
            options={['Daily', 'Often', 'Rarely', 'Never']}
            currentSelection={currentSelection}
        />
    );
};
