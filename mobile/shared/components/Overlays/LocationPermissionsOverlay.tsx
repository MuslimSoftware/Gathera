import React, { useEffect } from 'react';
import * as Location from 'expo-location';
import { StyleSheet } from 'react-native';
import { PrimaryButton } from '../Buttons/PrimaryButton';
import { Linking } from 'react-native';
import { Overlay } from './Overlay';

interface Props {
    visible: boolean;
    dismiss: () => void;
}

export const LocationPermissionsOverlay = ({ visible, dismiss }: Props) => {
    const requestLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync().catch(() => ({ status: 'denied', canAskAgain: false }));
        if (status === 'granted') dismiss();
    };

    return (
        <Overlay
            content={{
                title: 'Allow your location',
                description: 'We need your location to give you the best experience',
                imageSource: require('../../../assets/images/services/location.png'),
            }}
            dismissOnBackdropPress={true}
            dismissOverlay={dismiss}
            modalProps={{ visible }}
        >
            <PrimaryButton onPress={requestLocationPermission} label={'Continue'} containerStyle={styles.buttonStyle} />
        </Overlay>
    );
};

const styles = StyleSheet.create({
    buttonStyle: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
});
