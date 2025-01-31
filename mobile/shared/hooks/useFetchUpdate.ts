import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { useToastError } from './useToastError';

export const useFetchUpdate = () => {
    useEffect(() => {
        async function onFetchUpdateAsync() {
            if (__DEV__) {
                console.log('useFetchUpdate: Development mode, skipping update check');
                return;
            }

            try {
                const update = await Updates.checkForUpdateAsync();

                if (update.isAvailable) {
                    await Updates.fetchUpdateAsync();
                    await Updates.reloadAsync();
                }
            } catch (error) {
                // You can also add an alert() to see the error message in case of an error when fetching updates.
                useToastError(`Error fetching latest Expo update: ${error}`);
            }
        }

        onFetchUpdateAsync();
    }, []);
};
