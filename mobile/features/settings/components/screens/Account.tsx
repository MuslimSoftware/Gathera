import { StyleSheet } from 'react-native';
import React from 'react';
import { HeaderPageLayout } from '../../../../shared/layouts/HeaderPageLayout';
import { SingleLineTextInput } from '../../../../shared/components/LabelInputs/SingleLineTextInput';
import { ScrollView } from 'react-native-gesture-handler';
import { getAuthContextValues } from '../../../../shared/context/AuthContext';
import { useNavigate } from '../../../../shared/hooks/useNavigate';
import { validateEmail } from '../../../../gathera-lib/validators/UserValidators';
import { ErrorMessage } from '../../../../shared/components/ErrorMessage';
import { capitalizeAllWords } from '../../../../shared/utils/uiHelper';
import { useFetch } from '../../../../shared/hooks/useFetch';
import ListItemButton from '../../../../shared/components/Buttons/ListItemButton';
import { DeleteAccountOverlay } from './DeleteAccountOverlay';
import { Colours } from '../../../../shared/styles/Styles';
import { DeleteIcon } from '../../../../shared/components/Core/Icons';

export const Account = () => {
    const { user, setUser } = getAuthContextValues();
    const { goBack } = useNavigate();
    const { fetchAsync: updateProfile, error: updateProfileError, isLoading: updateProfileIsLoading } = useFetch();

    const [fname, setFname] = React.useState(user.fname);
    const [lname, setLname] = React.useState(user.lname);
    const [email, setEmail] = React.useState(user.email);

    const [showDeleteAccountOverlay, setShowDeleteAccountOverlay] = React.useState(false);
    const [canSubmit, setCanSubmit] = React.useState(false);

    const updateAccount = async () => {
        const fields: any = {
            fname,
        };
        if (lname) fields.lname = lname;
        if (email) fields.email = email;

        updateProfile(
            {
                url: '/user/profile/update',
                method: 'PATCH',
                body: { fields },
            },
            (updatedProfile) => {
                setUser(updatedProfile);
                goBack();
            },
        );
    };

    const onFirstNameChange = (text: string) => {
        setFname(text);

        if (text != user.fname && !canSubmit) {
            setCanSubmit(true);
        } else if (text == user.fname && canSubmit) {
            setCanSubmit(false);
        }
    };

    const onLastNameChange = (text: string) => {
        setLname(text);
        if (text != user.lname && !canSubmit) {
            setCanSubmit(true);
        } else if (text == user.lname && canSubmit) {
            setCanSubmit(false);
        }
    };

    const onEmailChange = (text: string) => {
        setEmail(text);

        if (text != user.email && !canSubmit && validateEmail(text)) {
            setCanSubmit(true);
        } else if ((text == user.email || !validateEmail(text)) && canSubmit) {
            setCanSubmit(false);
        }
    };

    return (
        <HeaderPageLayout
            title="Account"
            submit={{
                canSubmit: canSubmit,
                label: 'Save',
                onSubmit: updateAccount,
                isLoading: updateProfileIsLoading,
            }}
            hasTopMargin
        >
            <ScrollView style={styles.list} contentContainerStyle={styles.contentContainer}>
                {updateProfileError && <ErrorMessage message={updateProfileError} />}
                <SingleLineTextInput label="First Name" value={fname} onChangeText={onFirstNameChange} maxLength={25} />
                <SingleLineTextInput label="Last Name" value={lname} onChangeText={onLastNameChange} maxLength={25} />
                <SingleLineTextInput label="Email" value={email} onChangeText={onEmailChange} maxLength={320} />
                <SingleLineTextInput label="Gender" value={capitalizeAllWords(user.gender)} editable={false} />
                <SingleLineTextInput label="Phone Number" value={user.phone_number} editable={false} />
                <SingleLineTextInput label="Date of Birth" value={new Date(user.date_of_birth).toLocaleDateString()} editable={false} />
                <ListItemButton
                    icon={<DeleteIcon color={Colours.RED} />}
                    labelText="Delete Account"
                    onPress={() => setShowDeleteAccountOverlay(true)}
                    style={{ marginLeft: -5, marginTop: 10 }}
                    labelStyle={styles.signOutText}
                    hideArrow
                />
            </ScrollView>
            <DeleteAccountOverlay visible={showDeleteAccountOverlay} dismiss={() => setShowDeleteAccountOverlay(false)} />
        </HeaderPageLayout>
    );
};

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    contentContainer: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        gap: 10,
    },
    signOutText: {
        color: Colours.RED,
    },
});
