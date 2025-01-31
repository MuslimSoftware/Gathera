import { Pressable, StyleSheet, Text } from 'react-native';
import { Colours, Sizes } from '../styles/Styles';
import { useEffect, useState } from 'react';
import { Interest } from '../../types/Interest';
import React from 'react';

interface InterestButtonProps {
    interest: Interest;
    handleInterestPress?: (interest: string) => boolean;
    hasBeenSelected?: boolean;
    style?: any;
    highlightedStyle?: any;
}

const areEqual = (prevProps: InterestButtonProps, nextProps: InterestButtonProps) => {
    return prevProps.hasBeenSelected === nextProps.hasBeenSelected;
};

export const InterestButton: React.FC<InterestButtonProps> = React.memo(
    ({ interest, handleInterestPress, hasBeenSelected = false, style, highlightedStyle }) => {
        const [isInterested, setIsInterested] = useState(hasBeenSelected);
        const name = interest.name;

        useEffect(() => {
            if (hasBeenSelected === isInterested) return;
            setIsInterested(hasBeenSelected);
        }, [hasBeenSelected]);

        // Styles
        const wrapperStyle = [styles.interestButton, style && style];
        const selectedStyle = isInterested ? highlightedStyle ?? styles.interestButtonSelected : null;

        const textColor = isInterested ? (highlightedStyle ? highlightedStyle.color : Colours.DARK) : style ? style.color : Colours.WHITE;

        return (
            <Pressable
                style={[wrapperStyle, selectedStyle]}
                onPress={() => {
                    if (handleInterestPress) {
                        const canChange = handleInterestPress(name);
                        if (canChange) setIsInterested((prev) => !prev);
                    }
                }}
            >
                {/* {<interest.icon size={size} color={textColor} />} */}
                <Text style={styles.emoji}>{interest.icon}</Text>
                <Text style={[styles.interestButtonText, { color: textColor }]}>{name}</Text>
                {/* <Text style={[styles.interestCountText, { color: textColor }]}>{interest.count}</Text> */}
            </Pressable>
        );
    },
    areEqual
);

const styles = StyleSheet.create({
    emoji: {
        fontSize: Sizes.ICON_SIZE_XS,
    },
    interestButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        backgroundColor: Colours.WHITE_TRANSPARENT,
    },
    interestCountText: {
        fontSize: Sizes.FONT_SIZE_XS,
        fontWeight: '500',
    },
    interestButtonSelected: {
        backgroundColor: Colours.WHITE,
    },
    interestButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
    interestButtonTextSelected: {
        color: Colours.DARK,
    },
});
