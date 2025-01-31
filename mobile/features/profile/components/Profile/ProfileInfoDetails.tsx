import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ProfileGatheringsList } from './ProfileGatheringsList';
import ProfileFollowersList from './ProfileFollowersList';
import ProfileFollowingList from './ProfileFollowingList';
import { NavigationProp } from '@react-navigation/native';
import { Colours } from '../../../../shared/styles/Styles';
import { HeaderPageLayout } from '../../../../shared/layouts/HeaderPageLayout';

const TopTab = createMaterialTopTabNavigator();

interface ProfileInfoProps {
    navigation: NavigationProp<ReactNavigation.RootParamList>;
    route: any;
}

export const ProfileInfoDetails = ({ route }: ProfileInfoProps) => {
    const { profileId, title } = route.params;

    return (
        <HeaderPageLayout title={title} headerStyle={{ borderBottomWidth: 0 }}>
            <TopTab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: Colours.PRIMARY,
                    tabBarInactiveTintColor: Colours.DARK,
                    tabBarStyle: {
                        backgroundColor: Colours.WHITE,
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: Colours.PRIMARY,
                    },
                }}
            >
                <TopTab.Screen name='Gatherings' component={ProfileGatheringsList} initialParams={{ profileId }} />
                <TopTab.Screen name='Followers' component={ProfileFollowersList} initialParams={{ profileId }} />
                <TopTab.Screen name='Following' component={ProfileFollowingList} initialParams={{ profileId }} />
            </TopTab.Navigator>
        </HeaderPageLayout>
    );
};
