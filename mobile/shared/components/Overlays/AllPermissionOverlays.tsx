import React, { useEffect } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { getDistanceBetweenCoordsMeters } from '../../utils/LocationUtils';
import { LOCATION_NOT_ALLOWED_KEY, LocationNotAllowedOverlay } from './LocationNotAllowedOverlay';
import { LocationPermissionsOverlay } from './LocationPermissionsOverlay';
import { PUSH_NOTIFICATION_PERMISSIONS_KEY, PushNotificationPermissionsOverlay } from './PushNotificationPermissionsOverlay';
import { useAsyncStorage } from '../../hooks/useAsyncStorage';

export const AllPermissionOverlays = () => {
    const [isInitialLoading, setIsInitialLoading] = React.useState<boolean>(true);
    const [locationPermission, setLocationPermission] = React.useState<boolean>(true);
    const [pushNotificationPermission, setPushNotificationPermission] = React.useState<boolean>(true);
    const [isInSupportedRegion, setIsInSupportedRegion] = React.useState<boolean>(true);

    const { item: hasRespondedPushNotificationPermissions, isInitialLoading: isPushNotificationInitialLoading } = useAsyncStorage<boolean>(
        PUSH_NOTIFICATION_PERMISSIONS_KEY,
        false
    );

    const { item: hasRespondedLocationNotAllowed, isInitialLoading: isLocationInitialLoading } = useAsyncStorage<boolean>(
        LOCATION_NOT_ALLOWED_KEY,
        false
    );

    useEffect(() => {
        const getLocationPermission = async () => {
            let { status } = await Location.getForegroundPermissionsAsync().catch(() => ({ status: 'denied' }));
            setLocationPermission(status === 'granted');
        };

        const getNotificationPermission = async () => {
            const { status } = await Notifications.getPermissionsAsync().catch(() => ({ status: 'denied' }));
            setPushNotificationPermission(status === 'granted');
        };

        const checkIfInSupportedRegion = async () => {
            let { status } = await Location.getForegroundPermissionsAsync().catch(() => ({ status: 'denied' }));
            if (status !== 'granted') return; // The user has not granted location permissions --> can't check if in supported region

            const MONTREAL_COORDS = { latitude: 45.54021, longitude: -73.67868 }; // TODO: Temporary
            const MAX_RADIUS_METERS = 21786; // TODO: Temporary

            const position = await Location.getLastKnownPositionAsync().catch(() => ({ coords: MONTREAL_COORDS }));
            const coords = position?.coords ?? MONTREAL_COORDS;
            const isInSupportedRegion = getDistanceBetweenCoordsMeters(coords, MONTREAL_COORDS) <= MAX_RADIUS_METERS;

            // console.log('Montreal coords', MONTREAL_COORDS);
            // console.log('User coords', coords);
            // console.log('Distance between coords', getDistanceBetweenCoordsMeters(coords, MONTREAL_COORDS));
            // console.log('Is in supported region', isInSupportedRegion);

            setIsInSupportedRegion(isInSupportedRegion);
        };

        const getAllPermissions = async () => {
            await getLocationPermission();
            await getNotificationPermission();
            await checkIfInSupportedRegion();
            setIsInitialLoading(false);
        };

        getAllPermissions();
    }, []);

    // Don't show any overlays if anything is loading
    if (isInitialLoading || isPushNotificationInitialLoading || isLocationInitialLoading) return <></>;

    // If no location permission, show the location permission overlay
    if (!locationPermission && !hasRespondedLocationNotAllowed)
        return <LocationPermissionsOverlay visible={!locationPermission} dismiss={() => setLocationPermission(true)} />;

    // If no push notification permission AND the user has never responded to the overlay, show the push notification permission overlay
    if (!pushNotificationPermission && !hasRespondedPushNotificationPermissions)
        return <PushNotificationPermissionsOverlay visible={!pushNotificationPermission} dismiss={() => setPushNotificationPermission(true)} />;

    // If not in supported region AND the user has never responded to the overlay, show the location not allowed overlay
    if (!isInSupportedRegion && !hasRespondedLocationNotAllowed)
        return <LocationNotAllowedOverlay visible={!isInSupportedRegion} dismiss={() => setIsInSupportedRegion(true)} />;

    return <></>;
};
