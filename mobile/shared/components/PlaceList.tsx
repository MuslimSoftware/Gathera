import React from 'react';
import { StyleSheet } from 'react-native';
import { PaginatedList, PaginatedListProps } from './Core/PaginatedList';
import { PLACE_ITEMS_GAP, getNavigationBarBottomPadding } from '../utils/uiHelper';
import { PlaceItem, PlaceItemSkeleton } from './PlaceItem';

export type PlaceItemFormat = 'full' | 'compact';

type OmittedPaginatedListProps = Omit<
    Omit<Omit<Omit<PaginatedListProps, 'renderSkeletonItem'>, 'renderItem'>, 'dataName'>,
    'numSkeletonItemsToRender'
>;
interface PlaceListProps extends OmittedPaginatedListProps {
    format?: PlaceItemFormat;
    enableBottomPadding?: boolean;
}

export const PlaceList = ({ format = 'full', enableBottomPadding = false, ...props }: PlaceListProps) => {
    const bottomPadding = getNavigationBarBottomPadding() + 10;

    return (
        <PaginatedList
            {...props}
            renderItem={({ item }) => <PlaceItem place={item} format={format} />}
            renderSkeletonItem={() => <PlaceItemSkeleton format={format} />}
            numSkeletonItemsToRender={5}
            contentContainerStyle={[
                format === 'compact' ? styles.compactContainer : styles.fullContainer,
                props.contentContainerStyle && props.contentContainerStyle,
                enableBottomPadding && { paddingBottom: bottomPadding },
            ]}
            dataName='places'
        />
    );
};

const styles = StyleSheet.create({
    compactContainer: {
        gap: 5,
    },
    fullContainer: {
        gap: PLACE_ITEMS_GAP,
    },
});
