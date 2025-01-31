import { useEffect } from 'react';
import { getAuthContextValues } from '../context/AuthContext';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
const Purchases = Constants.appOwnership !== 'expo' ? require('react-native-purchases').default : null; // Only import Purchases if not in Expo Go

export const useRevenueCat = () => {
    const {
        user: { _id: user_id },
        setUser,
    } = getAuthContextValues();

    useEffect(() => {
        if (!isPurchasesAvailable()) return;

        // RevenueCat setup
        if (user_id) {
            const initRevenueCat = async () => {
                if (!process.env.EXPO_PUBLIC_REVENUE_CAT_API_KEY_IOS || !process.env.EXPO_PUBLIC_REVENUE_CAT_API_KEY_ANDROID) {
                    console.warn('RevenueCat API key not found in .env file. RevenueCat will not be configured.');
                    return;
                }

                const revenueCatAPIKey =
                    Platform.OS === 'ios'
                        ? process.env.EXPO_PUBLIC_REVENUE_CAT_API_KEY_IOS
                        : Platform.OS === 'android'
                        ? process.env.EXPO_PUBLIC_REVENUE_CAT_API_KEY_ANDROID
                        : '';

                Purchases.configure({ apiKey: revenueCatAPIKey, appUserID: user_id });
            };

            initRevenueCat()
                .then(() => {
                    console.log('RevenueCat configured with user ID: ', user_id);
                })
                .catch((error: any) => {
                    console.log('Error configuring RevenueCat: ', error);
                });
        }
    }, [user_id]);

    const purchaseSubscription = async () => {
        if (!isPurchasesAvailable()) {
            alert('Purchases not available in Expo Go');
            return false;
        }

        try {
            const offerings = await Purchases.getOfferings();
            if (!offerings.current) throw new Error('No offerings available');

            const monthlyPackage = offerings.current.monthly;
            if (!monthlyPackage) throw new Error('No monthly package available');

            const { customerInfo } = await Purchases.purchasePackage(monthlyPackage);
            if (typeof customerInfo.entitlements.active['premium'] !== 'undefined') {
                // Unlock premium content
                setUser({ subscription: 'premium' });
                return true;
            }
        } catch (error: any) {
            console.log('Error purchasing: ', error);
            if (!error.userCancelled) {
                alert('There was an error purchasing the subscription');
                return false;
            }
        }
    };

    const getSubscriptionInfo = async () => {
        if (!isPurchasesAvailable()) return { error: 'Purchases not available in Expo Go' };

        try {
            const customerInfo = await Purchases.getCustomerInfo();
            return customerInfo;
        } catch (error: any) {
            console.log('Error getting subscription info: ', error);
            return {
                error: 'Error getting your subscription information. Restart the app and try again. If this keeps happening, contact support@gathera.ca.',
            };
        }
    };

    return { purchaseSubscription, getSubscriptionInfo };
};

const isPurchasesAvailable = () => {
    if (!Purchases) {
        console.warn('Purchases not available in Expo Go');
        return false;
    }
    return true;
};
