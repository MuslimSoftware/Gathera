import { StyleSheet, View } from 'react-native';
import React, { Dispatch, SetStateAction } from 'react';
import { BooleanSwitch } from '../../../shared/components/LabelInputs/BooleanSwitch';
import { Sizes } from '../../../shared/styles/Styles';

interface BooleanSwitchRowProps {
    label: string;
    value: boolean;
    onChange: Dispatch<SetStateAction<boolean>> | ((value: boolean) => void);
}

export const BooleanSwitchRow = ({ label, value, onChange }: BooleanSwitchRowProps) => {
    return (
        <View style={styles.wrapper}>
            <BooleanSwitch label={label} value={value} onValueChange={(val) => onChange(val)} />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    labelText: {
        fontSize: Sizes.FONT_SIZE_LG,
    },
});
