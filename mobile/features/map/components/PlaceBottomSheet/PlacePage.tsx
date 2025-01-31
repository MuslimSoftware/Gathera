import { StyleSheet, View } from 'react-native';
import React from 'react';
import { PlaceImageList } from '../../containers/PlaceImageList';
import { PlaceGatheringList } from '../../containers/PlaceGatheringList';
import { PlaceLikesList } from '../../containers/PlaceLikesList';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { PlacePageTabBar } from './PlacePageTabBar';
import { PlacePageActionButtons } from './PlacePageActionButtons';

const Tab = createMaterialTopTabNavigator();

interface PlacePageProps {
    place: any;
    isInterested: boolean;
    toggleIsInterested: () => void;
    navigateToInfo: () => void;
    fetchUsers: () => void;
    interestedUsers: any[];
    isLoading: boolean;
    refresh: () => void;
}

export const PlacePage = ({
    place,
    isInterested,
    toggleIsInterested,
    navigateToInfo,
    fetchUsers,
    interestedUsers,
    isLoading,
    refresh,
}: PlacePageProps) => {
    return (
        <View style={styles.globalWrapper}>
            <PlacePageActionButtons
                navigateToInfo={navigateToInfo}
                toggleIsInterested={toggleIsInterested}
                placeId={place._id}
                isInterested={isInterested}
            />
            <Tab.Navigator tabBar={(props) => <PlacePageTabBar {...props} />} screenOptions={{ lazy: true }}>
                <Tab.Screen name='Photos'>{() => <PlaceImageList placeId={place._id} />}</Tab.Screen>
                <Tab.Screen name='Gatherings'>{() => <PlaceGatheringList placeId={place._id} />}</Tab.Screen>
                <Tab.Screen name='Likes'>
                    {() => <PlaceLikesList fetchUsers={fetchUsers} interestedUsers={interestedUsers} isLoading={isLoading} refresh={refresh} />}
                </Tab.Screen>
            </Tab.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    globalWrapper: {
        flex: 1,
    },
});
