import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SingleLineTextInput } from '../../../../shared/components/LabelInputs/SingleLineTextInput';
import { LongTextInput } from '../../../../shared/components/LabelInputs/LongTextInput';
import { Form } from '../../../../shared/components/Forms/Form';
import { ImagePicker } from '../../../../shared/components/ImagePicker';
import { EditAboutMe } from './EditAboutMe';
import { useNavigation, useRoute } from '@react-navigation/native';
import { EditMyBasics } from './EditMyBasics';
import { DetailListItem } from './DetailListItem';
import { getNavigationBarBottomPadding } from '../../../../shared/utils/uiHelper';
import { ErrorMessage } from '../../../../shared/components/ErrorMessage';

interface ProfileEditSectionProps {
    profile: any;
    handleOnChange: Function;
    setNewPfp: (base64Image: string) => void;
    handleSubmit: () => void;
    handleClose: () => void;
    isLoading: boolean;
    setProfile: Function;
    canSubmit: boolean;
    error?: string;
}

const ProfileEditSection = ({
    profile,
    handleOnChange,
    setNewPfp,
    handleSubmit,
    handleClose,
    isLoading,
    setProfile,
    canSubmit,
    error,
}: ProfileEditSectionProps) => {
    const navigation: any = useNavigation();
    const route: any = useRoute();

    useEffect(() => {
        if (route.params && route.params.details) {
            setProfile({ ...profile, details: route.params.details });
        }
    }, [route]);

    const [instagramUsername, setInstagramUsername] = useState<string>(profile.instagram_username);
    const [displayName, setDisplayName] = useState<string>(profile.display_name);
    const [bio, setBio] = useState<string>(profile.bio);

    return (
        <Form
            formTitle='Edit Profile'
            close={{
                label: 'Close',
                onClose: () => handleClose(),
            }}
            submit={{
                label: 'Save',
                onSubmit: handleSubmit,
                canSubmit: canSubmit,
                isLoading: isLoading,
            }}
        >
            {error && <ErrorMessage message={error} />}
            <ImagePicker sendImageUri={setNewPfp} defaultImageUri={profile.avatar_uri} border={profile.border} />
            <SingleLineTextInput
                label='Display Name'
                placeholder='Enter your name...'
                value={displayName}
                subLabel='Only letters, spaces and - are allowed'
                onChangeText={(text) => {
                    setDisplayName(text);
                    handleOnChange(text, 'display_name');
                }}
                maxLength={50}
            />
            <LongTextInput
                label='Bio'
                placeholder='Enter your bio...'
                onChangeText={(text) => {
                    setBio(text);
                    handleOnChange(text, 'bio');
                }}
                value={bio}
                allowSkipLine
                maxLength={250}
            />
            <SingleLineTextInput
                label='Instagram'
                placeholder='Enter your Instagram username...'
                value={instagramUsername}
                onChangeText={(text) => {
                    setInstagramUsername(text);
                    handleOnChange(text, 'instagram_username');
                }}
                maxLength={35}
            />
            <View>
                <DetailListItem
                    label='Manage Borders'
                    onPress={() =>
                        navigation.navigate('DetailPickers', {
                            screen: 'BorderPicker',
                            params: { profileId: profile._id },
                        })
                    }
                    hideNotification
                />
                <DetailListItem
                    label='Manage Privacy'
                    onPress={() =>
                        navigation.navigate('DetailPickers', {
                            screen: 'PrivacyPicker',
                            params: { profileId: profile._id },
                        })
                    }
                    hideNotification
                />
                <DetailListItem
                    label='Manage Interests'
                    value={profile.interests.length > 0 ? `${profile.interests.length}` : undefined}
                    onPress={() =>
                        navigation.navigate('DetailPickers', {
                            screen: 'InterestsPicker',
                        })
                    }
                    hideNotification
                />
            </View>
            <EditMyBasics profile={profile} />
            <EditAboutMe profile={profile} />
            <View style={{ height: getNavigationBarBottomPadding() }} />
        </Form>
    );
};

export default ProfileEditSection;
