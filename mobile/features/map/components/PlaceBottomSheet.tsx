import React from 'react';
import { StyleSheet } from 'react-native';
import { PlaceNavigationPage } from './PlaceBottomSheet/PlaceNavigationPage';
import { PlaceSheetHeader } from './PlaceBottomSheet/PlaceSheetHeader';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlacePageContainer } from '../containers/PlacePageContainer';

const Stack = createNativeStackNavigator();

export const PlaceBottomSheet = () => {
    return (
        <>
            <PlaceSheetHeader />
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name='PlaceNavigationPage' component={PlaceNavigationPage} />
                <Stack.Screen name='PlacePage' component={PlacePageContainer} />
            </Stack.Navigator>
        </>
    );
};

const styles = StyleSheet.create({});
