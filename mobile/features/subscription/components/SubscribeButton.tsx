import { StyleSheet, View, Text } from 'react-native';
import React from 'react';
import { PrimaryButton } from '../../../shared/components/Buttons/PrimaryButton';
import { Sizes, Colours } from '../../../shared/styles/Styles';
import { useRevenueCat } from '../../../shared/hooks/useRevenueCat';
import { useNavigation } from '@react-navigation/native';
import { openPrivacyInAppBrowser, openTermsInAppBrowser } from '../../../shared/utils/gatheraWebsite';

interface SubscribeButtonProps {
    showNote?: boolean;
}

export const SubscribeButton = ({ showNote = true }: SubscribeButtonProps) => {
    const { purchaseSubscription } = useRevenueCat();
    const navigation: any = useNavigation();

    const handleClick = async () => {
        const purchaseSuccessful = await purchaseSubscription().catch((error) => {
            console.log('Error purchasing subscription: ', error);
        });

        purchaseSuccessful && navigation.replace('SubscriptionPurchased');
    };

    return (
        <View style={styles.wrapper}>
            <PrimaryButton containerStyle={styles.button} textStyle={styles.buttonText} label='Get Premium' onPress={handleClick} vibrateOnPress />
            {showNote && (
                <Text style={styles.noteText}>
                    By subscribing, you agree to our <LinkText onPress={openTermsInAppBrowser}>Terms</LinkText> and{' '}
                    <LinkText onPress={openPrivacyInAppBrowser}>Privacy Policy</LinkText>. Your subscription is non-refundable and will automatically
                    renew unless cancelled prior to the renewal date. You may cancel at any time through your account settings.{' '}
                </Text>
            )}
        </View>
    );
};

const LinkText = ({ onPress, children }: { onPress: () => {}; children: React.ReactNode }) => {
    return (
        <Text style={styles.linkText} onPress={onPress}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        alignItems: 'center',
        gap: 10,
    },
    button: {
        width: '95%',
        height: 50,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        backgroundColor: Colours.PREMIUM,
    },
    buttonText: {
        fontSize: Sizes.FONT_SIZE_LG,
        fontWeight: '600',
    },
    noteText: {
        fontSize: Sizes.FONT_SIZE_SM,
        fontWeight: '400',
        color: '#888',
        textAlign: 'center',
        width: '95%',
    },
    linkText: {
        color: '#007AFF',
    },
});
