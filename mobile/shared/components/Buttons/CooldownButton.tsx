import { StyleSheet } from 'react-native';
import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import { TextButton } from './TextButton';
import { Colours, Sizes } from '../../styles/Styles';

interface CooldownButtonProps {
    label: string;
    onPress?: () => void;
    cooldownDurationSec: number;
    intervalSec?: number;
}

export const CooldownButton = ({ label, cooldownDurationSec, intervalSec = 1, onPress }: CooldownButtonProps) => {
    const { countdown, isActive, start } = useCountdown(cooldownDurationSec, intervalSec);

    const handlePress = () => {
        if (!isActive) {
            onPress && onPress();
            start();
        }
    };

    const cooldownText = isActive ? `Try again in ${countdown}s` : label;
    return <TextButton label={cooldownText} onPress={handlePress} containerStyle={styles.button} textStyle={styles.text} />;
};

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 0,
    },
    text: {
        color: Colours.LIGHT,
        fontSize: Sizes.FONT_SIZE_SM,
        fontWeight: 'bold',
    },
});
