import { StyleSheet } from 'react-native';
import React from 'react';
import { GrayButton } from '../../../../../shared/components/Buttons/GrayButton';
import { ArrowRightIcon } from '../../../../../shared/components/Core/Icons';
import { Loading } from '../../../../../shared/components/Core/Loading';

interface Props {
    label: string;
    onPress: () => void;
    showRightArrow?: boolean;
    isLoading?: boolean;
}

export const ActionButton = ({ label, onPress, showRightArrow = false, isLoading = false }: Props) => {
    if (isLoading) {
        return (
            <GrayButton label='' containerStyle={styles.btnWrapper}>
                <Loading />
            </GrayButton>
        );
    }

    return (
        <GrayButton label={label} containerStyle={styles.btnWrapper} onPress={onPress}>
            {showRightArrow && <ArrowRightIcon style={styles.rightArrow} />}
        </GrayButton>
    );
};

const styles = StyleSheet.create({
    btnWrapper: {
        marginTop: 20,
        width: '100%',
        height: 50,
    },
    rightArrow: {
        position: 'absolute',
        right: 20,
    },
});
