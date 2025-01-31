import React from 'react';
import { Settings } from '../components/Settings';
import { Notifications } from '../components/screens/Notifications';
import { Theme } from '../components/screens/Theme';
import { Account } from '../components/screens/Account';
import { Follows } from '../components/screens/Notifications/Follows';
import { Messages } from '../components/screens/Notifications/Messages';
import { Invites } from '../components/screens/Notifications/Invites';
import { Gatherings } from '../components/screens/Notifications/Gatherings';
import { Promotional } from '../components/screens/Notifications/Promotional';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ManageSubscription } from '../../subscription/components/ManageSubscription';

const Stack = createNativeStackNavigator();

export const SettingsContainer = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name='SettingsList' component={Settings} />

            <Stack.Screen name='NotificationsSettings' component={Notifications} />
            <Stack.Screen name='Theme' component={Theme} />
            <Stack.Screen name='Account' component={Account} />
            <Stack.Screen name='ManageSubscription' component={ManageSubscription} />

            <Stack.Screen name='NotificationsFollows' component={Follows} />
            <Stack.Screen name='NotificationsMessages' component={Messages} />
            <Stack.Screen name='NotificationsInvites' component={Invites} />
            <Stack.Screen name='NotificationsGatherings' component={Gatherings} />
            <Stack.Screen name='NotificationsPromo' component={Promotional} />
        </Stack.Navigator>
    );
};
