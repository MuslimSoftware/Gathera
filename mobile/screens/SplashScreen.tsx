import { DevSettings, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect } from 'react';
import { GradientLayout } from '../features/auth/layouts/GradientLayout';
import { Colours, Sizes } from '../shared/styles/Styles';
import { PrimaryButton } from '../shared/components/Buttons/PrimaryButton';
import * as Updates from 'expo-updates';
import { Loading } from '../shared/components/Core/Loading';

interface SplashScreenProps {
    error: string;
}

export const SplashScreen = ({ error }: SplashScreenProps) => {
    const [isLoading, setIsLoading] = React.useState(true);

    const reloadApp = async () => {
        console.log('Refreshing app...');
        if (!__DEV__) await Updates.reloadAsync(); // Only works on production
        else DevSettings.reload(); // Only works on development
    };

    useEffect(() => {
        if (error) setIsLoading(false);
    }, [error]);

    return (
        <GradientLayout>
            <View style={styles.globalWrapper}>
                <View style={styles.wrapper}>
                    <View style={styles.logoWrapper}>
                        <Image source={require('../assets/images/logo_transparent.png')} style={styles.logo} />
                        <Text style={styles.appName}>Gathera</Text>
                    </View>
                    {isLoading && <Loading color='white' />}
                </View>
                {error && (
                    <View style={styles.buttonWrapper}>
                        <Text style={styles.errorText}>{error}</Text>
                        <PrimaryButton label='Refresh' containerStyle={styles.buttonContainer} textStyle={styles.buttonText} onPress={reloadApp} />
                    </View>
                )}
            </View>
        </GradientLayout>
    );
};

const styles = StyleSheet.create({
    globalWrapper: { height: '80%', justifyContent: 'flex-end', alignItems: 'center', gap: 25 },
    wrapper: {
        position: 'absolute',
        top: '40%',
        width: '100%',
        height: '100%',
        gap: 25,
    },
    logoWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    logo: {
        width: 90,
        height: 90,
    },
    appName: {
        fontSize: 45,
        fontWeight: 'bold',
        color: Colours.WHITE,
    },
    buttonWrapper: {
        width: '100%',
        paddingHorizontal: 30,
        gap: 15,
    },
    buttonContainer: { backgroundColor: Colours.WHITE },
    buttonText: { fontSize: Sizes.FONT_SIZE_MD, color: Colours.DARK },
    errorText: {
        fontSize: Sizes.FONT_SIZE_MD,
        color: Colours.WHITE,
        textAlign: 'center',
    },
});
