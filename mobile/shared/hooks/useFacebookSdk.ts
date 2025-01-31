import Constants from 'expo-constants';

const FacebookSDK =
    Constants.appOwnership !== 'expo'
        ? require('react-native-fbsdk-next')
        : null;

export const useFacebookSdk = () => {
    const initializeSDK = async () => {
        if (!FacebookSDK) {
            console.warn('Facebook SDK not available in Expo Go');
            return;
        }

        await FacebookSDK.Settings.initializeSDK();
        FacebookSDK.Settings.setAdvertiserTrackingEnabled(true);
        FacebookSDK.Settings.setAutoLogAppEventsEnabled(true);
        FacebookSDK.Settings.setAdvertiserIDCollectionEnabled(true);
    };

    return { initializeSDK };
};

/* FACEBOOK SDK OBJECT:
    {
        "AEMReporterIOS": {
            "logAEMEvent": [Function logAEMEvent]
        },
        "AccessToken": [Function FBAccessToken],
        "AccessTokenMap": undefined,
        "AppEvent": undefined,
        "AppEventParam": undefined,
        "AppEventsFlushBehavior": undefined,
        "AppEventsLogger": {
            "AppEventParams": {
                "AddType": "ad_type",
                "Content": "fb_content",
                "ContentID": "fb_content_id",
                "ContentType": "fb_content_type",
                "Currency": "fb_currency",
                "Description": "fb_description",
                "Level": "fb_level",
                "MaxRatingValue": "fb_max_rating_value",
                "NumItems": "fb_num_items",
                "OrderId": "fb_order_id",
                "PaymentInfoAvailable": "fb_payment_info_available",
                "RegistrationMethod": "fb_registration_method",
                "SearchString": "fb_search_string",
                "Success": "fb_success",
                "ValueNo": "0",
                "ValueYes": "1"
            },
            "AppEvents": {
                "AchievedLevel": "fb_mobile_level_achieved",
                "AdClick": "AdClick",
                "AdImpression": "AdImpression",
                "AddedPaymentInfo": "fb_mobile_add_payment_info",
                "AddedToCart": "fb_mobile_add_to_cart",
                "AddedToWishlist": "fb_mobile_add_to_wishlist",
                "CompletedRegistration": "fb_mobile_complete_registration",
                "CompletedTutorial": "fb_mobile_tutorial_completion",
                "Contact": "Contact",
                "CustomizeProduct": "CustomizeProduct",
                "Donate": "Donate",
                "FindLocation": "FindLocation",
                "InitiatedCheckout": "fb_mobile_initiated_checkout",
                "Purchased": "fb_mobile_purchase",
                "Rated": "fb_mobile_rate",
                "Schedule": "Schedule",
                "Searched": "fb_mobile_search",
                "SpentCredits": "fb_mobile_spent_credits",
                "StartTrial": "StartTrial",
                "SubmitApplication": "SubmitApplication",
                "Subscribe": "Subscribe",
                "UnlockedAchievement": "fb_mobile_achievement_unlocked",
                "ViewedContent": "fb_mobile_content_view"
            },
            "clearUserID": [Function clearUserID],
            "flush": [Function flush],
            "getAdvertiserID": [Function getAdvertiserID],
            "getAnonymousID": [Function getAnonymousID],
            "getAttributionID": [Function getAttributionID],
            "getUserID": [Function getUserID],
            "logEvent": [Function logEvent],
            "logProductItem": [Function logProductItem],
            "logPurchase": [Function logPurchase],
            "logPushNotificationOpen": [Function logPushNotificationOpen],
            "setFlushBehavior": [Function setFlushBehavior],
            "setPushNotificationsDeviceToken": [Function setPushNotificationsDeviceToken],
            "setPushNotificationsRegistrationId": [Function setPushNotificationsRegistrationId],
            "setUserData": [Function setUserData],
            "setUserID": [Function setUserID]
        },
        "AppLink": {
            "fetchDeferredAppLink": [Function fetchDeferredAppLink]
        },
        "AuthenticationToken": [Function FBAuthenticationToken],
        "AuthenticationTokenMap": undefined,
        "DefaultAudience": undefined,
        "Event": undefined,
        "GameRequestDialog": {
            "canShow": [Function canShow],
            "show": [Function show]
        },
        "GameRequestDialogResult": undefined,
        "GraphRequest": [Function FBGraphRequest],
        "GraphRequestCallback": undefined,
        "GraphRequestConfig": undefined,
        "GraphRequestManager": [Function FBGraphRequestManager],
        "GraphRequestParameters": undefined,
        "LoginBehavior": undefined,
        "LoginBehaviorAndroid": undefined,
        "LoginBehaviorIOS": undefined,
        "LoginButton": [Function LoginButton],
        "LoginManager": {
            "getDefaultAudience": [Function getDefaultAudience],
            "getLoginBehavior": [Function getLoginBehavior],
            "logInWithPermissions": [Function logInWithPermissions],
            "logOut": [Function logOut],
            "reauthorizeDataAccess": [Function reauthorizeDataAccess],
            "setDefaultAudience": [Function setDefaultAudience],
            "setLoginBehavior": [Function setLoginBehavior]
        },
        "LoginResult": undefined,
        "LoginTracking": undefined,
        "MessageDialog": {
            "canShow": [Function canShow],
            "setShouldFailOnDataError": [Function setShouldFailOnDataError],
            "show": [Function show]
        },
        "MessageDialogResult": undefined,
        "Params": undefined,
        "ProductAvailability": undefined,
        "ProductCondition": undefined,
        "Profile": [Function FBProfile],
        "ProfileMap": undefined,
        "RNFBSDKCallback": undefined,
        "SendButton": [Function SendButton],
        "Settings": {
            "getAdvertiserTrackingEnabled": [Function getAdvertiserTrackingEnabled],
            "initializeSDK": [Function initializeSDK],
            "setAdvertiserIDCollectionEnabled": [Function setAdvertiserIDCollectionEnabled],
            "setAdvertiserTrackingEnabled": [Function setAdvertiserTrackingEnabled],
            "setAppID": [Function setAppID],
            "setAppName": [Function setAppName],
            "setAutoLogAppEventsEnabled": [Function setAutoLogAppEventsEnabled],
            "setClientToken": [Function setClientToken],
            "setDataProcessingOptions": [Function setDataProcessingOptions],
            "setGraphAPIVersion": [Function setGraphAPIVersion]
        },
        "ShareButton": [Function ShareButton],
        "ShareContent": undefined,
        "ShareContentCommonParameters": undefined,
        "ShareDialog": {
            "canShow": [Function canShow],
            "setMode": [Function setMode],
            "setShouldFailOnDataError": [Function setShouldFailOnDataError],
            "show": [Function show]
        },
        "ShareDialogMode": undefined,
        "ShareDialogModeAndroid": undefined,
        "ShareDialogModeIOS": undefined,
        "ShareDialogResult": undefined,
        "ShareLinkContent": undefined,
        "SharePhotoContent": undefined,
        "ShareVideoContent": undefined,
        "TooltipBehaviorIOS": undefined,
        "UserData": undefined
    }
*/
