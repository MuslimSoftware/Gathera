import React from 'react';
import { Colours, Sizes } from '../../../../../shared/styles/Styles';
import { CheckmarkCircleIcon } from '../../../../../shared/components/Core/Icons';
import { MoreActionsLayout } from './MoreActionsLayout';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';

export const BlockSent = ({ displayName }: { displayName: string }) => {
    const bottomSheet = useBottomSheet();
    useFocusEffect(
        React.useCallback(() => {
            bottomSheet.snapToIndex(0);
        }, [bottomSheet])
    );

    return (
        <MoreActionsLayout
            title={`${displayName} has been blocked!`}
            titleIcon={<CheckmarkCircleIcon size={Sizes.ICON_SIZE_XL} color={Colours.GREEN} />}
            subtitle='They will no longer be able to interact with you on the app. You can unblock them at any time.'
        />
    );
};
