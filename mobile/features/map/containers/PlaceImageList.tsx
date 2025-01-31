import { StyleSheet, View } from 'react-native';
import React from 'react';
import { usePhotos } from '../hooks/usePhotos';
import { getNavigationBarBottomPadding } from '../../../shared/utils/uiHelper';
import { PressableImage } from '../../../shared/components/Core/PressableImage';
import { PaginatedList } from '../../../shared/components/Core/PaginatedList';
import { LoadingSkeleton } from '../../../shared/components/Core/LoadingSkeleton';

interface PlaceImageListProps {
    placeId: string;
}

export const PlaceImageList = React.memo(({ placeId }: PlaceImageListProps) => {
    const { photos, fetchPhotos, error, isLoading, refresh } = usePhotos(placeId);
    const bottomInset = getNavigationBarBottomPadding();
    return (
        <PaginatedList
            data={photos}
            isLoading={isLoading}
            refresh={refresh}
            renderItem={({ item }: any) => <PlacePhoto url={item.url} />}
            onEndReached={fetchPhotos}
            renderSkeletonItem={PlacePhotoSkeleton}
            numSkeletonItemsToRender={12}
            error={error}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={[styles.container, { paddingBottom: bottomInset }]}
        />
    );
});

const PlacePhoto = React.memo(
    ({ url }: { url: string }) => {
        return (
            <View style={styles.imageWrapper}>
                <PressableImage url={url} style={styles.image} />
            </View>
        );
    },
    (prevProps, nextProps) => prevProps.url === nextProps.url
);

const PlacePhotoSkeleton = () => {
    return (
        <View style={styles.imageWrapper}>
            <LoadingSkeleton style={styles.image} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 1.5,
    },
    columnWrapper: {
        gap: 1.5,
    },
    imageWrapper: {
        width: '33.2%',
        height: 125,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 0,
    },
});
