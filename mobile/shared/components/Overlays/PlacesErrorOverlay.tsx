import React from 'react';
import { Overlay } from './Overlay';

interface PlacesErrorOverlayProps {
    onRetry: () => void;
}

export const PlacesErrorOverlay = ({ onRetry }: PlacesErrorOverlayProps) => {
    return (
        <Overlay
            content={{
                title: 'Something went wrong',
                description: 'Failed to retrieve places data, please try again.',
                imageSource: require('../../../assets/images/services/location.png'),
            }}
            dismissOverlay={onRetry}
            dismissButtonLabel='Retry'
        />
    );
};
