import { StatusBar, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colours } from '../../../shared/styles/Styles';
import DiscoverPage from './DiscoverPage';
import { TrendingUsersPage } from '../components/TrendingUsersPage';
import { SuggestedGatheringsPage } from '../components/SuggestedGatheringsPage';
import { TrendingPlacesPage } from '../components/TrendingPlacesPage';
import { DefaultStackNavigator } from '../../../shared/components/Core/DefaultStackNavigator';

const Stack = createNativeStackNavigator();

export const DiscoverTab = React.memo(() => {
    return (
        <View style={styles.wrapper}>
            <StatusBar barStyle='dark-content' translucent backgroundColor='transparent' />
            <DefaultStackNavigator>
                <Stack.Screen name='DiscoverPage' component={DiscoverPage} />
                <Stack.Screen name='AllTrendingUsers' component={TrendingUsersPage} />
                <Stack.Screen name='AllSuggestedGatherings' component={SuggestedGatheringsPage} />
                <Stack.Screen name='AllTrendingPlaces' component={TrendingPlacesPage} />
            </DefaultStackNavigator>
        </View>
    );
});

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: Colours.WHITE,
    },
});
