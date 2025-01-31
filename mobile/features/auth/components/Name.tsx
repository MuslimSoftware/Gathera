import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import AuthStackLayout from '../layouts/AuthStackLayout';
import { AuthTextInput } from './AuthTextInput';
import { getSignUpContextValues } from '../../../shared/context/SignUpContext';
import { validateName } from '../../../gathera-lib/validators/UserValidators';
import { MAX_NAME_LENGTH } from '../../../gathera-lib/constants/user';

const Name = ({ navigation }: any) => {
    const { signUpFields, setSignUpFields } = getSignUpContextValues();
    const [fnameError, setFnameError] = React.useState<string>('');
    const [lnameError, setLnameError] = React.useState<string>('');

    const handleFnameChange = (text: string) => {
        setSignUpFields((prevFields) => {
            return { ...prevFields, fname: text };
        });

        if (text.length === 0) {
            setFnameError('First name cannot be empty');
            return;
        }

        if (text.length > 0) {
            const errorMessage = validateName(text) ? '' : 'Invalid characters in first name';
            setFnameError(errorMessage);
        }
    };

    const handleLnameChange = (text: string) => {
        setSignUpFields((prevFields) => ({ ...prevFields, lname: text }));

        if (text.length === 0) {
            setLnameError('');
            return;
        }

        if (text.length > 0) {
            const errorMessage = validateName(text) ? '' : 'Invalid characters in last name';
            setLnameError(errorMessage);
        }
    };

    const handleSubmit = () => {
        if (signUpFields.lname && signUpFields.lname.length === 0) {
            // delete lname if it's empty
            setSignUpFields((prevFields) => {
                const { lname, ...rest } = prevFields;
                return rest;
            });
        }

        if (!signUpFields.fname || signUpFields.fname.length === 0) {
            setFnameError('Please enter your first name');
            return;
        }

        if (!validateName(signUpFields.fname)) {
            setFnameError('Invalid characters in first name');
            return;
        }

        if (signUpFields.lname && !validateName(signUpFields.lname)) {
            setLnameError('Invalid characters in last name');
            return;
        }

        setFnameError('');
        setLnameError('');
        navigation.navigate('DobInput');
    };

    const canContinue = useMemo(() => {
        return signUpFields.lname ? validateName(signUpFields.fname) && validateName(signUpFields.lname) : validateName(signUpFields.fname);
    }, [signUpFields.fname, signUpFields.lname]);
    return (
        <AuthStackLayout
            onContinuePress={handleSubmit}
            headerText="What's your name?"
            subHeaderText='This will be used as your display name. You can change it later.'
            canContinue={canContinue}
        >
            <View style={styles.inputWrapper}>
                <AuthTextInput
                    value={signUpFields.fname}
                    onChangeText={handleFnameChange}
                    placeholder='First name'
                    autoFocus
                    hasError={!!fnameError}
                    autoComplete='given-name'
                    errorMessage={fnameError}
                    maxLength={MAX_NAME_LENGTH}
                />
                <AuthTextInput
                    value={signUpFields.lname || ''}
                    onChangeText={handleLnameChange}
                    placeholder='Last name (optional)'
                    hasError={!!lnameError}
                    autoComplete='family-name'
                    errorMessage={lnameError}
                    maxLength={MAX_NAME_LENGTH}
                />
            </View>
        </AuthStackLayout>
    );
};
export default Name;
const styles = StyleSheet.create({
    inputWrapper: {
        width: '100%',
        gap: 10,
    },
});
