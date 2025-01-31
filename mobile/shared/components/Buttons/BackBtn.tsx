import { StyleSheet } from 'react-native';
import React from 'react';
import { BackIcon } from '../Core/Icons';
import { Colours } from '../../styles/Styles';
import { useNavigation } from '@react-navigation/native';

interface BackBtnProps {
    handleBackBtnPress?: () => void;
    color?: string;
    positionRelative?: boolean;
}

const BackBtn = ({ handleBackBtnPress, color = Colours.DARK, positionRelative = false }: BackBtnProps) => {
    const navigation = useNavigation();

    const onPress = () => {
        handleBackBtnPress ? handleBackBtnPress() : navigation.goBack();
    };

    return <BackIcon size={30} style={positionRelative ? {} : styles.backBtn} onPress={onPress} color={color} />;
};

export default BackBtn;

const styles = StyleSheet.create({
    backBtn: {
        position: 'absolute',
        zIndex: 10,
        left: 10,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
