import { Platform, StyleSheet } from 'react-native';
import React from 'react';
import DatePickerIOS from './DateTimePickers/DatePickerIOS';
import DatePickerAndroid from './DateTimePickers/DatePickerAndroid';

interface DateTimePickerProps {
    isDisabled?: boolean;
    date: Date;
    minDate?: Date;
    maxDate?: Date;
    setDate: (date: Date) => void;
}

const DatePicker = ({ isDisabled = false, date, minDate, maxDate, setDate }: DateTimePickerProps) => {
    const handleEventDateChange = (date: Date) => {
        setDate(date);
    };

    return Platform.OS === 'ios' ? (
        <DatePickerIOS date={date} handleEventDateChange={handleEventDateChange} isDisabled={isDisabled} minDate={minDate} maxDate={maxDate} />
    ) : (
        <DatePickerAndroid date={date} handleEventDateChange={handleEventDateChange} isDisabled={isDisabled} minDate={minDate} maxDate={maxDate} />
    );
};

export default DatePicker;

const styles = StyleSheet.create({});
