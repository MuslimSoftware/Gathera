import { StyleSheet, Switch, SwitchProps, View } from 'react-native';
import React from 'react';
import { FormLabel } from '../Forms/FormLabel';
import { Colours } from '../../styles/Styles';

interface BooleanSwitchProps extends SwitchProps {
    label: string;
    value: boolean;
}

export const BooleanSwitch = ({ label, value, ...props }: BooleanSwitchProps) => {
    return (
        <View style={styles.switchWrapper}>
            <FormLabel label={label} />
            <Switch value={value} trackColor={{ false: Colours.GRAY, true: Colours.PRIMARY }} thumbColor={Colours.WHITE} {...props} />
        </View>
    );
};

const styles = StyleSheet.create({
    switchWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
});
