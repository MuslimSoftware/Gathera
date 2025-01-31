import { Pressable, StyleSheet, TextInput, TextInputProps, View, Text, Platform } from 'react-native';
import React, { ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { Colours, Sizes } from '../../../shared/styles/Styles';
import { AuthErrorMessage } from '../../../shared/components/AuthErrorMessage';
import { useFocusEffect } from '@react-navigation/native';
import { useOnFocus } from '../../../shared/hooks/useOnFocus';
import { set } from 'react-native-reanimated';

interface OTPInputProps extends TextInputProps {
    value: string;
    setValue: (value: string) => void;
    maxLength: number;
    error: string;
}

export const OTPInput = ({ maxLength, error, ...props }: OTPInputProps) => {
    const digitInputs: Array<number> = Array(maxLength).fill(0);
    const textInputRef: RefObject<TextInput> = useRef<TextInput>(null);
    const [value, setValue] = useState<string>('');

    useEffect(() => {
        textInputRef.current?.focus();
    }, []);

    const handleDigitPress = (): void => {
        if (textInputRef.current) {
            if (textInputRef.current.isFocused()) {
                textInputRef.current.blur();
            }
            textInputRef.current.focus();
        }
    };

    const renderDigitInput = (digit: number, index: number): ReactNode => {
        const space: string = ' ';
        const digitValue: string = value[index] || space;
        const isCurrentDigit: boolean = index === value.length - 1;

        return (
            <Pressable
                style={[styles.digit, error ? styles.digitsError : isCurrentDigit && styles.focusedDigit]}
                key={index}
                onPress={handleDigitPress}
            >
                <Text style={styles.digitLabel}>{digitValue}</Text>
            </Pressable>
        );
    };

    return (
        <View style={styles.globalWrapper}>
            <View style={styles.digitsWrapper}>{digitInputs.map(renderDigitInput)}</View>
            <TextInput
                style={styles.hiddenTextInput}
                value={value}
                onChangeText={(text: string) => {
                    if (props.onChangeText) {
                        props.onChangeText(text);
                        setValue(text);
                    }
                }}
                maxLength={maxLength}
                keyboardType='number-pad'
                returnKeyType='done'
                autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
                ref={textInputRef}
            />
            <AuthErrorMessage message={error} />
        </View>
    );
};

const styles = StyleSheet.create({
    globalWrapper: {
        alignItems: 'center',
    },
    hiddenTextInput: {
        backgroundColor: 'green',
        position: 'absolute',
        top: -1000,
    },
    digitsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    digit: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderRadius: 5,
        backgroundColor: 'white',
        color: 'black',
        fontSize: 18,
        borderWidth: 1.5,
    },
    focusedDigit: {
        borderColor: Colours.DARK,
    },
    digitLabel: {
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: '500',
    },
    digitsError: {
        borderColor: Colours.ERROR,
    },
});
