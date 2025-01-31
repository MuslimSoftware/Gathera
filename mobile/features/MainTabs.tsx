import React from 'react';
import { BottomTabNavigationBar } from '../shared/components/Core/BottomTabNavigationBar';
import { MapTab } from './map/components/MapTab';
import { DiscoverTab } from './discover/containers/DiscoverTab';
import { NotificationsStack } from './notifications/containers/NotificationsStack';
import { UserProfileTab } from './profile/containers/UserProfileTab';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MAP_TAB_SCREEN_NAME, DISCOVER_TAB_SCREEN_NAME, NOTIFICATIONS_TAB_SCREEN_NAME, PROFILE_TAB_SCREEN_NAME } from '../shared/hooks/useNavigate';

const BottomTabNavigator = createBottomTabNavigator();

export const MainTabs = () => {
    return (
        <BottomTabNavigator.Navigator tabBar={(props) => <BottomTabNavigationBar {...props} />} screenOptions={{ headerShown: false }}>
            <BottomTabNavigator.Screen name={MAP_TAB_SCREEN_NAME} component={MapTab} />
            <BottomTabNavigator.Screen name={DISCOVER_TAB_SCREEN_NAME} component={DiscoverTab} />
            <BottomTabNavigator.Screen name={NOTIFICATIONS_TAB_SCREEN_NAME} component={NotificationsStack} />
            <BottomTabNavigator.Screen name={PROFILE_TAB_SCREEN_NAME} component={UserProfileTab} />
        </BottomTabNavigator.Navigator>
    );
};
