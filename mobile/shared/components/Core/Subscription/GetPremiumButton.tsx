import { StyleSheet } from 'react-native';
import React from 'react';
import { PrimaryButton } from '../../Buttons/PrimaryButton';
import { useNavigate } from '../../../hooks/useNavigate';
import { Colours } from '../../../styles/Styles';

export const GetPremiumButton = () => {
    const { navigateToScreen } = useNavigate();
    return (
        <PrimaryButton
            label='Get Premium'
            containerStyle={styles.container}
            onPress={() => {
                navigateToScreen('Subscription');
            }}
            vibrateOnPress
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colours.PREMIUM,
    },
});
