import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { HeaderPageLayout } from '../../../../../shared/layouts/HeaderPageLayout';
import { BooleanSwitch } from '../../../../../shared/components/LabelInputs/BooleanSwitch';
import { Colours, Sizes } from '../../../../../shared/styles/Styles';
import { getAuthContextValues } from '../../../../../shared/context/AuthContext';
import { useNavigate } from '../../../../../shared/hooks/useNavigate';
import { useFetch } from '../../../../../shared/hooks/useFetch';
import { ErrorMessage } from '../../../../../shared/components/ErrorMessage';

export const PrivacyPicker = ({ profile, setProfile }: any) => {
    const [isPublic, setIsPublic] = useState<boolean>(profile.is_public as boolean);
    const { setUser } = getAuthContextValues();
    const { fetchAsync: updateProfile, error: updateProfileError, isLoading: updateProfileIsLoading } = useFetch();
    const { goBack } = useNavigate();

    const handleSubmit = async () => {
        updateProfile(
            {
                url: '/user/profile/update',
                method: 'PATCH',
                body: { fields: { is_public: isPublic } },
            },
            (updatedProfile) => {
                setUser(updatedProfile);
                setProfile(updatedProfile);
                goBack();
            }
        );
    };

    return (
        <HeaderPageLayout
            submit={{
                canSubmit: isPublic !== profile.is_public,
                label: 'Save',
                onSubmit: handleSubmit,
                isLoading: updateProfileIsLoading,
            }}
            title='Manage Privacy'
        >
            {updateProfileError && <ErrorMessage message={updateProfileError} />}
            <View style={styles.detailRow}>
                <BooleanSwitch label='Private Account' value={!isPublic} onValueChange={(val) => setIsPublic(!val)} />
            </View>
            <Text style={styles.noteText}>
                Switching from <Text style={styles.boldText}>Private</Text> to <Text style={styles.boldText}>Public</Text> will accept all pending
                follow requests
            </Text>
        </HeaderPageLayout>
    );
};

const styles = StyleSheet.create({
    detailRow: {
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    label: { fontSize: Sizes.FONT_SIZE_MD, fontWeight: '500' },
    noteText: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.GRAY,
        paddingHorizontal: 15,
    },
    boldText: {
        fontWeight: '600',
    },
});
