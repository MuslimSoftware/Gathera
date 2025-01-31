import { KeyboardAvoidingView, Platform, StyleSheet, View, Text } from 'react-native';
import React from 'react';
import { Colours, Sizes } from '../../../shared/styles/Styles';
import { GradientLayout } from './GradientLayout';
import { BackIcon } from '../../../shared/components/Core/Icons';
import { ContinueButton } from '../components/Buttons/ContinueButton';
import { useNavigation } from '@react-navigation/native';

interface AuthStackLayoutProps {
    children: any;
    onContinuePress: () => void;
    headerText: string;

    subHeaderText?: string;
    isContinueLoading?: boolean;
    canContinue?: boolean;
    skippable?: boolean;
    onSkipPress?: () => void;
    showBackButton?: boolean;
}

const AuthStackLayout = ({
    children,
    headerText,
    subHeaderText,
    skippable = false,
    canContinue = true,
    isContinueLoading = false,
    onContinuePress,
    onSkipPress,
    showBackButton = true,
}: AuthStackLayoutProps) => {
    const navigation = useNavigation();

    const behavior = Platform.OS === 'ios' ? 'padding' : 'height';
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 10 : 0;
    return (
        <GradientLayout>
            <View style={styles.headerWrapper}>
                <BackIcon
                    size={35}
                    style={showBackButton ? styles.backBtn : styles.backBtnInvisible}
                    onPress={showBackButton ? navigation.goBack : undefined}
                    color={Colours.WHITE}
                />
                {skippable && onSkipPress && (
                    <Text style={styles.skipText} onPress={onSkipPress}>
                        SKIP
                    </Text>
                )}
            </View>

            <View style={styles.contentWrapper}>
                <View style={styles.textWrapper}>
                    <Text style={styles.headerText}>{headerText}</Text>
                    {subHeaderText && <Text style={styles.subHeaderText}>{subHeaderText}</Text>}
                </View>
                {children}
            </View>
            <KeyboardAvoidingView
                style={styles.continueWrapper}
                behavior={behavior}
                keyboardVerticalOffset={keyboardVerticalOffset}
                pointerEvents='box-none'
            >
                <ContinueButton enabled={canContinue} onPress={onContinuePress} isLoading={isContinueLoading} />
            </KeyboardAvoidingView>
        </GradientLayout>
    );
};

export default AuthStackLayout;

const styles = StyleSheet.create({
    textWrapper: {
        width: '100%',
    },
    headerText: {
        width: '100%',
        textAlign: 'left',
        fontSize: Sizes.FONT_SIZE_3XL,
        fontWeight: 'bold',
        color: 'white',
    },
    subHeaderText: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.WHITE,
    },
    contentWrapper: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 20,
        alignItems: 'center',
    },
    continueWrapper: {
        marginHorizontal: 15,
        marginBottom: Platform.OS === 'android' ? 10 : 0,
    },
    headerWrapper: {
        width: '100%',
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backBtn: {
        color: Colours.WHITE,
    },
    backBtnInvisible: {
        color: Colours.TRANSPARENT,
    },
    skipText: {
        color: Colours.WHITE,
        fontWeight: 'bold',
        fontSize: 20,
        paddingHorizontal: 10,
    },
    buttonWrapper: {
        width: '100%',
        paddingVertical: 12.5,
        backgroundColor: Colours.WHITE,
        borderRadius: 30,
    },
});
