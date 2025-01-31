import { StyleSheet, Switch, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import AuthStackLayout from '../layouts/AuthStackLayout';
import { Colours, Sizes } from '../../../shared/styles/Styles';
import { AuthTextInput } from './AuthTextInput';
import { validateEmail } from '../../../gathera-lib/validators/UserValidators';
import { useUserExists } from '../hooks/useUserExists';
import { getSignUpContextValues } from '../../../shared/context/SignUpContext';

const Email = ({ navigation }: any) => {
    const { signUpFields, setSignUpFields } = getSignUpContextValues();
    const navigateToNextScreen = () => navigation.navigate('NameInput');
    const { fetchUserExists, isLoading, error, setError } = useUserExists();

    const skipHandler = () => {
        setSignUpFields((prevFields) => {
            return { ...prevFields, email: '', is_subscribed_to_emails: false };
        });

        navigateToNextScreen();
    };

    const handleTextChange = (text: string) => {
        setError('');
        setSignUpFields((prevFields) => {
            return { ...prevFields, email: text };
        });
    };

    const handleSubmit = async () => {
        if (!validateEmail(signUpFields.email || '')) {
            setError('Please enter a valid email address');
            return;
        }

        await fetchUserExists(
            (userExists: boolean) => {
                userExists ? setError('This email is already in use.') : navigateToNextScreen();
            },
            '',
            signUpFields.email
        );
    };

    const FooterSwitch = (
        <Switch
            trackColor={{ true: Colours.GREEN, false: Colours.GRAY }}
            ios_backgroundColor={Colours.PRIMARY_TRANSPARENT_20}
            thumbColor={'white'}
            onValueChange={(newValue) => setSignUpFields((prevFields) => ({ ...prevFields, is_subscribed_to_emails: newValue }))}
            value={signUpFields.is_subscribed_to_emails}
        />
    );

    const canContinue = useMemo(() => validateEmail(signUpFields.email || ''), [signUpFields.email]);

    return (
        <AuthStackLayout
            onContinuePress={handleSubmit}
            isContinueLoading={isLoading}
            headerText='What’s your email?'
            subHeaderText="Don't lose access to your account, verify your email"
            canContinue={canContinue}
            skippable
            onSkipPress={skipHandler}
        >
            <AuthTextInput
                value={signUpFields.email || ''}
                onChangeText={handleTextChange}
                hasError={error ? true : false}
                errorMessage={error}
                keyboardType='email-address'
                autoCapitalize='none'
                autoComplete='email'
                placeholder='Enter your email'
                maxLength={320}
                autoFocus
            />
            <View style={styles.footerWrapper}>
                {FooterSwitch}
                <Text style={styles.footerText}>I want to receive marketing emails for exclusive updates and offers.</Text>
            </View>
        </AuthStackLayout>
    );
};

export default Email;

const styles = StyleSheet.create({
    footerWrapper: {
        width: '100%',
        gap: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    footerText: {
        textAlign: 'left',
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.WHITE,
        maxWidth: '80%',
    },
});
