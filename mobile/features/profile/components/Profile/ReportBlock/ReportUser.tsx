import { StyleSheet, View, Text } from 'react-native';
import React from 'react';
import { TextButton } from '../../../../../shared/components/Buttons/TextButton';
import { Colours, Sizes } from '../../../../../shared/styles/Styles';
import { LongTextInput } from '../../../../../shared/components/LabelInputs/LongTextInput';
import { ReportReason } from '../../../../../gathera-lib/enums/report';
import { useReportUser } from '../../../hooks/useReportUser';
import { MoreActionsLayout } from './MoreActionsLayout';
import { EditIcon } from '../../../../../shared/components/Core/Icons';
import { GrayButton } from '../../../../../shared/components/Buttons/GrayButton';
import { PrimaryButton } from '../../../../../shared/components/Buttons/PrimaryButton';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { useToastError } from '../../../../../shared/hooks/useToastError';

const TITLE = 'Why are you reporting this user?';
const SUB_TITLE = 'Your report is anonymous and helps to keep our community safe.';
const MIN_DESCRIPTION_LENGTH = 50;

const buttons = [
    {
        label: 'Spam and unsolicited advertising',
        type: ReportReason.Spam,
    },
    {
        label: 'Verbal abuse, harassment and hate speech',
        type: ReportReason.Abuse,
    },
    {
        label: 'Threats, physical harm and dangerous behavior',
        type: ReportReason.Danger,
    },
    {
        label: 'Impersonation, phishing and scamming',
        type: ReportReason.Security,
    },
    {
        label: 'Inappropriate or offensive content',
        type: ReportReason.Inappropriate,
    },
    {
        label: 'Other',
        type: ReportReason.Other,
    },
];

export const ReportUser = ({ userId, navigation }: { userId: string; navigation: any }) => {
    const bottomSheet = useBottomSheet();
    useFocusEffect(
        React.useCallback(() => {
            bottomSheet.snapToIndex(1);
        }, [bottomSheet])
    );

    const onSendReportSuccess = () => {
        navigation.replace('ReportSuccess');
    };

    const { isLoading, error, selectedReason, setSelectedReason, description, setDescription, reportUser } = useReportUser(
        userId,
        onSendReportSuccess
    );

    useToastError(error);

    const handleReasonPress = (reason: ReportReason) => {
        setSelectedReason(reason);
    };

    const handleSendReport = () => {
        if (description.length < MIN_DESCRIPTION_LENGTH) return;
        reportUser();
    };

    if (selectedReason === null) {
        // No reason has been selected, so show the list of reasons without a text input

        return (
            <MoreActionsLayout title={TITLE} subtitle={SUB_TITLE}>
                {buttons.map((button) => (
                    <ReportReasonButton key={button.label} label={button.label} onPress={() => handleReasonPress(button.type)} />
                ))}
            </MoreActionsLayout>
        );
    }

    if (selectedReason !== null) {
        // A reason has been selected, so show the selected reason and a text input for the user to describe the issue
        const selectedButton = buttons.find((btn) => btn.type === selectedReason);

        return (
            <MoreActionsLayout title={TITLE} subtitle={SUB_TITLE}>
                <View style={styles.reportReasonWrapper}>
                    <EditIcon size={Sizes.ICON_SIZE_SM} color={Colours.GRAY} onPress={() => setSelectedReason(null)} />
                    <ReportReasonButton label={selectedButton!.label} onPress={() => {}} disabled />
                </View>
                <View style={styles.descriptionWrapper}>
                    <View>
                        <LongTextInput
                            label='Describe the issue'
                            placeholder='Write at least 50 characters. (MAX 500)'
                            value={description}
                            onChangeText={(text) => setDescription(text)}
                            maxLength={500}
                            autoFocus
                        />
                        <Text style={styles.descriptionHintText}>Must be 50 characters minimum ({description.length}/500)</Text>
                    </View>

                    <View style={styles.submitRow}>
                        {description.length >= MIN_DESCRIPTION_LENGTH && (
                            <PrimaryButton label='Send report' onPress={handleSendReport} containerStyle={{ flex: 1 }} />
                        )}
                        {description.length < MIN_DESCRIPTION_LENGTH && <GrayButton label='Send report' containerStyle={{ flex: 1 }} />}
                    </View>
                </View>
            </MoreActionsLayout>
        );
    }

    return null; // This should never happen
};

const ReportReasonButton = ({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) => (
    <TextButton label={label} onPress={onPress} containerStyle={styles.buttonWrapper} disabled={disabled} />
);

const styles = StyleSheet.create({
    sendButtonText: {
        color: Colours.PRIMARY,
        fontSize: Sizes.FONT_SIZE_MD,
    },
    reportReasonWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    buttonWrapper: {
        width: '100%',
        paddingHorizontal: 0,
        justifyContent: 'flex-start',
    },
    descriptionWrapper: {
        width: '100%',
        height: 225,
        gap: 15,
    },
    descriptionHintText: {
        color: Colours.GRAY,
        fontSize: Sizes.FONT_SIZE_SM,
    },
    submitRow: {
        width: '100%',
        height: 35,
        justifyContent: 'flex-end',
    },
});
