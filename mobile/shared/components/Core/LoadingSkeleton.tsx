import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { Dimensions, View, StyleSheet, Animated, Easing } from 'react-native';
import { Colours, Sizes } from '../../styles/Styles';

interface Props {
    style: any;
    hasError?: boolean;
}

export const LoadingSkeleton = ({ style, hasError = false }: Props) => {
    const [linePosition] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.loop(
            Animated.timing(linePosition, {
                toValue: 1,
                duration: hasError ? 1500000 : 1500,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: false,
            })
        ).start();
    }, []);

    const { width: screenWidth } = Dimensions.get('window');

    const translateX = linePosition.interpolate({
        inputRange: [0, 1],
        outputRange: [-screenWidth, screenWidth],
    });

    const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

    const containerStyle = {
        width: '100%',
        height: 50,
        backgroundColor: Colours.GRAY_LIGHT,
        borderRadius: Sizes.BORDER_RADIUS_MD,
        ...style,
    };

    return (
        <View style={[styles.wrapper, containerStyle]}>
            <AnimatedLinearGradient
                colors={[Colours.GRAY_LIGHT, '#efefef', Colours.GRAY_LIGHT]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.gradient, { transform: [{ translateX }] }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        overflow: 'hidden',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
});
