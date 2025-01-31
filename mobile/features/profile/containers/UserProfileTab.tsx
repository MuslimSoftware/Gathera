import { StatusBar, View, StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { getAuthContextValues } from '../../../shared/context/AuthContext';
import { Colours } from '../../../shared/styles/Styles';
import { DefaultStackNavigator } from '../../../shared/components/Core/DefaultStackNavigator';
import { ProfileContainer } from './ProfileContainer';

const Stack = createNativeStackNavigator();

export const UserProfileTab = React.memo(() => {
    const {
        user: { _id: userId },
    } = getAuthContextValues();

    return (
        <View style={styles.wrapper}>
            <StatusBar barStyle='dark-content' translucent backgroundColor='transparent' />
            <DefaultStackNavigator>
                <Stack.Screen name='Profile' component={ProfileContainer} initialParams={{ profileId: userId }} />
            </DefaultStackNavigator>
        </View>
    );
});

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: Colours.WHITE,
    },
});
