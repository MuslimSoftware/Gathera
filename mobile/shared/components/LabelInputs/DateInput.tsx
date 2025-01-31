import React from 'react';
import DatePicker from '../DatePicker';
import { FormLabel } from '../Forms/FormLabel';
import { FormRow } from '../Forms/FormRow';
import { View, Text } from 'react-native';
import { Colours } from '../../styles/Styles';
import { WarningIcon } from '../Core/Icons';
import { StyleSheet } from 'react-native';

interface DateInputProps {
    date: Date;
    setDate: (date: Date) => void;
    minDate?: Date;
    maxDate?: Date;
    label?: string;
    editable?: boolean;
}

export const DateInput = ({ date, setDate, label = 'Date', editable = true, minDate, maxDate }: DateInputProps) => {
    const [dateError, setDateError] = React.useState<string>('');

    const setDateIfValid = (date: Date) => {
        setDate(date);
    };

    return (
        <FormRow>
            <FormLabel label={label} />
            <DatePicker date={date} setDate={setDateIfValid} isDisabled={!editable} minDate={minDate} maxDate={maxDate} />
            {dateError && (
                <View style={styles.errorWrapper}>
                    <WarningIcon color={Colours.WARNING} />
                    <Text numberOfLines={2} style={styles.dateText}>
                        {dateError}
                    </Text>
                </View>
            )}
        </FormRow>
    );
};

const styles = StyleSheet.create({
    errorWrapper: { flexDirection: 'row', gap: 10, alignItems: 'center', width: '95%' },
    dateText: { width: '100%' },
});
