import { Dimensions, StatusBar, StyleSheet } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Colours } from '../../../shared/styles/Styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { getBottomInset } from '../../../shared/utils/uiHelper';

export const GradientLayout = ({ children }: any) => {
    return (
        <>
            <StatusBar barStyle='light-content' translucent backgroundColor='transparent' />
            <LinearGradient
                start={{ x: 1, y: 1 }}
                end={{ x: 1.5, y: 0 }}
                colors={[Colours.PRIMARY_DARK, Colours.PRIMARY_LIGHT]}
                style={[styles.globalWrapper, { height: Dimensions.get('window').height + Constants.statusBarHeight + getBottomInset() }]}
            />
            <SafeAreaView style={styles.contentWrapper}>{children}</SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    globalWrapper: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        width: Dimensions.get('window').width,
    },
    contentWrapper: {
        flex: 1,
    },
});
