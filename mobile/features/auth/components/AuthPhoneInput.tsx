import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ValidatedTextInputProps, ValidatedTextInput } from '../../../shared/components/Inputs/ValidatedTextInput';
import { Colours, Sizes } from '../../../shared/styles/Styles';

interface AuthPhoneInputProps extends ValidatedTextInputProps {
    countryCode: string;
    onCountryCodePress: () => void;
}

const AuthPhoneInput = ({ onCountryCodePress, ...props }: AuthPhoneInputProps) => {
    return (
        <View style={styles.inputWrapper}>
            <Pressable onPress={onCountryCodePress} style={styles.countryCodeWrapper}>
                <Text style={styles.countryCodeText}>{props.countryCode}</Text>
            </Pressable>
            <ValidatedTextInput {...props} style={styles.input} hasError={props.hasError} errorMessage={props.errorMessage} maxLength={25} />
        </View>
    );
};

export default AuthPhoneInput;

const styles = StyleSheet.create({
    inputWrapper: {
        width: '100%',
    },
    input: {
        width: '100%',
        paddingLeft: 70,
        borderWidth: 2,
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 18,
        backgroundColor: Colours.WHITE,
        borderColor: Colours.WHITE,
    },
    countryCodeWrapper: {
        position: 'absolute',
        borderTopLeftRadius: Sizes.BORDER_RADIUS_FULL,
        borderBottomLeftRadius: Sizes.BORDER_RADIUS_FULL,
        borderRightWidth: 1,
        borderRightColor: Colours.GRAY_LIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 5,
        zIndex: 1,
        width: 60,
        height: 50,
        left: 0,
    },
    countryCodeText: {
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: '500',
        color: Colours.GRAY,
    },
});
