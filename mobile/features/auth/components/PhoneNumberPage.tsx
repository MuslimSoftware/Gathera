import { StyleSheet, Text } from 'react-native';
import React, { useMemo, useState } from 'react';
import { getSignUpContextValues } from '../../../shared/context/SignUpContext';
import AuthStackLayout from '../layouts/AuthStackLayout';
import { validatePhoneNumber } from '../../../gathera-lib/validators/UserValidators';
import AuthPhoneInput from './AuthPhoneInput';
import { CountryPickerBottomSheet } from './CountryPickerBottomSheet';
import { useUserExists } from '../hooks/useUserExists';

const PhoneNumberPage = ({ navigation }: any) => {
    const { signUpFields, setSignUpFields } = getSignUpContextValues();
    const [displayedPhoneNumber, setDisplayedPhoneNumber] = useState<string>(`${signUpFields.phone_number.replace('+1', '')}`);
    const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);
    const [countryCode, setCountryCode] = useState<string>('+1');
    const { fetchUserExists, isLoading, error, setError } = useUserExists();

    const handleInputChange = (text: string) => {
        setError('');
        setDisplayedPhoneNumber(text);
        setSignUpFields((prevFields) => {
            return { ...prevFields, phone_number: `${countryCode}${text}` };
        });
    };

    const handlePhoneSubmit = async () => {
        await fetchUserExists((userExists: boolean) => {
            navigation.navigate('PhoneAuth', { sendToSignUpFlow: !userExists });
        }, signUpFields.phone_number);
    };

    const canContinue = useMemo(() => validatePhoneNumber(signUpFields.phone_number), [signUpFields.phone_number]);

    return (
        <AuthStackLayout
            onContinuePress={handlePhoneSubmit}
            headerText='Can we get your number?'
            canContinue={canContinue}
            isContinueLoading={isLoading}
        >
            <AuthPhoneInput
                countryCode={countryCode}
                onCountryCodePress={() => {
                    setShowCountryPicker(true);
                }}
                hasError={!!error}
                errorMessage={error}
                value={displayedPhoneNumber}
                onChangeText={handleInputChange}
                keyboardType='phone-pad'
                placeholder='Enter phone number here'
                placeholderTextColor='#aaa'
                autoComplete='tel'
                autoFocus
            />
            <Text style={styles.inputCommentText}>We'll send you a text to verify your phone. Message and data rates may apply.</Text>

            <CountryPickerBottomSheet
                setCountryCode={setCountryCode}
                setShowCountryPicker={setShowCountryPicker}
                showCountryPicker={showCountryPicker}
            />
        </AuthStackLayout>
    );
};

export default PhoneNumberPage;

const styles = StyleSheet.create({
    inputCommentText: {
        fontSize: 13,
        textAlign: 'left',
        color: 'white',
    },
    underLineText: {
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
});
