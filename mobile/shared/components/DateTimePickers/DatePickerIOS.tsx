import { StyleSheet } from 'react-native';
import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colours, Sizes } from '../../../shared/styles/Styles';

interface DateTimePickerProps {
    isDisabled: boolean;
    date: Date;
    minDate?: Date;
    maxDate?: Date;
    handleEventDateChange: (date: Date) => void;
}

const DatePickerIOS = (
    { isDisabled, date, handleEventDateChange, minDate, maxDate }: DateTimePickerProps = {
        isDisabled: false,
        date: new Date(),
        handleEventDateChange: (date: Date) => {},
    }
) => {
    return (
        <DateTimePicker
            accentColor={Colours.PRIMARY}
            value={date}
            mode={'datetime'}
            display='default'
            style={styles.datePicker}
            disabled={isDisabled}
            onChange={(event, selectedDate) => {
                const currentDate = selectedDate || new Date();
                handleEventDateChange(currentDate);
            }}
        />
    );
};

export default DatePickerIOS;

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    datePicker: {
        marginLeft: -6,
    },
    labelText: {
        fontSize: Sizes.FONT_SIZE_MD,
        color: Colours.DARK,
    },
});
