import { ScrollView, StyleSheet } from 'react-native';
import React, { useMemo, useState } from 'react';
import { SingleLineTextInput } from '../../../../shared/components/LabelInputs/SingleLineTextInput';
import { LongTextInput } from '../../../../shared/components/LabelInputs/LongTextInput';
import { NumberSlider } from '../../../../shared/components/LabelInputs/NumberSlider';
import { DateInput } from '../../../../shared/components/LabelInputs/DateInput';
import { BooleanSwitch } from '../../../../shared/components/LabelInputs/BooleanSwitch';
import { ImagePicker } from '../../../../shared/components/ImagePicker';
import { Form } from '../../../../shared/components/Forms/Form';
import { useNavigation } from '@react-navigation/native';
import { useNavigate } from '../../../../shared/hooks/useNavigate';
import ListItemButton from '../../../../shared/components/Buttons/ListItemButton';
import { Colours, Sizes } from '../../../../shared/styles/Styles';
import { LeaveIcon } from '../../../../shared/components/Core/Icons';
import { validateFutureDate } from '../../../../gathera-lib/validators/Validators';
import { useUploadToS3 } from '../../../auth/hooks/useUploadToS3';
import {
    validateGatheringDescription,
    validateGatheringName,
    validateMaxGatheringCount,
} from '../../../../gathera-lib/validators/GatheringValidators';
import { getAuthContextValues } from '../../../../shared/context/AuthContext';
import { useFetch } from '../../../../shared/hooks/useFetch';
import { ErrorMessage } from '../../../../shared/components/ErrorMessage';
import { HeaderPageLayout } from '../../../../shared/layouts/HeaderPageLayout';
import { LoadingSkeleton } from '../../../../shared/components/Core/LoadingSkeleton';
import { PROFILE_PIC_SIZES } from '../../../../shared/components/MainPictures/ProfilePicture';
import { Gathering } from '../../../../types/Gathering';

interface GatheringSettingsProps {
    gathering: Gathering;
}

export const GatheringSettings = ({ gathering }: GatheringSettingsProps) => {
    const {
        user: { _id: userId },
    } = getAuthContextValues();
    const { fetchAsync: updateGathering, error: updateGatheringError, isLoading: updateGatheringIsLoading } = useFetch();
    const { fetchAsync: removeUser, error: removeUserError, isLoading: removeUserIsLoading } = useFetch();
    const navigation: any = useNavigation();
    const { currentPage, navigateToPlaceDetails } = useNavigate();
    const [base64Image, setBase64Image] = useState<string>('');
    const {
        uploadImage,
        error: uploadImageError,
        isLoading: isUploadLoading,
    } = useUploadToS3(base64Image, `/gathering/pre-signed-url/${gathering._id}`);

    // Update Fields
    const [title, setTitle] = useState<string>(gathering.gathering_name);
    const [description, setDescription] = useState<string>(gathering.gathering_description);
    const [maxUsers, setMaxUsers] = useState(gathering.max_count);
    const [eventDate, setEventDate] = useState<Date>(new Date(gathering.event_date));
    const [isPrivate, setIsPrivate] = useState<boolean>(gathering.is_private);
    const isUserHost = userId === gathering.host_user;

    const handleSubmit = async () => {
        if (!isUserHost) {
            navigation.goBack();
            return;
        }

        if (base64Image) {
            await uploadImage();
        }

        const fieldsToUpdate: any = {};

        if (title != gathering.gathering_name) fieldsToUpdate.gathering_name = title;
        if (description != gathering.gathering_description) fieldsToUpdate.gathering_description = description;
        if (maxUsers != gathering.max_count) fieldsToUpdate.max_count = maxUsers;
        if (eventDate.toISOString() != gathering.event_date) fieldsToUpdate.event_date = eventDate;
        if (isPrivate != gathering.is_private) fieldsToUpdate.is_private = isPrivate;

        if (Object.keys(fieldsToUpdate).length === 0) {
            // No fields were changed --> go back
            navigation.goBack();
            return;
        }

        updateGathering(
            {
                url: `/gathering/update/${gathering._id}`,
                method: 'PATCH',
                body: fieldsToUpdate,
            },
            () => navigation.goBack()
        );
    };

    const leaveGathering = async (): Promise<void> => {
        removeUser(
            {
                url: `/gathering/remove-user/${gathering._id}`,
                method: 'POST',
            },
            () => {
                if (currentPage == 'Map') {
                    navigateToPlaceDetails();
                } else if (currentPage == 'GatheringSettings') {
                    navigation.goBack();
                    navigation.goBack();
                }
            }
        );
    };

    const isPassed = !validateFutureDate(new Date(gathering.event_date));
    const canEdit = !isPassed && isUserHost;

    const canSubmit = useMemo(() => {
        return (
            validateFutureDate(eventDate) &&
            validateGatheringName(title) &&
            validateGatheringDescription(description) &&
            validateMaxGatheringCount(maxUsers) &&
            !isUploadLoading
        );
    }, [title, description, maxUsers, eventDate, isUploadLoading]);

    const displayedError = uploadImageError || updateGatheringError || removeUserError;
    return (
        <Form
            formTitle='Gathering Settings'
            submit={{ onSubmit: handleSubmit, label: 'Save', canSubmit, isLoading: updateGatheringIsLoading || removeUserIsLoading }}
        >
            {displayedError && <ErrorMessage message={displayedError} />}
            <ImagePicker defaultImageUri={gathering.gathering_pic} sendImageUri={setBase64Image} editable={canEdit} />
            <SingleLineTextInput value={title} onChangeText={setTitle} label='Title' editable={canEdit} maxLength={50} />
            <LongTextInput value={description} onChangeText={setDescription} label='Description' maxLength={100} editable={canEdit} />
            <NumberSlider
                label='Max Users'
                minimumValue={2}
                maximumValue={5}
                value={maxUsers}
                onValueChange={(val) => setMaxUsers(val)}
                disabled={!canEdit}
            />
            <DateInput label='Event Date' date={eventDate} setDate={setEventDate} editable={canEdit} />
            <BooleanSwitch label='Private Gathering' value={isPrivate} onValueChange={(val) => setIsPrivate(val)} disabled={!canEdit} />
            <ListItemButton
                labelText='Leave Gathering'
                icon={<LeaveIcon color={Colours.RED} />}
                onPress={leaveGathering}
                labelStyle={styles.leaveText}
                hideArrow
            />
        </Form>
    );
};

export const GatheringSettingsSkeleton = () => {
    return (
        <HeaderPageLayout title='Gathering Settings'>
            <ScrollView contentContainerStyle={{ width: '100%', alignItems: 'center', gap: 20, paddingVertical: 10 }}>
                <LoadingSkeleton
                    style={{
                        width: PROFILE_PIC_SIZES['large'].width,
                        height: PROFILE_PIC_SIZES['large'].height,
                        borderRadius: Sizes.BORDER_RADIUS_FULL,
                    }}
                />
                <LoadingSkeleton style={{ width: '90%', height: 30 }} />
                <LoadingSkeleton style={{ width: '90%', height: 30 }} />
            </ScrollView>
        </HeaderPageLayout>
    );
};

const styles = StyleSheet.create({
    leaveText: {
        color: Colours.RED,
    },
});
