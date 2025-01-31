import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colours, Sizes } from '../../../shared/styles/Styles';
import { GrayButton } from '../Buttons/GrayButton';

interface DateTimePickerProps {
    isDisabled: boolean;
    date: Date;
    minDate?: Date;
    maxDate?: Date;
    handleEventDateChange: (date: Date) => void;
}

const DatePickerAndroid = ({ isDisabled, date, handleEventDateChange, minDate, maxDate }: DateTimePickerProps) => {
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);

    return (
        <View style={styles.wrapper}>
            <GrayButton onPress={isDisabled ? undefined : () => setShowDate(true)} label={date.toDateString()} />
            {showDate && (
                <DateTimePicker
                    accentColor={Colours.PRIMARY}
                    value={date}
                    mode={'date'}
                    display='default'
                    style={styles.datePicker}
                    onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || new Date();
                        setShowDate(false);
                        handleEventDateChange(currentDate);
                    }}
                />
            )}
            <GrayButton
                onPress={isDisabled ? undefined : () => setShowTime(true)}
                label={date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            />
            {showTime && (
                <DateTimePicker
                    accentColor={Colours.PRIMARY}
                    value={date}
                    mode={'time'}
                    display='default'
                    style={styles.datePicker}
                    onChange={(event, selectedTime: any) => {
                        const currentDate =
                            new Date(date.getFullYear(), date.getMonth(), date.getDate(), selectedTime.getHours(), selectedTime.getMinutes()) ||
                            new Date();
                        setShowTime(false);
                        handleEventDateChange(currentDate);
                    }}
                />
            )}
        </View>
    );
};

export default DatePickerAndroid;

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    datePicker: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginLeft: -5,
    },
    labelText: {
        fontSize: Sizes.FONT_SIZE_MD,
        color: Colours.DARK,
    },
});
