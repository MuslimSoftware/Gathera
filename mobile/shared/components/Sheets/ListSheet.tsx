import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import SearchBar from '../../../features/discover/components/SearchBar';
import GorhomBottomSheet from './GorhomBottomSheet';
import { Colours, Sizes } from '../../styles/Styles';
import { getNavigationBarBottomPadding } from '../../utils/uiHelper';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';

interface ListSheetProps {
    setShowSheet: (show: boolean) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    title?: string;
    flatListData: {
        data: any[];
        renderItem: any;
        keyExtractor: (item: any) => string;
        onEndReached: () => void;
        onEndReachedThreshold: number;
        RefreshControl: any; // <RefreshControl refreshing={isLoading} onRefresh={fetchNotifications} />
    };
    isEmpty: boolean;
    emptyText: string;
    enableDrag?: boolean;
}

export const ListSheet = ({
    setShowSheet,
    title = '',
    searchQuery,
    setSearchQuery,
    flatListData,
    isEmpty,
    emptyText,
    enableDrag = false,
}: ListSheetProps) => {
    const endReached = () => {
        if (flatListData.data.length < 6) return;
        flatListData.onEndReached();
    };

    const EmptyList = () => {
        return (
            <View style={styles.emptyList}>
                <Text style={styles.emptyListText}>{emptyText}</Text>
            </View>
        );
    };

    const isListEmpty = false;

    const data = isListEmpty ? [{ _id: 'empty' }] : flatListData.data;
    const renderItem = isListEmpty ? EmptyList : flatListData.renderItem;

    return (
        <GorhomBottomSheet setShowSheet={setShowSheet} title={title} disableDrag={!enableDrag} enableContentPanningGesture>
            {!isEmpty && <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
            {!isListEmpty && (
                <BottomSheetFlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={flatListData.keyExtractor}
                    onEndReached={endReached}
                    onEndReachedThreshold={flatListData.onEndReachedThreshold}
                    indicatorStyle='black'
                    contentContainerStyle={{ padding: 10, paddingBottom: getNavigationBarBottomPadding() }}
                    refreshControl={flatListData.RefreshControl}
                />
            )}
            {isListEmpty && <EmptyList />}
        </GorhomBottomSheet>
    );
};

const styles = StyleSheet.create({
    emptyList: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10,
        marginTop: 50,
    },
    emptyListText: {
        color: Colours.GRAY,
        fontSize: Sizes.FONT_SIZE_MD,
        textAlign: 'center',
    },
});
