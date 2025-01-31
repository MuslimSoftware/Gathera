import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

/**
 * Hook for using AsyncStorage. Automatically gets the item from AsyncStorage on mount.
 * @param key The key of the item to get from AsyncStorage.
 * @param initialValue The initial value of the item state.
 */
export const useAsyncStorage = <T = any>(key: string, initialValue: T) => {
    const [item, _setItem] = useState<T>(initialValue);
    const [isInitialLoading, _setIsInitialLoading] = useState(true);

    useEffect(() => {
        const getItem = async () => {
            try {
                const item = await AsyncStorage.getItem(key);
                if (item) _setItem(JSON.parse(item));
            } catch (error) {
                console.log(`Error getting item "${key}" from AsyncStorage`, error);
            }
            _setIsInitialLoading(false);
        };

        getItem();
    }, []);

    /**
     * Store an item in AsyncStorage.
     * @param item The item to store.
     */
    const storeItemAsync = async (item: T) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(item));
            _setItem(item);
        } catch (error) {
            console.log('Error storing item in AsyncStorage', error);
        }
    };

    return { item, isInitialLoading, storeItemAsync };
};
