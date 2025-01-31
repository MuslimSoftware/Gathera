import React from 'react';
import { Overlay } from './Overlay';
import { useAsyncStorage } from '../../hooks/useAsyncStorage';

export const LOCATION_NOT_ALLOWED_KEY = 'HasRespondedToLocationNotAllowed';

interface Props {
    visible: boolean;
    dismiss: () => void;
}

// TODO: useEffect to send API request to store this user's location so that we can notify them when we're in their area & more...
export const LocationNotAllowedOverlay = React.memo(({ visible, dismiss }: Props) => {
    const { storeItemAsync } = useAsyncStorage<boolean>(LOCATION_NOT_ALLOWED_KEY, false);

    const onPreviewPress = () => {
        storeItemAsync(true); // Store that the user has responded to the overlay so that it doesn't show again
        dismiss(); // Dismiss the overlay regardless of the user's response (allow them to skip the overlay)
    };

    return (
        <Overlay
            content={{
                title: "We're not in your area yet",
                description: "Gathera is in early access and is only available in Montreal. We're working hard to expand to your city soon!",
                imageSource: require('../../../assets/images/services/location.png'),
            }}
            dismissOverlay={onPreviewPress}
            modalProps={{ visible }}
            dismissButtonLabel='Preview the app'
            dismissOnBackdropPress
        />
    );
});
