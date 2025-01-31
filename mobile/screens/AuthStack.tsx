import { StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { NavigationContainer } from '@react-navigation/native';
import { SignUpProvider } from '../shared/context/SignUpContext';
import { Landing, PhoneNumberPage, OTP, Email, Name, DateOfBirth, Gender } from '../features/auth/components';
import { Pfp } from '../features/auth/components/Pfp';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <SignUpProvider>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName='Landing'
                    screenOptions={{
                        headerShown: false,
                        animation: 'slide_from_right',
                    }}
                >
                    <Stack.Screen name='Landing' component={Landing} />
                    {/* PHONE Sign-In Flow */}
                    <Stack.Screen name='PhoneInput' component={PhoneNumberPage} />
                    <Stack.Screen name='PhoneAuth' component={OTP} />
                    {/* Sign-Up Flow */}
                    <Stack.Screen name='EmailInput' component={Email} />
                    <Stack.Screen name='NameInput' component={Name} />
                    <Stack.Screen name='DobInput' component={DateOfBirth} />
                    <Stack.Screen name='GenderInput' component={Gender} />
                    <Stack.Screen name='PfpInput' component={Pfp} />
                    {/* <Stack.Screen name='Interests' component={Interests} /> */}
                </Stack.Navigator>
            </NavigationContainer>
        </SignUpProvider>
    );
};

export default AuthStack;

const styles = StyleSheet.create({});
