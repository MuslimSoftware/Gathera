import { Text, ScrollView, RefreshControl } from 'react-native';
import React from 'react';

interface NoResultsFoundProps {
    searchedItem: string;
    isLoading?: boolean;
    refreshHandler?: () => void;
}

export const NoResultsFound = ({ searchedItem, isLoading, refreshHandler }: NoResultsFoundProps) => {
    return (
        <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={refreshHandler} />}>
            <Text style={{ textAlign: 'center' }}>{`No ${searchedItem} found`}</Text>
        </ScrollView>
    );
};
