import { StyleSheet } from 'react-native';
import React from 'react';
import { Colours } from '../../../../shared/styles/Styles';
import { Loading } from '../../../../shared/components/Core/Loading';
import { Button } from '../../../../shared/components/Buttons/Button';

interface ContinueButtonProps {
    onPress: () => void;
    enabled: boolean;
    isLoading?: boolean;
}

export const ContinueButton = ({ enabled, onPress, isLoading = false }: ContinueButtonProps) => {
    const backgroundStyles = enabled && !isLoading ? { backgroundColor: Colours.WHITE } : { backgroundColor: Colours.WHITE_TRANSPARENT };

    const handlePress = () => {
        if (enabled && !isLoading) {
            onPress();
        }
    };

    return (
        <Button label={!isLoading ? 'CONTINUE' : ' '} containerStyle={{ ...styles.wrapper, ...backgroundStyles }} onPress={handlePress}>
            {isLoading && <Loading size={16} />}
        </Button>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        paddingVertical: 12.5,
        backgroundColor: Colours.WHITE,
        borderRadius: 30,
    },
});
