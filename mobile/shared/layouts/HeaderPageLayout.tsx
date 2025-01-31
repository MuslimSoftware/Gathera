import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import BackBtn from '../components/Buttons/BackBtn';
import { Colours, Sizes } from '../styles/Styles';
import Constants from 'expo-constants';
import { Loading } from '../components/Core/Loading';
import { HeaderPageSubmit } from '../components/Forms/Form';

interface HeaderPageLayoutProps {
    title?: string | React.ReactNode;
    children: React.ReactNode;
    submit?: HeaderPageSubmit;
    close?: {
        label: string;
        onClose: () => void;
    };
    headerLeft?: string | undefined;
    headerRight?: React.ReactNode;
    showBackBtn?: boolean;
    hasTopMargin?: boolean;
    hasHeaderPadding?: boolean;
    handleBackBtnPress?: () => void;
    onTitlePress?: () => void;
    backgroundTransparent?: boolean;
    headerStyle?: any;
}

export const HeaderPageLayout = ({
    title,
    children,
    submit,
    close,
    headerRight,
    headerLeft,
    showBackBtn = true,
    hasTopMargin = false,
    hasHeaderPadding = true,
    handleBackBtnPress,
    onTitlePress,
    backgroundTransparent = false,
    headerStyle,
}: HeaderPageLayoutProps) => {
    const headerPadding = hasHeaderPadding
        ? {
              paddingHorizontal: '2.5%',
              paddingVertical: 10,
          }
        : {};

    const bottomBorderStyle =
        typeof title === 'string'
            ? {
                  borderBottomColor: Colours.GRAY_LIGHT,
                  borderBottomWidth: 1,
              }
            : {};

    const titlePaddingLeftStyle = showBackBtn ? { paddingLeft: '10%' } : {};

    if (submit) {
        if (submit.canSubmit === undefined) submit.canSubmit = true;
        if (submit.isLoading === undefined) submit.isLoading = false;
    }

    const renderSubmit = () => {
        if (!submit) return null;

        if (submit.isLoading === true) {
            return (
                <View style={styles.actionButtonWrapper}>
                    <Loading />
                </View>
            );
        }

        return (
            <Pressable style={styles.actionButtonWrapper} onPress={submit.canSubmit ? submit.onSubmit : null}>
                <Text style={[styles.actionButtonText, submit.canSubmit && { color: Colours.PRIMARY }]}>{submit.label}</Text>
            </Pressable>
        );
    };

    return (
        <View
            style={[
                styles.wrapper,
                hasTopMargin && { paddingTop: Constants.statusBarHeight },
                backgroundTransparent && { backgroundColor: 'transparent' },
            ]}
        >
            <View style={[styles.header, headerPadding, bottomBorderStyle, headerStyle]}>
                {headerLeft && <Text style={[styles.title, styles.headerLeftWrapper]}>{headerLeft}</Text>}
                {close && (
                    <Pressable style={styles.closeBtn} onPress={close.onClose}>
                        <Text style={styles.closeText}>{close.label}</Text>
                    </Pressable>
                )}
                {showBackBtn && !close && <BackBtn handleBackBtnPress={handleBackBtnPress} />}
                {title && typeof title === 'string' && (
                    <Text style={styles.title} onPress={onTitlePress && onTitlePress} numberOfLines={1}>
                        {title}
                    </Text>
                )}
                {title && typeof title !== 'string' && <Pressable style={[styles.componentTitleWrapper, titlePaddingLeftStyle]}>{title}</Pressable>}
                {headerRight && <View style={styles.actionButtonWrapper}>{headerRight}</View>}
                {renderSubmit()}
            </View>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        height: '100%',
        backgroundColor: Colours.WHITE,
    },
    header: {
        width: '100%',
        minHeight: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        maxWidth: '65%',
        fontSize: Sizes.FONT_SIZE_XL,
        fontWeight: '600',
    },
    actionButtonText: {
        fontSize: Sizes.FONT_SIZE_LG,
        fontWeight: '400',
        color: Colours.GRAY_LIGHT,
    },
    actionButtonWrapper: {
        position: 'absolute',
        right: 10,
        padding: 10,
    },
    headerLeftWrapper: {
        position: 'absolute',
        left: 10,
        padding: 10,
    },
    componentTitleWrapper: {
        width: '100%',
    },
    closeBtn: {
        position: 'absolute',
        left: 10,
        padding: 10,
    },
    closeText: {
        fontSize: Sizes.FONT_SIZE_LG,
        fontWeight: '400',
        color: Colours.DARK,
    },
});
