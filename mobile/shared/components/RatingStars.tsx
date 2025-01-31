import { View, StyleSheet, Text } from 'react-native';
import { Colours, Sizes } from '../../shared/styles/Styles';
import { StarHalfIcon, StarIcon, StarOIcon } from './Core/Icons';

const roundToHalf = (num: number) => Math.round(num * 2) / 2;

interface RatingStarsProps {
    rating: number;
    ratingCount?: number;
    size?: number;
    color?: string;
}

export const RatingStars = ({ rating, ratingCount, size = 15, color = Colours.PRIMARY }: RatingStarsProps) => {
    const ratingRounded = roundToHalf(rating);
    const hasHalfStar = ratingRounded % 1 !== 0;
    const numEmptyStars = 5 - Math.ceil(ratingRounded);

    const stars = [];
    for (let i = 0; i < Math.floor(ratingRounded); i++) {
        stars.push(<StarIcon key={i} size={size} color={color} />);
    }
    if (hasHalfStar) {
        stars.push(<StarHalfIcon key={ratingRounded} size={size} color={color} />);
    }
    for (let i = 0; i < numEmptyStars; i++) {
        stars.push(<StarOIcon key={ratingRounded + i + 1} size={size} color={color} />);
    }

    return (
        <View style={styles.starsContainer}>
            {stars.map((star) => star)}
            <Text style={styles.ratingText}>{rating}</Text>
            {ratingCount && <Text style={styles.ratingCount}>({ratingCount})</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    ratingText: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.DARK,
        fontWeight: '300',
    },
    ratingCount: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.DARK,
        fontWeight: '300',
    },
});
