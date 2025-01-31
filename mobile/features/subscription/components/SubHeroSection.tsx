import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SubscribeButton } from './SubscribeButton';
import { Colours, Sizes } from '../../../shared/styles/Styles';
import { RadialGradient } from 'react-native-gradients';
import { Image } from 'expo-image';

export const SubHeroSection = () => {
    const colorList = [
        { offset: '0%', color: Colours.PREMIUM, opacity: '1' },
        { offset: '60%', color: '#13ffb8', opacity: '0.9' },
        { offset: '100%', color: Colours.TRANSPARENT, opacity: '0' },
    ];

    const deviceWidth = Dimensions.get('window').width;

    return (
        <>
            <View style={styles.background}>
                <RadialGradient colorList={colorList} x={20} y={20} rx={250} ry={350} />
            </View>
            <View style={styles.background}>
                <RadialGradient colorList={colorList} x={deviceWidth - 50} y={0} rx={250} ry={350} />
            </View>
            <View style={styles.globalWrapper}>
                <Image source={require('../../../assets/images/logo_transparent.png')} style={{ width: 75, height: 75 }} />
                <Text style={styles.headerText}>Gathera Premium</Text>
                <Text style={styles.subHeaderText}>Enhance your profile and boost your gatherings with Premium</Text>
                <Text style={styles.priceText}>USD$12.99/month • Cancel anytime</Text>
                <SubscribeButton />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: Colours.TRANSPARENT,
    },
    globalWrapper: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 30,
        gap: 20,
        paddingHorizontal: 15,
    },
    headerText: {
        fontSize: Sizes.FONT_SIZE_4XL,
        fontWeight: 'bold',
    },
    subHeaderText: {
        fontSize: Sizes.FONT_SIZE_2XL,
        fontWeight: '500',
        lineHeight: 35,
        textAlign: 'center',
    },
    priceText: {
        fontSize: Sizes.FONT_SIZE_LG,
    },
});
