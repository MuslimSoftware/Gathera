import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { getAuthContextValues } from '../../../../shared/context/AuthContext';
import { CreateGatheringInputs } from './CreateGathering/CreateGatheringInputs';
import { Form } from '../../../../shared/components/Forms/Form';
import { ImagePicker } from '../../../../shared/components/ImagePicker';
import { useNavigate } from '../../../../shared/hooks/useNavigate';
import { MAX_GATHERING_COUNT, MAX_GATHERING_NAME_LENGTH, MIN_GATHERING_COUNT } from '../../../../gathera-lib/constants/gathering';
import { useUploadToS3 } from '../../../auth/hooks/useUploadToS3';
import {
    validateGatheringDescription,
    validateGatheringEventDate,
    validateGatheringName,
    validateMaxGatheringCount,
} from '../../../../gathera-lib/validators/GatheringValidators';
import { useFetch } from '../../../../shared/hooks/useFetch';
import { ErrorMessage } from '../../../../shared/components/ErrorMessage';

interface CreateGatheringProps {
    place: any;
}

const CreateGathering = React.memo(({ place }: CreateGatheringProps) => {
    const { replaceScreen } = useNavigate();
    const {
        user: { display_name },
        accessToken,
    } = getAuthContextValues();
    const { fetchAsync: createGathering, error: createGatheringError, isLoading: createGatheringIsLoading } = useFetch();

    const [base64Image, setBase64Image] = React.useState<string>('');
    const [createdGatheringId, setCreatedGatheringId] = React.useState<string>('');

    const navigateToCreatedGathering = () => replaceScreen('Gathering', { gatheringId: createdGatheringId });
    const {
        uploadImage,
        error: uploadError, // TODO: Handle error
        isLoading: isUploadLoading, // TODO: Handle loading state
    } = useUploadToS3(base64Image, `/gathering/pre-signed-url/${createdGatheringId}`, navigateToCreatedGathering);

    const [description, setDescription] = React.useState<string>('');

    // Set event date to be next week at 8pm
    const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    defaultDate.setHours(20);
    defaultDate.setMinutes(0);

    const [eventDate, setEventDate] = React.useState<Date>(defaultDate);
    const [maxCount, setMaxCount] = React.useState<number>(Math.floor((MAX_GATHERING_COUNT + MIN_GATHERING_COUNT) / 2));
    const [isPublic, setIsPublic] = React.useState<boolean>(true);

    const gatheringNamePostfix = "'s Gathering";
    const [title, setTitle] = React.useState<string>(
        display_name.slice(0, MAX_GATHERING_NAME_LENGTH - gatheringNamePostfix.length) + gatheringNamePostfix
    );

    const handleCreateButtonPress = async () => {
        const gatheringFields: any = {
            place_id: place._id,
            is_private: !isPublic,
            event_date: eventDate,
            max_count: maxCount,
        };
        if (!base64Image) gatheringFields.gathering_pic = place.photos[1];
        if (title) gatheringFields.gathering_name = title;
        if (description) gatheringFields.gathering_description = description;

        createGathering(
            {
                url: `/gathering/create`,
                method: 'POST',
                body: gatheringFields,
            },
            (createdGathering) => {
                setCreatedGatheringId(createdGathering._id);
            }
        );
    };

    useEffect(() => {
        // If gathering is created and there is an image, upload the image. The uploadImage function will navigate to the created gathering.
        if (createdGatheringId && base64Image) uploadImage();
        // If gathering is created and there is no image, navigate to the created gathering.
        else if (createdGatheringId) navigateToCreatedGathering();
    }, [createdGatheringId]);

    const canSubmit = useMemo(() => {
        return (
            validateGatheringName(title) &&
            validateGatheringEventDate(eventDate) &&
            validateGatheringDescription(description) &&
            validateMaxGatheringCount(maxCount) &&
            !isUploadLoading
        );
    }, [title, eventDate, description, maxCount, isUploadLoading]);

    return (
        <KeyboardAvoidingView behavior='height' style={styles.wrapper} keyboardVerticalOffset={100}>
            <Form
                formTitle='Create Gathering'
                submit={{
                    label: 'Create',
                    onSubmit: handleCreateButtonPress,
                    canSubmit: canSubmit,
                    isLoading: isUploadLoading || createGatheringIsLoading,
                }}
                isBottomSheet
            >
                {createGatheringError && <ErrorMessage message={createGatheringError} />}
                <ImagePicker sendImageUri={setBase64Image} defaultImageUri={place.photos[1]} />
                <CreateGatheringInputs
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    eventDate={eventDate}
                    setEventDate={setEventDate}
                    maxCount={maxCount}
                    setMaxCount={setMaxCount}
                    isPublic={isPublic}
                    setIsPublic={setIsPublic}
                />
            </Form>
        </KeyboardAvoidingView>
    );
});

export default CreateGathering;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    bodyWrapper: {},
});
