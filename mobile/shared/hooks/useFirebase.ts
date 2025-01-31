import Constants from 'expo-constants';

const Analytics =
    Constants.appOwnership !== 'expo'
        ? require('@react-native-firebase/analytics')
        : null;

export const useFirebase = () => {
    const initializeFirebase = async () => {
        if (!Analytics) {
            console.warn('Firebase SDK not available in Expo Go');
            return;
        }

        await Analytics.firebase.initializeApp();
        await Analytics.getAnalytics();
        Analytics.setAnalyticsCollectionEnabled(true);
    };

    return { initializeFirebase };
};

/** 

ANALYTICS OBJECT:

{
    "SDK_VERSION": "19.1.2",
    "default": [Function firebaseModuleWithApp],
    "firebase": {
        "SDK_VERSION": "19.1.2",
        "app": [Function getApp],
        "apps": [[FirebaseApp]],
        "initializeApp": [Function initializeApp],
        "setLogLevel": [Function setLogLevel]
    },
    "getAnalytics": [Function getAnalytics],
    "getAppInstanceId": [Function getAppInstanceId],
    "getSessionId": [Function getSessionId],
    "initiateOnDeviceConversionMeasurementWithEmailAddress": [Function initiateOnDeviceConversionMeasurementWithEmailAddress],
    "initiateOnDeviceConversionMeasurementWithPhoneNumber": [Function initiateOnDeviceConversionMeasurementWithPhoneNumber],
    "logAddPaymentInfo": [Function logAddPaymentInfo],
    "logAddShippingInfo": [Function logAddShippingInfo],
    "logAddToCart": [Function logAddToCart],
    "logAddToWishlist": [Function logAddToWishlist],
    "logAppOpen": [Function logAppOpen],
    "logBeginCheckout": [Function logBeginCheckout],
    "logCampaignDetails": [Function logCampaignDetails],
    "logEarnVirtualCurrency": [Function logEarnVirtualCurrency],
    "logEvent": [Function logEvent],
    "logGenerateLead": [Function logGenerateLead],
    "logJoinGroup": [Function logJoinGroup],
    "logLevelEnd": [Function logLevelEnd],
    "logLevelStart": [Function logLevelStart],
    "logLevelUp": [Function logLevelUp],
    "logLogin": [Function logLogin],
    "logPostScore": [Function logPostScore],
    "logPurchase": [Function logPurchase],
    "logRefund": [Function logRefund],
    "logRemoveFromCart": [Function logRemoveFromCart],
    "logScreenView": [Function logScreenView],
    "logSearch": [Function logSearch],
    "logSelectContent": [Function logSelectContent],
    "logSelectItem": [Function logSelectItem],
    "logSelectPromotion": [Function logSelectPromotion],
    "logSetCheckoutOption": [Function logSetCheckoutOption],
    "logShare": [Function logShare],
    "logSignUp": [Function logSignUp],
    "logSpendVirtualCurrency": [Function logSpendVirtualCurrency],
    "logTutorialBegin": [Function logTutorialBegin],
    "logTutorialComplete": [Function logTutorialComplete],
    "logUnlockAchievement": [Function logUnlockAchievement],
    "logViewCart": [Function logViewCart],
    "logViewItem": [Function logViewItem],
    "logViewItemList": [Function logViewItemList],
    "logViewPromotion": [Function logViewPromotion],
    "logViewSearchResults": [Function logViewSearchResults],
    "resetAnalyticsData": [Function resetAnalyticsData],
    "setAnalyticsCollectionEnabled": [Function setAnalyticsCollectionEnabled],
    "setConsent": [Function setConsent],
    "setDefaultEventParameters": [Function setDefaultEventParameters],
    "setSessionTimeoutDuration": [Function setSessionTimeoutDuration],
    "setUserId": [Function setUserId],
    "setUserProperties": [Function setUserProperties],
    "setUserProperty": [Function setUserProperty]
}
*/
