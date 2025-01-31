import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Colours } from '../../../shared/styles/Styles';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { SearchContextProvider } from '../context/SearchContext';
import { Search } from '../components/Search';
import { SearchUserResults } from '../components/SearchUserResults';
import { SearchGatheringResults } from '../components/SearchGatheringResults';
import { SearchPlaceResults } from '../components/SearchPlaceResults';

const TopTab = createMaterialTopTabNavigator();

export const SearchPage = () => {
    return (
        <SearchContextProvider>
            <HeaderPageLayout title={<Search />} hasHeaderPadding={false}>
                <KeyboardAvoidingView behavior='height' style={styles.wrapper} keyboardVerticalOffset={Platform.OS === 'ios' ? 55 : 0}>
                    <TopTab.Navigator
                        initialRouteName='UserSearchResult'
                        screenOptions={{
                            tabBarIndicatorStyle: { backgroundColor: Colours.PRIMARY },
                            tabBarStyle: { backgroundColor: Colours.WHITE },
                            tabBarActiveTintColor: Colours.PRIMARY,
                            tabBarInactiveTintColor: Colours.GRAY,
                            lazy: true,
                        }}
                    >
                        <TopTab.Screen name='UserSearchResult' options={{ title: 'Users' }} component={SearchUserResults} />
                        <TopTab.Screen
                            name='GatheringSearchResult'
                            options={{ title: 'Gatherings', lazy: true }}
                            component={SearchGatheringResults}
                        />
                        <TopTab.Screen name='PlaceSearchResult' options={{ title: 'Places', lazy: true }} component={SearchPlaceResults} />
                    </TopTab.Navigator>
                </KeyboardAvoidingView>
            </HeaderPageLayout>
        </SearchContextProvider>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
});
