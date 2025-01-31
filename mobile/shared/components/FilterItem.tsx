import React from 'react';
import { StyleSheet } from 'react-native';
import { GrayButton } from './Buttons/GrayButton';
import { Colours, Sizes } from '../styles/Styles';
import { CloseIcon } from './Core/Icons';

interface FilterItemProps {
    label: string;
    onPress: () => void;
    isSelected: boolean;
}

export const FilterItem = React.memo(({ label, onPress, isSelected }: FilterItemProps) => {
    const buttonProps = { label: label.split('_').join(' '), onPress };
    if (isSelected) {
        return <GrayButton {...buttonProps} containerStyle={{ ...styles.buttonContainer, backgroundColor: Colours.PRIMARY_LIGHT }} />;
    } else return <GrayButton {...buttonProps} containerStyle={styles.buttonContainer} />;
});

const styles = StyleSheet.create({
    buttonContainer: {
        justifyContent: 'center',
        minWidth: 40,
        gap: 10,
    },
    closeIcon: {
        position: 'absolute',
        left: 0,
        paddingTop: 3,
    },
});
