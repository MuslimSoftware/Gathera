import { Linking, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { PrimaryButton } from '../../../shared/components/Buttons/PrimaryButton';
import { Colours, Sizes } from '../../../shared/styles/Styles';
import { TextButton } from '../../../shared/components/Buttons/TextButton';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';

export const SubscriptionPurchased = () => {
    const navigation: any = useNavigation();

    const navigateToProfile = () => {
        navigation.replace('MainTabs', { screen: 'ProfileTab' });
    };

    const contactSupport = () => {
        Linking.openURL('mailto:support@gathera.ca').catch(() => {
            alert('You can contact support at support@gathera.ca. We will be happy to help you!');
        });
    };

    return (
        <View style={styles.wrapper}>
            <Text style={styles.title}>Thank You for Subscribing!</Text>
            <Image style={styles.image} source={require('../../../assets/images/services/high-five.png')} />
            <Text style={styles.subTitle}>Your subscription is confirmed.</Text>
            <Text style={styles.text}>
                You now have unlimited access to all of Gathera's premium features including animated borders, page views, trending score boost, and
                lots more!
            </Text>
            <View style={styles.buttonWrapper}>
                <PrimaryButton containerStyle={styles.button} label='Back to Profile' onPress={navigateToProfile} />
                <TextButton containerStyle={styles.button} label='Contact Support' onPress={contactSupport} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        gap: 40,
        marginTop: Constants.statusBarHeight,
    },
    title: {
        textAlign: 'center',
        fontSize: Sizes.FONT_SIZE_4XL,
        fontWeight: 'bold',
        color: Colours.PRIMARY,
    },
    subTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: Sizes.FONT_SIZE_XL,
    },
    text: {
        textAlign: 'center',
        fontSize: Sizes.FONT_SIZE_MD,
        color: Colours.GRAY,
    },
    image: {
        width: 250,
        height: 250,
    },
    buttonWrapper: {
        width: '100%',
        gap: 10,
    },
    button: {
        width: '100%',
        paddingVertical: 20,
        borderRadius: Sizes.BORDER_RADIUS_LG,
    },
});
