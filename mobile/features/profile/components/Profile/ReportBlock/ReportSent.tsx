import React from 'react';
import { Colours, Sizes } from '../../../../../shared/styles/Styles';
import { CheckmarkCircleIcon } from '../../../../../shared/components/Core/Icons';
import { MoreActionsLayout } from './MoreActionsLayout';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';

export const ReportSent = ({}: any) => {
    const bottomSheet = useBottomSheet();
    useFocusEffect(
        React.useCallback(() => {
            bottomSheet.snapToIndex(0);
        }, [bottomSheet])
    );

    return (
        <MoreActionsLayout
            title='Your report has been sent!'
            titleIcon={<CheckmarkCircleIcon size={Sizes.ICON_SIZE_XL} color={Colours.GREEN} />}
            subtitle='Thank you for keeping our community safe. We will review your report as soon as possible and take the appropriate action based on our investigation.'
        />
    );
};
