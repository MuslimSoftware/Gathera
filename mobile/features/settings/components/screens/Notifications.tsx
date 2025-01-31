import React from 'react';
import { HeaderPageLayout } from '../../../../shared/layouts/HeaderPageLayout';
import { useNavigate } from '../../../../shared/hooks/useNavigate';
import { BooleanSwitchRow } from '../BooleanSwitchRow';
import { useUserSettings } from '../../hooks/useUserSettings';
import { ErrorMessage } from '../../../../shared/components/ErrorMessage';
import { RefreshControl, ScrollView } from 'react-native';

export const Notifications = () => {
    const { navigateToScreen, goBack } = useNavigate();
    const {
        default_notifications_enabled,
        is_notifications_enabled,
        setIsNotificationsEnabled,

        getSettings,
        updateSettings,

        getSettingsError,
        updateSettingsError,

        getSettingsIsLoading,
        updateSettingsIsLoading,
    } = useUserSettings();
    const [canUpdate, setCanUpdate] = React.useState(false);

    const handleChange = (value: boolean) => {
        setIsNotificationsEnabled(value);
        setCanUpdate(default_notifications_enabled != value);
    };

    const handleSubmit = async () => {
        await updateSettings();
        goBack();
    };

    return (
        <HeaderPageLayout
            title='Notifications'
            submit={{
                label: 'Save',
                canSubmit: canUpdate,
                onSubmit: handleSubmit,
            }}
            hasTopMargin
        >
            <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={getSettings} />}>
                {updateSettingsError && <ErrorMessage message={updateSettingsError} />}
                {getSettingsError && <ErrorMessage message={getSettingsError} />}
                {!getSettingsError && <BooleanSwitchRow label='All Notifications' value={is_notifications_enabled} onChange={handleChange} />}
            </ScrollView>

            {/* <ListItemButton labelText='Follows' onPress={() => navigateToScreen('NotificationsFollows')} />
            <ListItemButton labelText='Messages' onPress={() => navigateToScreen('NotificationsMessages')} />
            <ListItemButton labelText='Invites' onPress={() => navigateToScreen('NotificationsInvites')} />
            <ListItemButton labelText='Gatherings' onPress={() => navigateToScreen('NotificationsGatherings')} />
            <ListItemButton labelText='Promotional & Marketing' onPress={() => navigateToScreen('NotificationsPromo')} /> */}
        </HeaderPageLayout>
    );
};
