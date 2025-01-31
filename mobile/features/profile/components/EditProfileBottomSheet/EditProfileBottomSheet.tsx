import { StyleSheet } from 'react-native';
import React, { Dispatch, SetStateAction, useCallback, useMemo, useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import ProfileEditSection from './ProfileEditSection';
import { getAuthContextValues } from '../../../../shared/context/AuthContext';
import { User } from '../../../../types/User';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetailPickers from './DetailPickers/DetailPickers';
import { validateDisplayName } from '../../../../gathera-lib/validators/UserValidators';
import { useUploadToS3 } from '../../../auth/hooks/useUploadToS3';
import { useFetch } from '../../../../shared/hooks/useFetch';

interface EditProfileBottomSheetProps {
    profile: any;
    setProfile: Dispatch<SetStateAction<User>>;
    setShowEditSheet: Dispatch<SetStateAction<boolean>>;
}

const Stack = createNativeStackNavigator();

const EditProfileBottomSheet = ({ profile, setProfile, setShowEditSheet }: EditProfileBottomSheetProps) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['100%'], []);
    const [fieldsToUpdate, setFieldsToUpdate] = useState<object>({});
    const [newPfp, setNewPfp] = useState<string>('');
    const [canSubmit, setCanSubmit] = useState<boolean>(false);
    const { setUser } = getAuthContextValues();
    const { fetchAsync: updateProfile, error: updateProfileError, isLoading: updateProfileIsLoading } = useFetch();

    const { uploadImage, error: uploadImageError, isLoading: uploadIsLoading } = useUploadToS3(newPfp, '/user/pre-signed-url');

    const closeSheet = () => {
        if (bottomSheetRef.current) {
            bottomSheetRef.current.close();
        }
        setFieldsToUpdate({});
        setNewPfp('');
    };

    const handleSubmit = async () => {
        if (newPfp) {
            await uploadImage();
        }

        if (!(Object.keys(fieldsToUpdate).length > 0)) {
            closeSheet();
            return;
        }

        updateProfile(
            {
                url: '/user/profile/update',
                method: 'PATCH',
                body: { fields: fieldsToUpdate },
            },
            (updatedProfile) => {
                setProfile(updatedProfile);
                setUser(updatedProfile);
                closeSheet();
            }
        );
    };

    const onCloseEnd = useCallback(() => {
        setShowEditSheet(false);
    }, [setShowEditSheet]);

    const handleOnChange = async (input: string | boolean, field: string) => {
        const canAddInstagramName = field === 'instagram_username' && input !== '';
        const canAddBio = field === 'bio' && input !== '';

        if (field === 'display_name' && !validateDisplayName(input as string)) {
            setCanSubmit(false);
            return;
        }

        if ((profile[field] !== undefined || canAddInstagramName || canAddBio) && profile[field] !== input) {
            setFieldsToUpdate((fieldsToUpdate: any) => {
                fieldsToUpdate[field] = input;
                setCanSubmit(true);
                return fieldsToUpdate;
            });
        } else {
            setFieldsToUpdate((fieldsToUpdate: any) => {
                delete fieldsToUpdate[field];
                if (Object.keys(fieldsToUpdate).length === 0) {
                    setCanSubmit(false);
                }
                return fieldsToUpdate;
            });
        }
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={0}
            style={styles.sheet}
            containerStyle={styles.container}
            detached={true}
            handleComponent={() => <></>}
            enablePanDownToClose={false}
            enableOverDrag={false}
            enableContentPanningGesture={false}
            onClose={onCloseEnd}
        >
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
                initialRouteName='ProfileEditSection'
            >
                <Stack.Screen name='ProfileEditSection'>
                    {(props: any) => (
                        <ProfileEditSection
                            {...props}
                            profile={profile}
                            setProfile={setProfile}
                            setNewPfp={setNewPfp}
                            handleOnChange={handleOnChange}
                            handleSubmit={handleSubmit}
                            isLoading={updateProfileIsLoading || uploadIsLoading}
                            canSubmit={canSubmit || newPfp}
                            handleClose={closeSheet}
                            error={updateProfileError || uploadImageError}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name='DetailPickers'>
                    {(props: any) => <DetailPickers {...props} profile={profile} setProfile={setProfile} />}
                </Stack.Screen>
            </Stack.Navigator>
        </BottomSheet>
    );
};

export default EditProfileBottomSheet;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 10,
        width: '100%',
    },
    sheet: {
        width: '100%',
    },
});
