import { StyleSheet, View, Text } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import AuthStackLayout from '../layouts/AuthStackLayout';
import { Colours, Sizes } from '../../../shared/styles/Styles';
import { useOTP } from '../hooks/useOTP';
import { CooldownButton } from '../../../shared/components/Buttons/CooldownButton';
import { OTPInput } from './OTPInput';
import { getSignUpContextValues } from '../../../shared/context/SignUpContext';

const OTP_TIMEOUT = 30; // Number of seconds to wait between OTP requests

const OTP = ({ route }: any) => {
    const { sendToSignUpFlow }: { sendToSignUpFlow: boolean } = route.params;
    const { otp, setOtp, signUpFields } = getSignUpContextValues();
    const { requestOtp, validateOtp, loginWithOtp, error, setError, isLoading } = useOTP(signUpFields.phone_number);

    useEffect(() => {
        // Automatically request OTP on load
        requestOtp();
    }, []);

    useEffect(() => {
        // Automatically submit OTP when 6 characters are entered
        otp.length === 6 && handleOtpSubmit();
    }, [otp]);

    const onChangeOtp = (value: string) => {
        setOtp(value);
        setError('');
    };

    const handleOtpSubmit = () => {
        sendToSignUpFlow ? validateOtp() : loginWithOtp();
    };

    const canContinue = useMemo(() => otp.length === 6, [otp]);

    return (
        <AuthStackLayout
            onContinuePress={handleOtpSubmit}
            headerText='Enter the code'
            subHeaderText={`We sent a code to ${signUpFields.phone_number}`}
            canContinue={canContinue}
            isContinueLoading={isLoading}
        >
            <OTPInput value={otp} setValue={setOtp} onChangeText={onChangeOtp} maxLength={6} error={error} />
            <View style={styles.footerWrapper}>
                <Text style={styles.footerText}>Didn't get a code?</Text>
                <CooldownButton cooldownDurationSec={OTP_TIMEOUT} label='Send new code' onPress={requestOtp} />
            </View>
        </AuthStackLayout>
    );
};

export default OTP;

const styles = StyleSheet.create({
    footerWrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 5,
    },
    footerText: {
        textAlign: 'left',
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.WHITE,
    },
});
