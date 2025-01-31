import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import AuthStackLayout from '../layouts/AuthStackLayout';
import { Colours } from '../../../shared/styles/Styles';
import { useFetch } from '../../../shared/hooks/useFetch';
import { getSignUpContextValues } from '../../../shared/context/SignUpContext';
import { Gender as GenderType } from '../../../gathera-lib/enums/user';
import { getAuthContextValues } from '../../../shared/context/AuthContext';
import { AuthErrorMessage } from '../../../shared/components/AuthErrorMessage';

interface GenderProps {
    navigation: any;
}

const Gender = ({ navigation }: GenderProps) => {
    const { loginAsync } = getAuthContextValues();
    const { signUpFields, setSignUpFields } = getSignUpContextValues();
    const { error, fetchAsync, isLoading } = useFetch(false);

    const onGenderSelect = (gender: GenderType) => {
        setSignUpFields((prevFields) => {
            return { ...prevFields, gender };
        });
    };

    const signUp = async () => {
        await fetchAsync(
            {
                url: '/auth/signup',
                method: 'POST',
                body: Object.fromEntries(Object.entries(signUpFields).filter(([_, val]) => val !== undefined && val !== null && val !== '')), // remove undefined, null, and empty string values})
            },
            async (data) => {
                await loginAsync(data, false);

                // prevent user from going back to the signup flow
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'PfpInput' }], // navigate to the pfp input screen
                });
            }
        );
    };

    const GenderButton = ({ gender, label }: any) => (
        <Pressable
            style={[styles.genderButton, signUpFields.gender === gender ? styles.genderButtonSelected : null]}
            onPress={() => onGenderSelect(gender)}
        >
            <Text style={[signUpFields.gender === gender ? styles.genderButtonTextSelected : styles.genderButtonText]}>{label}</Text>
        </Pressable>
    );

    const canContinue = useMemo(() => !!signUpFields.gender && !isLoading, [signUpFields, isLoading]);

    return (
        <AuthStackLayout
            headerText={'What is your Gender?'}
            subHeaderText='Your gender will be shown on your profile'
            onContinuePress={signUp}
            canContinue={canContinue}
        >
            <View style={styles.genderButtonsContainer}>
                <GenderButton gender='male' label='Male' />
                <GenderButton gender='female' label='Female' />
                <GenderButton gender='other' label='Other' />
            </View>

            {error && <AuthErrorMessage message={error} />}
        </AuthStackLayout>
    );
};

export default Gender;

const styles = StyleSheet.create({
    genderButtonsContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 30,
    },
    genderButton: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 10,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'white',
    },
    genderButtonSelected: {
        backgroundColor: 'white',
        borderColor: 'white',
    },
    genderButtonText: {
        fontSize: 18,
        fontWeight: '500',
        color: 'white',
    },
    genderButtonTextSelected: {
        color: Colours.DARK,
        fontSize: 18,
        fontWeight: '500',
    },
});
