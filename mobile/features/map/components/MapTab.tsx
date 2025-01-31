import { StatusBar } from 'react-native';
import React from 'react';
import { PlaceMap } from './PlaceMap';
import { PlaceBottomSheetWrapper } from '../containers/PlaceBottomSheetWrapper';

export const MapTab = React.memo(() => {
    return (
        <>
            <StatusBar barStyle='light-content' translucent backgroundColor='transparent' />
            <PlaceMap />
            <PlaceBottomSheetWrapper />
        </>
    );
});
