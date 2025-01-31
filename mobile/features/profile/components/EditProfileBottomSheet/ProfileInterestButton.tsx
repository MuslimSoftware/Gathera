import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Interest } from '../../../../types/Interest';
import { InterestButton } from '../../../../shared/components/InterestButton';
import { Colours } from '../../../../shared/styles/Styles';

interface ProfileInterestButtonProps {
    interest: Interest;

    handleInterestPress?: (interest: string) => boolean;
    hasBeenSelected?: boolean;
    isEditable?: boolean;
}

export const ProfileInterestButton = ({ interest, handleInterestPress, hasBeenSelected = false, isEditable = true }: ProfileInterestButtonProps) => {
    return (
        <InterestButton
            interest={interest}
            hasBeenSelected={hasBeenSelected}
            handleInterestPress={handleInterestPress}
            style={styles.wrapper}
            highlightedStyle={styles.highlighted}
        />
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderColor: Colours.GRAY_LIGHT,
        borderWidth: 1,
        backgroundColor: Colours.WHITE_TRANSPARENT,
        color: Colours.GRAY,
    },
    highlighted: {
        backgroundColor: Colours.PRIMARY_TRANSPARENT_20,
        borderColor: Colours.PRIMARY_TRANSPARENT_50,
        color: Colours.PRIMARY,
    },
});
