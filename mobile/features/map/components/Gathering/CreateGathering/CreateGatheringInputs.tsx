import React from 'react';
import { SingleLineTextInput } from '../../../../../shared/components/LabelInputs/SingleLineTextInput';
import { LongTextInput } from '../../../../../shared/components/LabelInputs/LongTextInput';
import { DateInput } from '../../../../../shared/components/LabelInputs/DateInput';
import { NumberSlider } from '../../../../../shared/components/LabelInputs/NumberSlider';
import { BooleanSwitch } from '../../../../../shared/components/LabelInputs/BooleanSwitch';
import {
    MAX_GATHERING_COUNT,
    MAX_GATHERING_DESCRIPTION_LENGTH,
    MAX_GATHERING_NAME_LENGTH,
    MIN_GATHERING_COUNT,
} from '../../../../../gathera-lib/constants/gathering';

interface CreateGatheringInputsProps {
    title: string;
    setTitle: (title: string) => void;
    description: string;
    setDescription: (description: string) => void;
    eventDate: Date;
    setEventDate: (eventDate: Date) => void;
    maxCount: number;
    setMaxCount: (maxCount: number) => void;
    isPublic: boolean;
    setIsPublic: (isPublic: boolean) => void;
}

export const CreateGatheringInputs = ({
    title,
    setTitle,
    description,
    setDescription,
    eventDate,
    setEventDate,
    maxCount,
    setMaxCount,
    isPublic,
    setIsPublic,
}: CreateGatheringInputsProps) => {
    return (
        <>
            <SingleLineTextInput label={'Title'} value={title} onChangeText={setTitle} maxLength={MAX_GATHERING_NAME_LENGTH} />
            <LongTextInput
                label={'Description'}
                labelHint={'(Optional)'}
                value={description}
                onChangeText={setDescription}
                maxLength={MAX_GATHERING_DESCRIPTION_LENGTH}
            />
            <DateInput date={eventDate} setDate={setEventDate} />
            <NumberSlider
                label='Max Users'
                minimumValue={MIN_GATHERING_COUNT}
                maximumValue={MAX_GATHERING_COUNT}
                value={maxCount}
                onValueChange={(value) => setMaxCount(value)}
            />
            <BooleanSwitch label='Public Gathering' value={isPublic} onValueChange={(value) => setIsPublic(value)} />
        </>
    );
};
