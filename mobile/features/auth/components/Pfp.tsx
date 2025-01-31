import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AuthStackLayout from '../layouts/AuthStackLayout';
import { Colours, Sizes } from '../../../shared/styles/Styles';
import { ImagePicker } from '../../../shared/components/ImagePicker';
import { getSignUpContextValues } from '../../../shared/context/SignUpContext';
import { useUploadToS3 } from '../hooks/useUploadToS3';
import { AuthErrorMessage } from '../../../shared/components/AuthErrorMessage';
import { getAuthContextValues } from '../../../shared/context/AuthContext';

export const Pfp = () => {
    const { setIsLoggedIn } = getAuthContextValues();
    const { signUpFields } = getSignUpContextValues();
    const [profilePictureBase64, setProfilePictureBase64] = React.useState<string>('');

    const navigateToApp = async () => setIsLoggedIn(true);
    const { uploadImage, error, isLoading } = useUploadToS3(profilePictureBase64, '/user/pre-signed-url', navigateToApp);

    const handleProfilePictureChange = (base64Image: string) => {
        setProfilePictureBase64(base64Image);
    };

    return (
        <AuthStackLayout
            headerText='Set your profile picture'
            subHeaderText='This is how others can see who you are'
            canContinue={!!profilePictureBase64}
            onContinuePress={uploadImage}
            isContinueLoading={isLoading}
            skippable
            onSkipPress={navigateToApp}
            showBackButton={false}
        >
            <ImagePicker sendImageUri={handleProfilePictureChange} size='xxlarge' />
            <View style={styles.nameWrapper}>
                <Text style={styles.nameText}>
                    {signUpFields.fname} {signUpFields.lname}
                </Text>
            </View>
            <AuthErrorMessage message={error} />
        </AuthStackLayout>
    );
};

const styles = StyleSheet.create({
    nameWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    nameText: {
        fontSize: Sizes.FONT_SIZE_2XL,
        color: Colours.WHITE,
        fontWeight: '500',
    },
});
