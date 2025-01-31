import { StatusBar, StyleSheet, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { Colours } from '../../../shared/styles/Styles';
import { CreateConversation } from '../components/CreateConversation';
import { ChatRoomContainer } from './ChatRoomContainer';
import { ChatRoomAddUsersContainer } from './ChatRoomAddUsersContainer';
import { ChatRoomSettingsContainer } from './ChatRoomSettingsContainer';
import { DefaultStackNavigator } from '../../../shared/components/Core/DefaultStackNavigator';
import { ConversationsContainer } from './ConversationsContainer';

const Stack = createNativeStackNavigator();

export const Inbox = () => {
    return (
        <View style={styles.wrapper}>
            <StatusBar barStyle='dark-content' translucent backgroundColor='transparent' />
            <DefaultStackNavigator>
                <Stack.Screen
                    name='Conversations'
                    component={ConversationsContainer}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name='CreateConversation'
                    component={CreateConversation}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name='ChatRoom'
                    component={ChatRoomContainer}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name='ChatRoomSettings'
                    component={ChatRoomSettingsContainer}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name='ChatRoomAddUsers'
                    component={ChatRoomAddUsersContainer}
                    options={{
                        headerShown: false,
                    }}
                />
            </DefaultStackNavigator>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: Colours.WHITE,
    },
});
