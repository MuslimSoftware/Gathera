import { useEffect } from 'react';
import { showToast } from '../utils/uiHelper';

/**
 * Displays a error toast message when an error occurs
 * @param error error message
 */
export const useToastError = (error: string) => {
    useEffect(() => {
        if (error) showToast(error, 'error');
    }, [error]);
};
