import * as SecureStore from 'expo-secure-store';

/**
 * Stores an item in the secure store of the device asynchronously.
 * @param key The key to store the item under.
 * @param item The item to store.
 * @returns true if the item was stored successfully, false otherwise.
 */
export const storeItemSecureAsync = async (key: string, item: string) => {
    try {
        await SecureStore.setItemAsync(key, item);
        console.log(`Stored "${key}" successfully`);
        return true;
    } catch (error) {
        console.log(`Error storing "${key}":`, error);
        return false;
    }
};

/**
 * Retrieves an item from the secure store of the device asynchronously.
 * @param key The key to retrieve the item from.
 * @returns The item if it was found, null otherwise.
 */
export const getItemSecureAsync = async (key: string) => {
    try {
        const item = await SecureStore.getItemAsync(key);

        if (item) {
            console.log(`Retrieved "${key}" successfully`);
            return item;
        }
        return null;
    } catch (error) {
        console.log(`Error retrieving "${key}":`, error);
        return null;
    }
};

/**
 * Deletes items from a list of strings in the secure store of the device asynchronously.
 * @param keysToDelete The list of keys to delete.
 * @returns true if the items were deleted successfully, false otherwise.
 */
export const clearFromSecureStoreAsync = async (keysToDelete: string[]) => {
    const promises = keysToDelete.map((key) => {
        return SecureStore.deleteItemAsync(key).catch((error) => {
            console.log(`Error deleting "${key}":`, error);
            return false;
        });
    });

    try {
        await Promise.all(promises);
        console.log('Secure store cleared successfully');
        return true;
    } catch (error) {
        console.log('Error clearing secure store:', error);
        return false;
    }
};
