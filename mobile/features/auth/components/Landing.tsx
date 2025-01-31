import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Colours, Sizes } from '../../../shared/styles/Styles';
import { GradientLayout } from '../layouts/GradientLayout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthButton } from './Buttons/AuthButton';
import { openContactInAppBrowser, openPrivacyInAppBrowser, openTermsInAppBrowser } from '../../../shared/utils/gatheraWebsite';

const Landing = ({ navigation }: any) => {
    const onLoginPress = () => {
        navigation.navigate('PhoneInput');
    };

    const termsText = (
        <Text style={styles.termsText}>
            By using Gathera you agree to our{' '}
            <Text style={styles.underline} onPress={openTermsInAppBrowser}>
                Terms & Conditions
            </Text>
            . Learn how we process your data in our{' '}
            <Text style={styles.underline} onPress={openPrivacyInAppBrowser}>
                Privacy Policy
            </Text>
        </Text>
    );

    const insets = useSafeAreaInsets();
    return (
        <GradientLayout>
            <View style={styles.appNameWrapper}>
                <Image source={require('../../../assets/images/logo_transparent.png')} style={styles.logo} />
                <Text style={styles.appName}>Gathera</Text>
            </View>
            <View style={[styles.bottomHalf, { paddingBottom: insets.bottom + 20 }]}>
                {termsText}
                <View style={styles.buttonsWrapper}>
                    <AuthButton backgroundColor={Colours.WHITE} textColor={Colours.DARK} onPress={onLoginPress} label='CREATE ACCOUNT' />
                    <AuthButton backgroundColor={Colours.TRANSPARENT} textColor={Colours.WHITE} onPress={onLoginPress} label='SIGN IN' />
                </View>
                <Text style={styles.troubleText} onPress={openContactInAppBrowser}>
                    Trouble signing in?
                </Text>
            </View>
        </GradientLayout>
    );
};

export default Landing;

const styles = StyleSheet.create({
    topHalf: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    appNameWrapper: { position: 'absolute', top: '40%', width: '100%', alignItems: 'center', gap: 5 },
    logo: {
        width: 90,
        height: 90,
    },
    appName: {
        fontSize: 45,
        fontWeight: 'bold',
        color: Colours.WHITE,
    },
    bottomHalf: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 5,
    },
    termsText: {
        width: '80%',
        textAlign: 'center',
        color: Colours.WHITE,
        fontWeight: 'bold',
        fontSize: Sizes.FONT_SIZE_XS,
        marginBottom: 20,
    },
    underline: {
        textDecorationLine: 'underline',
    },
    troubleText: {
        color: Colours.WHITE,
        fontWeight: 'bold',
        fontSize: Sizes.FONT_SIZE_SM,
        marginTop: 20,
    },
    buttonsWrapper: {
        width: '85%',
        gap: 15,
    },
});
