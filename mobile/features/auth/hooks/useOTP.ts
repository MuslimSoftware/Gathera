import { useEffect, useState } from 'react';
import { getAuthContextValues } from '../../../shared/context/AuthContext';
import { useFetch } from '../../../shared/hooks/useFetch';
import { useNavigation } from '@react-navigation/native';
import { getSignUpContextValues } from '../../../shared/context/SignUpContext';

export const useOTP = (phoneNumber: string) => {
    const [error, setError] = useState<string>('');
    const navigation: any = useNavigation();
    const { loginAsync } = getAuthContextValues();
    const { otp, setSignUpFields } = getSignUpContextValues();

    const { isLoading: isLoadingRequestOtp, error: requestOtpError, fetchAsync: fetchOtpAsync } = useFetch(false);
    const { isLoading: isLoadingValidateOtp, error: validateOtpError, fetchAsync: fetchValidateOtpAsync } = useFetch(false);
    const { isLoading: isLoadingLoginWithOtp, error: loginWithOtpError, fetchAsync: fetchLoginWithOtpAsync } = useFetch(false);

    useEffect(() => {
        setError(requestOtpError || validateOtpError || loginWithOtpError);
    }, [requestOtpError, validateOtpError, loginWithOtpError]);

    const requestOtp = async () => {
        await fetchOtpAsync({ url: '/auth/request-otp', method: 'POST', body: { phone_number: phoneNumber } }, async (status: any) => {
            console.log('OTP status:', status);
        });
    };

    const validateOtp = async () => {
        await fetchValidateOtpAsync(
            { url: '/auth/validate-otp', method: 'POST', body: { phone_number: phoneNumber, otp } },
            async (otpToken: any) => {
                console.log('OTP token:', otpToken);
                if (otpToken) {
                    setSignUpFields((prevFields) => {
                        return { ...prevFields, otp_token: otpToken };
                    });
                    navigation.navigate('EmailInput');
                }
            }
        );
    };

    const loginWithOtp = async () => {
        await fetchLoginWithOtpAsync(
            { url: '/auth/login', method: 'POST', body: { phone_number: phoneNumber, otp } },
            async (data) => await loginAsync(data)
        );
    };

    const isLoading = isLoadingRequestOtp || isLoadingValidateOtp || isLoadingLoginWithOtp;

    return {
        requestOtp,
        validateOtp,
        loginWithOtp,
        error,
        setError,
        isLoading,
    };
};
