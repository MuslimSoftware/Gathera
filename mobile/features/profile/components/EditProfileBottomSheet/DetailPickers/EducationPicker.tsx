import React from 'react';
import { EducationIcon } from '../../../../../shared/components/Core/Icons';
import { Sizes, Colours } from '../../../../../shared/styles/Styles';
import OptionsPicker from './OptionsPicker';

export const EducationPicker = ({ route }: { route: any }) => {
    const { currentSelection } = route.params;
    return (
        <OptionsPicker
            detailName='education'
            question='What is your highest level of education?'
            icon={<EducationIcon size={Sizes.ICON_SIZE_XL} color={Colours.PRIMARY} />}
            options={['High School', 'College', 'University']}
            currentSelection={currentSelection}
        />
    );
};
