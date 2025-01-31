import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colours } from '../../../../shared/styles/Styles';
import BackBtn from '../../../../shared/components/Buttons/BackBtn';
import FormSubmitButton from '../../../../shared/components/Forms/FormSubmitButton';

interface TopBarProps {
    handleCloseBtnPress: () => void;
    handleDoneBtnPress: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ handleCloseBtnPress, handleDoneBtnPress }: TopBarProps) => {
    return (
        <View style={styles.wrapper}>
            <BackBtn handleBackBtnPress={handleCloseBtnPress} />

            <Text style={styles.headerLabelText}>Edit Profile</Text>
            <View style={styles.button}>
                <FormSubmitButton text='Save' onSubmit={handleDoneBtnPress} />
            </View>
        </View>
    );
};

export default TopBar;

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: Colours.GRAY_LIGHT,
        borderBottomWidth: 1,

        backgroundColor: Colours.WHITE,
    },
    button: {
        position: 'absolute',
        right: 0,
        width: 80,
        height: '85%',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerLabelText: {
        fontSize: 17,
    },
    btnText: {
        fontSize: 17,
        color: Colours.PRIMARY,
    },
});
