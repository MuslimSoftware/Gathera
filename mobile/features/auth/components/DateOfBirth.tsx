import { Platform, StyleSheet, TextInput, View, Text } from 'react-native';
import React, { useRef, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import AuthStackLayout from '../layouts/AuthStackLayout';
import { Sizes } from '../../../shared/styles/Styles';
import { validateDateOfBirth } from '../../../gathera-lib/validators/UserValidators';
import { AuthErrorMessage } from '../../../shared/components/AuthErrorMessage';
import { getSignUpContextValues } from '../../../shared/context/SignUpContext';

const dateToStr = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const DatePickerIOS = ({ age, date, onChange }: any) => {
    return (
        <>
            <DateTimePicker
                value={date}
                display='spinner'
                mode='date'
                onChange={onChange}
                maximumDate={new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate())}
                minimumDate={new Date(1920, 0, 1)}
                textColor='white'
            />
            {age && <Text style={styles.age}>{age} years old</Text>}
        </>
    );
};

const DatePickerAndroid = ({ year, yearInputRef, setYear, month, monthInputRef, setMonth, day, dayInputRef, setDay, onChange, error }: any) => {
    const formatText = (text: string) => {
        // only allow numbers
        text = text.replace(/[^0-9]/g, '');
        return text;
    };

    const handleYearChange = (text: string) => {
        if (text.length > 4) {
            handleMonthChange(`${month}${formatText(text.charAt(4)).length === 0 ? ' ' : text.charAt(4)}`);
            monthInputRef.current?.focus();
            return;
        }

        text = formatText(text);
        setYear(text);

        if (text.length >= 4) {
            setMonth(month + ' ');
            monthInputRef.current?.focus();
        }

        onChange(`${text}-${month}-${day}`);
    };

    const handleMonthChange = (text: string) => {
        if (text.length > 2) {
            setDay(`${day}${formatText(text.charAt(2)).length === 0 ? ' ' : text.charAt(2)}`);
            dayInputRef.current?.focus();
            return;
        }

        text = formatText(text);
        setMonth(text);

        if (text.length >= 2) {
            setDay(day + ' ');
            dayInputRef.current?.focus();
        } else if (text.length === 0) {
            yearInputRef.current?.focus();
        }

        onChange(`${year}-${text}-${day}`);
    };

    const handleDayChange = (text: string) => {
        text = formatText(text);
        setDay(text);

        if (text.length === 0) {
            setMonth(month);
            monthInputRef.current?.focus();
        }

        onChange(`${year}-${month}-${text}`);
    };

    return (
        <View style={styles.inputContainer}>
            <TextInput
                ref={yearInputRef}
                style={[styles.input, styles.yearInput, error && styles.errorBorder]}
                value={year}
                onChangeText={handleYearChange}
                textAlign='center'
                keyboardType='numeric'
                maxLength={5}
                placeholder='YYYY'
                autoFocus
            />
            <TextInput
                ref={monthInputRef}
                style={[styles.input, styles.monthInput, error && styles.errorBorder]}
                value={month}
                onChangeText={handleMonthChange}
                textAlign='center'
                keyboardType='numeric'
                maxLength={3}
                placeholder='MM'
            />
            <TextInput
                ref={dayInputRef}
                style={[styles.input, styles.dayInput, error && styles.errorBorder]}
                value={day}
                onChangeText={handleDayChange}
                textAlign='center'
                keyboardType='numeric'
                maxLength={2}
                placeholder='DD'
            />
        </View>
    );
};

const DateOfBirth = ({ navigation }: any) => {
    const { signUpFields, setSignUpFields } = getSignUpContextValues();
    const [canContinue, setCanContinue] = useState(signUpFields.date_of_birth ? validateDateOfBirth(signUpFields.date_of_birth) : false);
    const [error, setError] = useState('');

    // default date is 18 years ago
    const [dateOfBirth, setDateOfBirth] = useState(
        signUpFields.date_of_birth
            ? new Date(signUpFields.date_of_birth)
            : new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate())
    );
    const [age, setAge] = useState<string | undefined>(undefined);
    const [year, setYear] = useState(signUpFields.date_of_birth?.slice(0, 4) || '');
    const [month, setMonth] = useState(signUpFields.date_of_birth?.slice(5, 7) || '');
    const [day, setDay] = useState(signUpFields.date_of_birth?.slice(8, 10) || '');

    const yearInputRef = useRef<TextInput>(null);
    const monthInputRef = useRef<TextInput>(null);
    const dayInputRef = useRef<TextInput>(null);

    const handleSubmit = () => {
        let date = '';

        if (Platform.OS === 'ios') {
            date = dateToStr(dateOfBirth);
        }

        if (Platform.OS === 'android') {
            date = `${year.trim()}-${month.trim()}-${day.trim()}`;
        }

        setSignUpFields((prevFields) => {
            return { ...prevFields, date_of_birth: date };
        });
        navigation.navigate('GenderInput');
    };

    const onChange = (event: any, selectedDate: any) => {
        setError('');
        const currentDate = selectedDate || dateOfBirth;
        const today = new Date();
        let age = today.getFullYear() - currentDate.getFullYear();
        const monthDifference = today.getMonth() - currentDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < currentDate.getDate())) {
            age--;
        }

        setAge(age.toString());
        setDateOfBirth(currentDate);
        if (Platform.OS === 'android') {
            const isValid = validateDateOfBirth(event);
            const dayText = event.slice(8, 10);
            const isValidDay = parseInt(dayText) > 0 && parseInt(dayText) < 32;
            setCanContinue(isValid && isValidDay);
            if (!isValid && event.length === 10) {
                setError('Please enter a valid date of birth. Must be 18 years or older.');
            }
        }
    };

    return (
        <AuthStackLayout
            onContinuePress={handleSubmit}
            headerText="What's your birthday?"
            subHeaderText='Your profile shows your age, not your birth date.'
            canContinue={Platform.OS === 'ios' ? true : canContinue}
        >
            {Platform.OS === 'ios' && <DatePickerIOS age={age} date={dateOfBirth} onChange={onChange} />}

            {Platform.OS === 'android' && (
                <DatePickerAndroid
                    year={year}
                    yearInputRef={yearInputRef}
                    setYear={setYear}
                    month={month}
                    monthInputRef={monthInputRef}
                    setMonth={setMonth}
                    day={day}
                    dayInputRef={dayInputRef}
                    setDay={setDay}
                    onChange={onChange}
                    error={error}
                />
            )}
            <AuthErrorMessage message={error} />
        </AuthStackLayout>
    );
};

export default DateOfBirth;

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: Platform.OS === 'ios' ? 10 : 5,
        fontSize: 16,
        textAlign: 'center',
    },
    yearInput: {
        width: '35%',
    },
    monthInput: {
        width: '25%',
        marginHorizontal: 5,
    },
    dayInput: {
        width: '25%',
    },
    age: {
        color: 'white',
        fontSize: Sizes.FONT_SIZE_XL,
        fontWeight: '500',
    },
    errorBorder: {
        borderColor: 'red',
        borderWidth: 1,
    },
});
