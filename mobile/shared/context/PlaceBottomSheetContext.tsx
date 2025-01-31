import BottomSheet from '@gorhom/bottom-sheet';
import { useNavigationContainerRef } from '@react-navigation/native';
import React from 'react';
import { createContext, ReactNode, useContext, useRef } from 'react';

interface PlaceBottomSheetContextProps {
    bottomSheetRef: any;
    appNavigationContainerRef: any;
    mapViewRef: any;

    bottomSheetCurrentIndex: number;
    setBottomSheetCurrentIndex: (index: number) => void;
}

const PlaceBottomSheetContextDefaultValues: PlaceBottomSheetContextProps = {
    bottomSheetRef: undefined,
    appNavigationContainerRef: undefined,
    mapViewRef: undefined,

    bottomSheetCurrentIndex: 0,
    setBottomSheetCurrentIndex: (index: number) => {},
};

export const PlaceBottomSheetContext = createContext(PlaceBottomSheetContextDefaultValues);

export function getPlaceBottomSheetContextValues() {
    return useContext(PlaceBottomSheetContext);
}

interface PlaceBottomSheetProviderProps {
    children: ReactNode;
}

export const PlaceBottomSheetProvider = ({ children }: PlaceBottomSheetProviderProps) => {
    const [bottomSheetCurrentIndex, setBottomSheetCurrentIndex] = React.useState<number>(0);
    const contextValues: PlaceBottomSheetContextProps = {
        bottomSheetRef: useRef<BottomSheet>(null),
        appNavigationContainerRef: useNavigationContainerRef(),
        mapViewRef: useRef<any>(null),

        bottomSheetCurrentIndex,
        setBottomSheetCurrentIndex,
    };

    return <PlaceBottomSheetContext.Provider value={contextValues}>{children}</PlaceBottomSheetContext.Provider>;
};
