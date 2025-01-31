import React from 'react';
import { Colours, Sizes } from '../../../../../shared/styles/Styles';
import { CheckmarkCircleIcon } from '../../../../../shared/components/Core/Icons';
import { MoreActionsLayout } from './MoreActionsLayout';
import { useFocusEffect } from '@react-navigation/native';
import { useBottomSheet } from '@gorhom/bottom-sheet';

export const UnblockSent = ({ displayName }: { displayName: string }) => {
    const bottomSheet = useBottomSheet();
    useFocusEffect(
        React.useCallback(() => {
            bottomSheet.snapToIndex(0);
        }, [bottomSheet])
    );

    return (
        <MoreActionsLayout
            title={`${displayName} has been unblocked!`}
            titleIcon={<CheckmarkCircleIcon size={Sizes.ICON_SIZE_XL} color={Colours.GREEN} />}
            subtitle='They will now be able to interact with you on the app. You can block them at any time.'
        />
    );
};
