import { View, Text, StyleSheet } from 'react-native';
import { Colours, Sizes } from '../../styles/Styles';

interface RedNumberBadgeProps {
    number: number;
    badgeSize?: 'small' | 'large';
}

export const RedNumberBadge = ({ number, badgeSize = 'large' }: RedNumberBadgeProps) => {
    return (
        <View style={[styles.wrapper, badgeSize === 'large' ? styles.largeWrapper : styles.smallWrapper]}>
            <Text style={[styles.text, badgeSize === 'large' ? styles.largeText : styles.largeWrapper]} adjustsFontSizeToFit>
                {Math.min(99, number)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 3,
        right: 0,
        backgroundColor: Colours.RED,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        justifyContent: 'center',
        alignItems: 'center',
    },
    largeWrapper: {
        width: 20,
        height: 20,
    },
    smallWrapper: {
        width: 15,
        height: 15,
    },
    text: {
        color: Colours.WHITE,
        fontWeight: '500',
    },
    largeText: {
        fontSize: 12,
    },
    smallText: {
        fontSize: 8,
    },
});
