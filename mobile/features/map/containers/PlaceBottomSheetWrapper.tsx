import { Dimensions, StyleSheet } from 'react-native';
import React, { useCallback } from 'react';
import { DefaultStackNavigator } from '../../../shared/components/Core/DefaultStackNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlaceBottomSheet } from '../components/PlaceBottomSheet';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { getPlaceBottomSheetContextValues } from '../../../shared/context/PlaceBottomSheetContext';
import {
    HANDLE_HEIGHT,
    NAV_BAR_HEIGHT,
    PLACE_BOTTOM_SHEET_HEADER_HEIGHT,
    PLACE_FILTERS_HEIGHT,
    PLACE_ITEMS_GAP,
    PLACE_ITEM_HEIGHT,
    getBottomInset,
} from '../../../shared/utils/uiHelper';
import { Sizes } from '../../../shared/styles/Styles';
import { CreateGatheringContainer } from './CreateGatheringContainer';
import { PlaceSearch } from '../components/PlaceBottomSheet/PlaceSearch';
import { Handle } from '../../../shared/components/Sheets/Handle';
import { PlaceViewsDetailsContainer } from './PlaceViewsDetailsContainer';

const Stack = createNativeStackNavigator();

export const PlaceBottomSheetWrapper = () => {
    const { bottomSheetRef, setBottomSheetCurrentIndex } = getPlaceBottomSheetContextValues();
    const bottomInset = getBottomInset();

    const smallSnapPoint = React.useMemo(
        () => bottomInset + NAV_BAR_HEIGHT + HANDLE_HEIGHT + PLACE_BOTTOM_SHEET_HEADER_HEIGHT,
        [bottomInset, NAV_BAR_HEIGHT, HANDLE_HEIGHT, PLACE_BOTTOM_SHEET_HEADER_HEIGHT]
    );
    const midSnapPoint = React.useMemo(
        () => smallSnapPoint + PLACE_FILTERS_HEIGHT + PLACE_ITEM_HEIGHT,
        [smallSnapPoint, PLACE_FILTERS_HEIGHT, PLACE_ITEM_HEIGHT]
    );
    let fullSnapPoint: number | string = React.useMemo(
        () => midSnapPoint + 2 * PLACE_ITEM_HEIGHT + 2 * PLACE_ITEMS_GAP,
        [midSnapPoint, PLACE_ITEM_HEIGHT, PLACE_ITEMS_GAP]
    );

    const windowHeight = Dimensions.get('window').height;
    if (fullSnapPoint > windowHeight) fullSnapPoint = '90%'; // Fall back to 90% of the screen height if the end snap point is too large

    const snapPoints = React.useMemo(() => [smallSnapPoint, midSnapPoint, fullSnapPoint], [smallSnapPoint, midSnapPoint, fullSnapPoint]);

    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.25} appearsOnIndex={2} disappearsOnIndex={1} pressBehavior='collapse' />,
        []
    );

    return (
        <>
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={1}
                enablePanDownToClose={false}
                enableOverDrag={false}
                enableContentPanningGesture={true}
                handleComponent={(props) => <Handle {...props} style={styles.sheetHandle} />}
                onChange={(index: number) => setBottomSheetCurrentIndex(index)}
                backdropComponent={renderBackdrop}
            >
                <DefaultStackNavigator>
                    <Stack.Screen name='PlaceBottomSheet' component={PlaceBottomSheet} options={{ headerShown: false }} />
                    <Stack.Screen name='PlaceViewsDetails' component={PlaceViewsDetailsContainer} options={{ headerShown: false }} />
                    <Stack.Screen name='CreateGathering' component={CreateGatheringContainer} />
                    <Stack.Screen name='PlaceSearch' component={PlaceSearch} />
                </DefaultStackNavigator>
            </BottomSheet>
        </>
    );
};

const styles = StyleSheet.create({
    sheetHandle: {
        height: HANDLE_HEIGHT,
        borderTopLeftRadius: Sizes.BORDER_RADIUS_LG,
        borderTopRightRadius: Sizes.BORDER_RADIUS_LG,
        justifyContent: 'center',
    },
});
