import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { useFacebookSdk } from './useFacebookSdk';
import { useFirebase } from './useFirebase';
import { useEffect } from 'react';

export const useAnalytics = () => {
    useEffect(() => {
        const getTrackingPermission = async () => {
            const { status } = await requestTrackingPermissionsAsync();
            const { initializeSDK } = useFacebookSdk();
            const { initializeFirebase } = useFirebase();

            console.log('Tracking permission status', status);
            if (status === 'granted') {
                initializeSDK();
                initializeFirebase();
            }
        };

        getTrackingPermission();
    }, []);
};
