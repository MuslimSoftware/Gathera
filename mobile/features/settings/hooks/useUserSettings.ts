import { useEffect, useState } from 'react';
import { useFetch } from '../../../shared/hooks/useFetch';
import { useNavigate } from '../../../shared/hooks/useNavigate';

export const useUserSettings = () => {
    const { goBack } = useNavigate();
    const [is_notifications_enabled, setIsNotificationsEnabled] = useState(false);
    const [is_subscribed_to_emails, setIsSubscribedToEmails] = useState(false);
    const [default_notifications_enabled, setDefaultNotificationsEnabled] = useState(false);
    const { fetchAsync: fetchSettingsAsync, isLoading, error } = useFetch();
    const { fetchAsync: fetchUpdateSettings, isLoading: isUpdateSettingsLoading, error: updateSettingsError } = useFetch();

    const getSettings = async () => {
        await fetchSettingsAsync({ url: '/user/settings' }, (data) => {
            setIsNotificationsEnabled(data.is_notifications_enabled);
            setIsSubscribedToEmails(data.is_subscribed_to_emails);
            setDefaultNotificationsEnabled(data.is_notifications_enabled); // To control canSubmit, we need the initial value
        });
    };

    const updateSettings = async () => {
        await fetchUpdateSettings(
            { url: '/user/settings', method: 'PATCH', body: { fields: { is_notifications_enabled, is_subscribed_to_emails } } },
            goBack
        );
    };

    useEffect(() => {
        getSettings();
    }, []);

    return {
        default_notifications_enabled,
        is_notifications_enabled,
        is_subscribed_to_emails,
        setIsNotificationsEnabled,
        setIsSubscribedToEmails,

        getSettings,
        updateSettings,

        getSettingsIsLoading: isLoading,
        getSettingsError: error,

        updateSettingsIsLoading: isUpdateSettingsLoading,
        updateSettingsError,
    };
};
