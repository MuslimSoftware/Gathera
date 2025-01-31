import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';

/**
 * Sets the Android OS navbar color (under the bottom tabs)
 * @param color The color to set the navbar to
 */
export const useAndroidNavBarColor = (color: string) => {
    useEffect(() => {
        const setBG = async () => {
            await NavigationBar.setBackgroundColorAsync(color);
        };

        Platform.OS === 'android' && setBG();
    }, [color]);
};
