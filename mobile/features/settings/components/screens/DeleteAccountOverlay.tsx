import React from 'react';
import { StyleSheet, View } from 'react-native';
import { getAuthContextValues } from '../../../../shared/context/AuthContext';
import { Overlay } from '../../../../shared/components/Overlays/Overlay';
import { RedButton } from '../../../../shared/components/Buttons/RedButton';
import { useFetch } from '../../../../shared/hooks/useFetch';
import { Loading } from '../../../../shared/components/Core/Loading';
import { ErrorMessage } from '../../../../shared/components/ErrorMessage';
import { Colours } from '../../../../shared/styles/Styles';
import { GrayButton } from '../../../../shared/components/Buttons/GrayButton';

interface DeleteAccountOverlayProps {
    visible: boolean;
    dismiss: () => any;
}

export const DeleteAccountOverlay = ({ visible, dismiss }: DeleteAccountOverlayProps) => {
    const [accountDeleted, setAccountDeleted] = React.useState(false);
    const { logoutAsync } = getAuthContextValues();
    const { error, isLoading, fetchAsync } = useFetch();

    const confirmDeleteAccount = async () => {
        await fetchAsync({ url: '/user/delete', method: 'DELETE' }, deleteSuccess);
    };

    const deleteSuccess = () => {
        setAccountDeleted(true);
        setTimeout(() => {
            logoutAsync();
        }, 5000);
    };

    if (accountDeleted) {
        return (
            <Overlay
                content={{
                    title: 'Account Deleted',
                    description: 'Your account has been deleted. We are sorry to see you go and hope to see you again soon.',
                    imageSource: require('../../../../assets/images/services/delete-account.png'),
                }}
                dismissOverlay={logoutAsync}
                dismissOnBackdropPress
                modalProps={{ visible }}
            />
        );
    }

    return (
        <Overlay
            content={{
                title: 'Delete Account',
                description: 'Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted.',
                imageSource: require('../../../../assets/images/services/delete-account.png'),
            }}
            dismissOverlay={dismiss}
            dismissOnBackdropPress
            modalProps={{ visible }}
        >
            <View style={styles.buttons}>
                <RedButton label={!isLoading ? 'Permanently Delete Account' : ''} onPress={confirmDeleteAccount} containerStyle={styles.button}>
                    {isLoading && <Loading color={Colours.WHITE} />}
                </RedButton>
                <GrayButton label='Cancel' onPress={dismiss} containerStyle={styles.button} />
            </View>

            <ErrorMessage message={error} />
        </Overlay>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 225,
        height: 35,
    },
    buttons: {
        gap: 10,
    },
});
