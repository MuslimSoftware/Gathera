import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileInfoDetails } from '../../../features/profile/components/Profile/ProfileInfoDetails';
import { GatheringContentContainer } from '../../../features/map/containers/GatheringContentContainer';
import { GatheringSettingsContainer } from '../../../features/map/containers/GatheringSettingsContainer';
import { ProfileViewsDetailsContainer } from '../../../features/profile/containers/ProfileViewsDetailsContainer';
import { GatheringViewsDetailsContainer } from '../../../features/map/containers/GatheringViewsDetailsContainer';
import { ProfileContainer } from '../../../features/profile/containers/ProfileContainer';

const Stack = createNativeStackNavigator();

interface DefaultStackNavigatorProps {
    children: React.ReactNode;
}

export const DefaultStackNavigator = ({ children, ...restProps }: DefaultStackNavigatorProps) => {
    return (
        <Stack.Navigator
            {...restProps}
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            {children}

            <Stack.Screen name='OtherProfile' component={ProfileContainer} />
            <Stack.Screen name='ProfileInfoDetails' component={ProfileInfoDetails} />
            <Stack.Screen name='ProfileViewsDetails' component={ProfileViewsDetailsContainer} />
            <Stack.Screen name='Gathering' component={GatheringContentContainer} />
            <Stack.Screen name='GatheringSettings' component={GatheringSettingsContainer} />
            <Stack.Screen name='GatheringViewsDetails' component={GatheringViewsDetailsContainer} />
        </Stack.Navigator>
    );
};
