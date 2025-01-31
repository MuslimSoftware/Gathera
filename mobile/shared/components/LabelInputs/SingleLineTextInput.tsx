import { StyleSheet, TextInput, Text } from 'react-native';
import React from 'react';
import { Colours, Sizes } from '../../styles/Styles';
import { FormLabel } from '../Forms/FormLabel';
import { FormRow } from '../Forms/FormRow';

interface SingleLineTextInputProps extends React.ComponentProps<typeof TextInput> {
    label: string;
    placeholder?: string;
    subLabel?: string;
    value: string;
    editable?: boolean;
}

export const SingleLineTextInput = ({ label, placeholder = '', subLabel, value, onChange, editable = true, ...props }: SingleLineTextInputProps) => {
    const [isEditing, setIsEditing] = React.useState(false);

    return (
        <FormRow>
            <FormLabel label={label} />
            <TextInput
                style={[styles.input, !editable && styles.disabledText]}
                placeholder={placeholder}
                value={value}
                editable={editable}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setIsEditing(false)}
                clearButtonMode='while-editing'
                {...props}
            />
            {subLabel && isEditing && <Text style={styles.subLabel}>{subLabel}</Text>}
        </FormRow>
    );
};

const HORIZONTAL_PADDING = 12.5;

const styles = StyleSheet.create({
    input: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: HORIZONTAL_PADDING,
        fontSize: Sizes.FONT_SIZE_MD,
        backgroundColor: Colours.GRAY_EXTRA_LIGHT,
        borderRadius: Sizes.BORDER_RADIUS_SM,
    },
    disabledText: {
        color: Colours.GRAY,
    },
    subLabel: {
        marginLeft: HORIZONTAL_PADDING,
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.GRAY,
    },
});
