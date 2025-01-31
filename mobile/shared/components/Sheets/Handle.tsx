import React from 'react';
import { Colours } from '../../styles/Styles';
import { BottomSheetHandle } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultHandleProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetHandle/types';

export const Handle = (props: BottomSheetDefaultHandleProps) => {
    return <BottomSheetHandle {...props} indicatorStyle={{ backgroundColor: Colours.GRAY }} />;
};
