import { openInAppBrowser } from './uiHelper';

/**
 * Opens a Gathera url in the user's default browser within the app
 * @param path The path to open starting from the domain. E.g. 'terms', 'privacy-policy'
 */
export const openGatheraInAppBrowser = async (path: string) => {
    openInAppBrowser(`${process.env.EXPO_PUBLIC_HOSTNAME}/${path}`);
};

export const openTermsInAppBrowser = () => openGatheraInAppBrowser('terms');
export const openPrivacyInAppBrowser = () => openGatheraInAppBrowser('privacy-policy');
export const openContactInAppBrowser = () => openGatheraInAppBrowser('contact');
