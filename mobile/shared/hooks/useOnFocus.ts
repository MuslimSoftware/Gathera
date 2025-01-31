import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

/**
 * Wrapper of the useFocusEffect hook that skips the first load
 * @param callback
 */
export const useOnFocus = (callback: () => void, dependencies?: Array<any>) => {
    // Add a state variable to track whether it's the initial load or not
    const [isInitialLoad, setIsInitialLoad] = React.useState(true);

    const dependenciesArray = dependencies ? dependencies : [];
    useFocusEffect(
        React.useCallback(() => {
            // Check if it's the initial load, and skip the refresh if it is
            if (!isInitialLoad) {
                callback();
            } else {
                // Set isInitialLoad to false after the first load
                setIsInitialLoad(false);
            }
        }, [isInitialLoad, ...dependenciesArray]) // Add isInitialLoad as a dependency
    );
};
