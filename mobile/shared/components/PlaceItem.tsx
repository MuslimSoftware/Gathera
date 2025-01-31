import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { Colours, Sizes } from '../styles/Styles';
import { PROFILE_PIC_SIZES } from './MainPictures/ProfilePicture';
import { RatingStars } from './RatingStars';
import { PriceLevel } from './PriceLevel';
import { PLACE_ITEM_HEIGHT } from '../utils/uiHelper';
import { PressableImage } from './Core/PressableImage';
import { useNavigate } from '../hooks/useNavigate';
import { LoadingSkeleton } from './Core/LoadingSkeleton';
import { IPlace } from '../../types/Place';
import { PlaceItemFormat } from './PlaceList';
import { GroupIcon } from './Core/Icons';
import { PlacePicture } from './MainPictures/PlacePicture';

interface PlaceItemProps {
    place: IPlace;
    format?: PlaceItemFormat;
}

const areEqual = (prevProps: PlaceItemProps, nextProps: PlaceItemProps) => {
    return prevProps.place._id === nextProps.place._id && prevProps.format === nextProps.format;
};

export const PlaceItem = React.memo(({ place, format = 'full' }: PlaceItemProps) => {
    const { navigateToPlaceMarker } = useNavigate();

    if (!place) return <PlaceItemSkeleton />;

    const onHeaderPress = () => {
        navigateToPlaceMarker(place._id);
    };

    const isCompact = format === 'compact';
    const photos = place.photos ?? [];
    return (
        <View style={[styles.placeItem, isCompact && { height: PLACE_ITEM_HEIGHT - 110, paddingHorizontal: 5 }]}>
            <Pressable style={styles.placeItemHeader} onPress={onHeaderPress}>
                <View style={styles.headerLeft}>
                    <PlacePicture uri={place.default_photo} />
                    <View style={styles.placeItemTextContainer}>
                        <Text style={styles.placeNameText} numberOfLines={1}>
                            {place.name}
                        </Text>
                        <View style={styles.placeDetails}>
                            <RatingStars rating={place.rating!} ratingCount={place.rating_count} size={12} />
                            {place.price_level && (
                                <>
                                    <Text>•</Text>
                                    <PriceLevel priceLevel={place.price_level} />
                                </>
                            )}
                        </View>
                    </View>
                </View>
                {!!place.gathering_count && place.gathering_count > 0 && (
                    <View style={styles.headerRight}>
                        <GroupIcon />
                        <Text>{place.gathering_count}</Text>
                    </View>
                )}
            </Pressable>
            {!isCompact && (
                <View style={styles.placeImages}>
                    {photos.map((url: string, index: number) => {
                        const borderStyle = index === 0 ? styles.placeImage0 : index === 1 ? styles.placeImage1 : styles.placeImage2;

                        return <PressableImage key={url} url={url} style={[styles.placeImage, borderStyle]} />;
                    })}
                    {photos.length < 3 &&
                        [...Array(3 - photos.length)].map((_, index) => {
                            const newIndex = photos.length + index;
                            const borderStyle = newIndex === 0 ? styles.placeImage0 : newIndex === 1 ? styles.placeImage1 : styles.placeImage2;

                            return <View key={place._id + index} style={[styles.placeImage, borderStyle]} />;
                        })}
                </View>
            )}
        </View>
    );
}, areEqual);

export const PlaceItemSkeleton = React.memo(({ style, format = 'full' }: { style?: any; format?: PlaceItemFormat }) => {
    const isCompact = format === 'compact';
    return (
        <View style={[styles.placeItem, style && style, isCompact && { height: PLACE_ITEM_HEIGHT - 110 }]}>
            <View style={styles.placeItemHeader}>
                <LoadingSkeleton style={{ ...PROFILE_PIC_SIZES.small, borderRadius: Sizes.BORDER_RADIUS_FULL }} />
                <View style={styles.placeItemTextContainer}>
                    <LoadingSkeleton style={styles.placeNameSkeleton} />

                    {/* <Text style={styles.placeNameText}>Loading...</Text> */}
                    <View style={styles.placeDetails}>
                        {/* <RatingStars rating={0} ratingCount={0} size={12} /> */}
                        {/* <Text>•</Text> */}
                        {/* <PriceLevel priceLevel={0} /> */}
                    </View>
                </View>
            </View>
            {!isCompact && (
                <View style={styles.placeImages}>
                    <View style={[styles.placeImage, styles.placeImage0]}>
                        <LoadingSkeleton style={styles.flex} />
                    </View>
                    <View style={[styles.placeImage, styles.placeImage1]}>
                        <LoadingSkeleton style={styles.flex} />
                    </View>
                    <View style={[styles.placeImage, styles.placeImage2]}>
                        <LoadingSkeleton style={styles.flex} />
                    </View>
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    placeNameSkeleton: {
        width: '40%',
        height: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
    },
    placeItem: {
        width: '100%',
        height: PLACE_ITEM_HEIGHT,
        paddingHorizontal: 15,
        justifyContent: 'space-between',
    },
    placeItemHeader: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5,
        width: '80%',
    },
    headerRight: { height: '100%', width: '20%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 5 },
    placeNameText: {
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: '600',
        maxWidth: '90%',
    },
    placeItemTextContainer: {
        width: '80%',
        justifyContent: 'flex-start',
        gap: 2,
    },
    placeDetails: {
        flexDirection: 'row',
        gap: 5,
    },
    placeImages: {
        width: '100%',
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    placeImage: {
        width: '33.1%',
        height: 110,
        backgroundColor: Colours.GRAY_LIGHT,
    },
    placeImage0: {
        borderTopLeftRadius: Sizes.BORDER_RADIUS_MD,
        borderBottomLeftRadius: Sizes.BORDER_RADIUS_MD,
    },
    placeImage1: {},
    placeImage2: {
        borderTopRightRadius: Sizes.BORDER_RADIUS_MD,
        borderBottomRightRadius: Sizes.BORDER_RADIUS_MD,
    },
});
