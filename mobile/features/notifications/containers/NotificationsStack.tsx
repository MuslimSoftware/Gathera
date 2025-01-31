import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Colours } from '../../../shared/styles/Styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NotificationsScreen } from './NotificationsScreen';
import { InviteRequests } from '../components/InviteRequests';
import { FollowRequests } from '../components/FollowRequests';
import Constants from 'expo-constants';
import { DefaultStackNavigator } from '../../../shared/components/Core/DefaultStackNavigator';

const Stack = createNativeStackNavigator();

export const NotificationsStack = React.memo(() => {
    return (
        <View style={styles.wrapper}>
            <DefaultStackNavigator>
                <Stack.Screen name='Notifications' component={NotificationsScreen} />
                <Stack.Screen name='FollowRequests' component={FollowRequests} />
                <Stack.Screen name='InviteRequests' component={InviteRequests} />
            </DefaultStackNavigator>
        </View>
    );
});

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        backgroundColor: Colours.WHITE,
    },
});
