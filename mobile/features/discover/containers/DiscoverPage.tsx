import { StyleSheet, View } from 'react-native';
import React from 'react';
import DiscoverContent from '../components/DiscoverContent';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchPage } from './SearchPage';

const Stack = createNativeStackNavigator();

const DiscoverPage = () => {
    return (
        <View style={styles.globalWrapper}>
            <Stack.Navigator
                initialRouteName='DiscoverContent'
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                }}
            >
                <Stack.Screen name='DiscoverContent' component={DiscoverContent} />
                <Stack.Screen name='SearchPage' component={SearchPage} />
            </Stack.Navigator>
        </View>
    );
};

export default DiscoverPage;

const styles = StyleSheet.create({
    globalWrapper: {
        paddingTop: 10,
        height: '100%',
        width: '100%',
    },
});
