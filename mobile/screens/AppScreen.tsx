import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { MainTabs } from '../features/MainTabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { Inbox } from '../features/inbox/containers/Inbox';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colours } from '../shared/styles/Styles';
import { getPlaceBottomSheetContextValues } from '../shared/context/PlaceBottomSheetContext';
import { NotificationProvider } from '../features/notifications/context/NotificationContext';
import { SubscriptionContainer } from '../features/subscription/containers/SubscriptionContainer';
import { PlaceInformationContainer } from '../features/map/containers/PlaceInformationContainer';
import { TOAST_CONFIG } from '../shared/utils/uiHelper';
import { SettingsContainer } from '../features/settings/containers/SettingsContainer';
import { PushNotification } from '../shared/components/PushNotification';
import { getMapContextValues } from '../shared/context/MapContext';
import { PlacesErrorOverlay } from '../shared/components/Overlays/PlacesErrorOverlay';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { AllPermissionOverlays } from '../shared/components/Overlays/AllPermissionOverlays';
import { useRevenueCat } from '../shared/hooks/useRevenueCat';
import { SubscriptionPurchased } from '../features/subscription/components/SubscriptionPurchased';
import Feedback from '../features/settings/components/screens/Feedback';

const navTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: Colours.WHITE }
};

const Stack = createNativeStackNavigator();

const AppScreen = () => {
    const { placesError, refreshPlaces } = getMapContextValues();
    const { appNavigationContainerRef } = getPlaceBottomSheetContextValues();

    useRevenueCat();

    useEffect(() => {
        const getLocationPermission = async () => {
            let { status } = await Location.getForegroundPermissionsAsync().catch(() => ({
                status: 'denied'
            }));
            if (status === 'granted') return;

            const { status: newStatus } = await Location.requestForegroundPermissionsAsync().catch(() => ({ status: 'denied' }));
        };

        const getNotificationPermission = async () => {
            const { status } = await Notifications.getPermissionsAsync().catch(() => ({ status: 'denied' }));
            if (status === 'granted') return;

            const { status: newStatus } = await Notifications.requestPermissionsAsync().catch(() => ({
                status: 'denied'
            }));
        };

        const getAllPermissions = async () => {
            await getLocationPermission();
            await getNotificationPermission();
        };

        getAllPermissions();
    }, []);

    return (
        <NotificationProvider>
            <PushNotification />
            {placesError && <PlacesErrorOverlay onRetry={refreshPlaces} />}
            {/* <AllPermissionOverlays /> */}
            <NavigationContainer theme={navTheme} ref={appNavigationContainerRef}>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        animation: 'slide_from_right'
                    }}
                    initialRouteName="MainTabs"
                >
                    <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
                    <Stack.Screen name="PlaceInfo" component={PlaceInformationContainer} options={{ headerShown: false }} />
                    <Stack.Screen name="Inbox" component={Inbox} options={{ headerShown: false }} />
                    <Stack.Screen name="Settings" component={SettingsContainer} options={{ headerShown: false }} />
                    <Stack.Screen name="Feedback" component={Feedback} options={{ headerShown: false }} />

                    <Stack.Screen name="Subscription" component={SubscriptionContainer} options={{ headerShown: false }} />
                    <Stack.Screen name="SubscriptionPurchased" component={SubscriptionPurchased} options={{ headerShown: false }} />
                </Stack.Navigator>
                <Toast config={TOAST_CONFIG} />
            </NavigationContainer>
        </NotificationProvider>
    );
};

export default AppScreen;
