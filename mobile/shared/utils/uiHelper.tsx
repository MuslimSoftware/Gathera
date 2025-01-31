import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import Toast, { ToastShowParams } from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';
import { View, Text } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Sizes, Colours } from '../styles/Styles';
import * as WebBrowser from 'expo-web-browser';
import { WebBrowserPresentationStyle } from 'expo-web-browser';

export const PLACE_FILTERS_HEIGHT = 50;
export const PLACE_ITEM_HEIGHT = 175;
export const PLACE_ITEMS_GAP = 20;
export const HANDLE_HEIGHT = 24; // DO NOT CHANGE,
export const NAV_BAR_HEIGHT = 60;
export const PLACE_BOTTOM_SHEET_HEADER_HEIGHT = 80;

/**
 * Gets the height of the bottom inset
 * @returns
 */
export const getBottomInset = () => {
    const insets = useSafeAreaInsets();
    return insets.bottom + (Platform.OS === 'ios' ? -10 : 5);
};

/**
 * Gets the height of the navigation bar, including the bottom inset
 * @returns
 */
export const getNavigationBarBottomPadding = () => {
    return getBottomInset() + NAV_BAR_HEIGHT + 10;
};

/**
 * Ellipsizes text if it is longer than the maxLength
 * @param text
 * @param maxLength
 * @returns Ellipsized text
 */
export const ellipsizeText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

/**
 * Capitalizes the first letter of every word in a string.
 * @param text The text to capitalize
 * @returns Capitalized text
 */
export const capitalizeAllWords = (text: string) => {
    // `${text}` is required to convert the text to a string
    return `${text}`.replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * Copies text to clipboard and shows a toast message
 * @param text to be copied to clipboard
 */
export const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    showToast('Copied to clipboard');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

/**
 * Opens a url in the user's default browser within the app
 * @param url
 */
export const openInAppBrowser = async (url: string) => {
    WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowserPresentationStyle.OVER_FULL_SCREEN,
        dismissButtonStyle: 'done',
    });
};

/**
 * Displays a message at the bottom of the user's screen
 * @param message
 */
export const showToast = (message: string, type: ToastType = 'default') => {
    if (type === 'error') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    Toast.show({
        type: type,
        text1: type === 'error' ? 'Error' : '',
        text2: message,
        position: 'bottom',
    });
};

export type ToastType = 'default' | 'success' | 'error';
export const TOAST_CONFIG = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    success: (props: any) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: 'pink' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 17,
            }}
            text2Style={{
                fontSize: 15,
            }}
        />
    ),

    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: (props: any) => (
        <ErrorToast
            {...props}
            text1NumberOfLines={1}
            text2NumberOfLines={2}
            text1Style={{
                fontSize: 17,
            }}
            text2Style={{
                fontSize: 15,
            }}
        />
    ),

    /*
      Or create a completely new type - `tomatoToast`,
      building the layout from scratch.
  
      I can consume any custom `props` I want.
      They will be passed when calling the `show` method (see below)
    */
    default: ({ text2 }: ToastShowParams) => {
        return (
            <View
                style={{
                    height: 40,
                    width: '50%',
                    borderRadius: Sizes.BORDER_RADIUS_FULL,
                    borderWidth: 1,
                    backgroundColor: Colours.WHITE,
                    borderColor: Colours.GRAY_LIGHT,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...Platform.select({
                        ios: {
                            shadowColor: Colours.GRAY,
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                        },
                        android: {
                            elevation: 5,
                        },
                    }),
                }}
            >
                <Text style={{ color: Colours.DARK, fontSize: 16 }}>{text2}</Text>
            </View>
        );
    },
};
