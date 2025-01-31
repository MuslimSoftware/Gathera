import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { PrivacyPicker } from '../components/EditProfileBottomSheet/DetailPickers/PrivacyPicker';
import { useProfile } from '../hooks/useProfile';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { Loading } from '../../../shared/components/Core/Loading';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';

export const PrivacyPickerContainer = ({ route }: any) => {
    const { profileId } = route.params;
    const { profile, setProfile, isLoading, error, fetchProfile } = useProfile(profileId);

    useEffect(() => {
        fetchProfile();
    }, []);

    if (isLoading) {
        return (
            <HeaderPageLayout>
                <Loading />
            </HeaderPageLayout>
        );
    }

    if (error || !profile) {
        return (
            <HeaderPageLayout>
                <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={fetchProfile} />}>
                    <ErrorMessage message={error || 'No Profile Found'} />
                </ScrollView>
            </HeaderPageLayout>
        );
    }

    return <PrivacyPicker profile={profile} setProfile={setProfile} />;
};

const styles = StyleSheet.create({});
