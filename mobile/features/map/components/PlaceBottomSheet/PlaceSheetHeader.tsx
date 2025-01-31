import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { CloseIcon, SearchIcon } from '../../../../shared/components/Core/Icons';
import { Colours, Sizes } from '../../../../shared/styles/Styles';
import { RatingStars } from '../../../../shared/components/RatingStars';
import { PriceLevel } from '../../../../shared/components/PriceLevel';
import { useNavigate } from '../../../../shared/hooks/useNavigate';
import { PLACE_BOTTOM_SHEET_HEADER_HEIGHT } from '../../../../shared/utils/uiHelper';
import { GATHERING_CAROUSEL_WIDTH, GatheringCarousel } from './GatheringCarousel';
import { ViewsIndicator } from '../../../../shared/components/Core/Views/ViewsIndicator';
import { getMapContextValues } from '../../../../shared/context/MapContext';
import { PlacePicture } from '../../../../shared/components/MainPictures/PlacePicture';

export const PlaceSheetHeader = () => {
    const { selectedPlace, setSelectedPlaceId } = getMapContextValues();
    const { snapBottomSheetToIndex, navigateToPlaceMarker, navigateToScreen } = useNavigate();

    const onClosePress = () => {
        navigateToScreen('PlaceNavigationPage');
        setSelectedPlaceId(undefined);
    };

    const onSearchPress = () => {
        snapBottomSheetToIndex(2);
        navigateToScreen('PlaceSearch');
    };

    const HeaderContent = selectedPlace ? (
        <>
            <PlacePicture size={'medium'} uri={selectedPlace.default_photo ?? ''} />
            <View style={styles.headerLeftText}>
                <Text style={styles.headerTextHeader} numberOfLines={1}>
                    {selectedPlace.name}
                </Text>
                <View style={styles.subHeaderLabels}>
                    {selectedPlace.rating && (
                        <RatingStars rating={selectedPlace.rating} ratingCount={selectedPlace.rating_count} size={15} color={Colours.PRIMARY} />
                    )}
                    {selectedPlace.price_level && <PriceLevel priceLevel={selectedPlace.price_level} />}
                </View>
            </View>
        </>
    ) : (
        <GatheringCarousel />
    );

    const onHeaderPress = () => {
        if (selectedPlace) {
            navigateToPlaceMarker(selectedPlace._id);
        }
    };

    return (
        <View style={styles.header}>
            <Pressable style={[styles.headerLeft, { width: selectedPlace ? '75%' : GATHERING_CAROUSEL_WIDTH }]} onPress={onHeaderPress}>
                {HeaderContent}
            </Pressable>
            <View style={styles.actionsWrapper}>
                {selectedPlace && (
                    <>
                        <ViewsIndicator
                            count={selectedPlace.view_count!}
                            onPress={() => navigateToScreen('PlaceViewsDetails', { placeId: selectedPlace._id, viewCount: selectedPlace.view_count })}
                        />
                        <CloseIcon size={30} onPress={onClosePress} />
                    </>
                )}
                {!selectedPlace && <SearchIcon size={25} onPress={onSearchPress} />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: PLACE_BOTTOM_SHEET_HEADER_HEIGHT,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLeftText: {
        marginLeft: 10,
    },
    headerTextHeader: {
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: 'bold',
        maxWidth: '90%',
    },
    subHeaderLabels: {
        width: '100%',
    },
    actionsWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 10,
    },
});
