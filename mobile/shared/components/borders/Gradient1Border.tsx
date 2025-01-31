import Svg from 'react-native-svg';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { Colours, Sizes } from '../../styles/Styles';
import { LinearGradient } from 'expo-linear-gradient';

const areEqual = (prevProps: any, nextProps: any) => {
    return prevProps.size === nextProps.size;
};

export const Gradient1Border = React.memo((props: any) => {
    const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const sequence = Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]);

        Animated.loop(sequence).start();
    }, []);

    const rotation = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Svg style={styles.svg} viewBox='0 0 500 500' fill='transparent'>
            <AnimatedLinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={[Colours.GREEN, Colours.WHITE, Colours.WHITE, Colours.RED]}
                style={[styles.gradient, { transform: [{ rotate: rotation }] }]}
            />
        </Svg>
    );
}, areEqual);

const styles = StyleSheet.create({
    svg: {
        flex: 1,
        position: 'absolute',
        zIndex: 0,
    },
    gradient: {
        height: '100%',
        width: '100%',
        borderRadius: Sizes.BORDER_RADIUS_FULL,
    },
});
