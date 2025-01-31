import React from 'react';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { FlatListProps, View, StyleSheet } from 'react-native';
import { NoResultsFound } from '../../../features/discover/components/NoResultsFound';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { ListRenderItemInfo } from 'react-native/Libraries/Lists/VirtualizedList';
import { ErrorMessage } from '../ErrorMessage';

export interface PaginatedListProps extends FlatListProps<any> {
    isLoading: boolean; // Whether or not the data is loading
    error?: string | null; // The error message to display if there is an error
    renderSkeletonItem: (item: any) => JSX.Element; // The skeleton component to render when isLoading is true
    numSkeletonItemsToRender?: number; // This is the number of skeleton items to render when isLoading is true (try to keep this number low)
    numFooterSkeletonItemsToRender?: number; // This is the number of skeleton items to render in the footer when isLoading is true (try to keep this number low)
    refresh?: () => void; // This is the function to call when the user pulls down to refresh
    maxDataItemsToRender?: number; // This is the max number of data items to render if it is a preview list
    dataName?: string; // This is the name of the data (e.g. 'places', 'events', 'users', etc.) to be displayed when there are no results
    shouldUseGorhomFlatList?: boolean; // Whether or not to use the Gorhom Bottom Sheet FlatList
}

/**
 * This is a wrapper around the FlatList component that handles loading, error, and skeleton states.
 *
 * **Required props:** data, isLoading, renderItem, renderSkeletonItem
 *
 * **Note:** All items are assumed to have an _id field.
 */
export const PaginatedList = ({
    isLoading,
    error,
    renderSkeletonItem,
    refresh,
    maxDataItemsToRender,
    numSkeletonItemsToRender = 5,
    numFooterSkeletonItemsToRender = 3,
    dataName = 'data',
    shouldUseGorhomFlatList = false,
    ...props
}: PaginatedListProps) => {
    let data: any[] = props.data as any[];
    if (!data) return null;
    if (isLoading && data.length === 0) {
        const skeletonData = Array.from({ length: numSkeletonItemsToRender }).map((_, i) => {
            return { _id: `skeleton-${i}` };
        });
        data = data.concat(skeletonData);
    }

    const renderItem = (params: ListRenderItemInfo<any>) => {
        const { item } = params;
        if (item._id === 'error') return <ErrorMessage message={error} />;
        if (item._id === 'no_data') return <NoResultsFound searchedItem={dataName} refreshHandler={refresh} isLoading={isLoading} />;
        return item._id.startsWith('skeleton') ? renderSkeletonItem(item) : props.renderItem ? props.renderItem(params) : null;
    };

    if (error) data = [{ _id: 'error' }];
    if (!isLoading && data.length === 0) data = [{ _id: 'no_data' }];
    if (maxDataItemsToRender !== undefined) {
        return (
            <View style={[styles.container, props.contentContainerStyle]}>
                {data.slice(0, maxDataItemsToRender).map((item: any, index: number) => (
                    <React.Fragment key={item._id}>{renderItem({ item, index, separators: nullSeparators })}</React.Fragment>
                ))}
            </View>
        );
    }

    const defaultKeyExtractor = (item: any) => {
        if (item && item._id) return item._id;
        return Math.random().toString();
    };

    const renderListFooter = () => {
        if (!isLoading) return null; // If it is not loading --> Do not show the loading footer component
        if (data.length > 0 && data[0]._id.startsWith('skeleton')) return null; // Skeletons are visible --> Do not show the loading footer component
        if (error) return null; // If there is an error --> Do not show the loading footer component
        if (!props.onEndReached) return null; // If there is no onEndReached prop --> Do not show the loading footer component
        if (props.ListFooterComponent) return props.ListFooterComponent; // If there is a custom ListFooterComponent --> Show it

        const skeletonItemsToRender = Array.from({ length: numFooterSkeletonItemsToRender }).map((_, i) => {
            return { _id: `skeleton-footer-${i}` };
        });

        return (
            <View style={props.contentContainerStyle}>
                {skeletonItemsToRender.map((item: any, index: number) => (
                    <React.Fragment key={item._id}>{renderItem({ item, index, separators: nullSeparators })}</React.Fragment>
                ))}
            </View>
        );
    };

    const FlatListComponent = shouldUseGorhomFlatList ? BottomSheetFlatList : FlatList;

    const onEndReached = (params: any) => {
        if (props.onEndReached && !error) props.onEndReached(params);
    };

    return (
        <FlatListComponent
            {...props}
            onEndReached={onEndReached}
            style={[styles.container, props.style]}
            data={data}
            renderItem={(params) => <React.Fragment key={params.item._id}>{renderItem(params)}</React.Fragment>}
            keyExtractor={props.keyExtractor ? props.keyExtractor : defaultKeyExtractor}
            onEndReachedThreshold={props.onEndReachedThreshold !== undefined ? props.onEndReachedThreshold : 0.5}
            showsVerticalScrollIndicator={props.showsVerticalScrollIndicator !== undefined ? props.showsVerticalScrollIndicator : true}
            scrollIndicatorInsets={props.scrollIndicatorInsets !== undefined ? props.scrollIndicatorInsets : { right: 1 }}
            refreshControl={props.refreshControl ? props.refreshControl : <RefreshControl refreshing={false} onRefresh={refresh} />}
            ListFooterComponent={renderListFooter()}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});

const nullSeparators = {
    highlight: () => {},
    unhighlight: () => {},
    updateProps: () => {},
};
