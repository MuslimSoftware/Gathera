import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../../../../types/View';
import { PaginatedList } from '../PaginatedList';
import { UserListItemSkeleton } from '../../ListItems/UserListItem';
import { ViewItem } from './ViewItem';
import { getNavigationBarBottomPadding } from '../../../utils/uiHelper';

interface Props {
    views: Array<View>;
    isLoading: boolean;
    error: string | null | undefined;
    loadMore: () => void;
    refresh: () => void;
}

export const ViewsDetails = ({ views, isLoading, error, loadMore, refresh }: Props) => {
    const bottomPadding = getNavigationBarBottomPadding() + 10;
    return (
        <PaginatedList
            contentContainerStyle={{ ...styles.wrapper, paddingBottom: bottomPadding }}
            data={views}
            error={error}
            isLoading={isLoading}
            numSkeletonItemsToRender={9}
            renderItem={({ item }) => <ViewItem view={item} />}
            renderSkeletonItem={UserListItemSkeleton}
            onEndReached={loadMore}
            refresh={refresh}
            dataName='views'
        />
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        gap: 5,
    },
});
