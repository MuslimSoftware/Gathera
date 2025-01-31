import { StyleSheet, TextInput } from 'react-native';
import React from 'react';
import { Colours, Sizes } from '../../styles/Styles';
import { FormLabel } from '../Forms/FormLabel';
import { FormRow } from '../Forms/FormRow';

interface LongTextInputProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (value: string) => void;
    maxLength?: number;
    editable?: boolean;
    autoFocus?: boolean;
    labelHint?: string;
    allowSkipLine?: boolean;
}

export const LongTextInput = ({
    label,
    placeholder = '',
    value,
    onChangeText,
    maxLength = 100,
    editable = true,
    autoFocus = false,
    allowSkipLine = false,
    labelHint
}: LongTextInputProps) => {
    return (
        <FormRow>
            <FormLabel label={label ?? ''} labelHint={labelHint} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                multiline={true}
                maxLength={maxLength}
                editable={editable}
                autoFocus={autoFocus}
                blurOnSubmit={!allowSkipLine}
            />
        </FormRow>
    );
};

const styles = StyleSheet.create({
    input: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 12.5,
        fontSize: Sizes.FONT_SIZE_MD,
        backgroundColor: Colours.GRAY_EXTRA_LIGHT,
        borderRadius: Sizes.BORDER_RADIUS_SM
    }
});
