import { StyleSheet, View } from 'react-native';
import React from 'react';
import ProfileAboutTab, { ProfileAboutTabSkeleton } from './ProfileAboutTab';
import { Colours, Sizes } from '../../../../shared/styles/Styles';
import { HeartIcon, HeartOIcon, IdCardIcon, RocketIcon } from '../../../../shared/components/Core/Icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ProfileLikedPlaces } from './ProfileLikedPlaces';
import { LoadingSkeleton } from '../../../../shared/components/Core/LoadingSkeleton';

interface ProfileContentProps {
    profile: any;
}

const TopTab = createMaterialTopTabNavigator();

const ProfileContent = ({ profile }: ProfileContentProps) => {
    return (
        <TopTab.Navigator
            initialRouteName='About'
            screenOptions={{
                tabBarIndicatorStyle: { backgroundColor: Colours.PRIMARY },
                tabBarStyle: { backgroundColor: Colours.WHITE },
                tabBarActiveTintColor: Colours.PRIMARY,
                tabBarInactiveTintColor: Colours.GRAY,
            }}
        >
            <TopTab.Screen
                name='About'
                options={{ tabBarIcon: ({ focused, color }: any) => <IdCardIcon color={color} />, lazy: true, tabBarShowLabel: false }}
            >
                {() => <ProfileAboutTab profile={profile} />}
            </TopTab.Screen>
            <TopTab.Screen
                name='LikedPlaces'
                options={{
                    tabBarIcon: ({ focused, color }: any) => (focused ? <HeartIcon color={color} /> : <HeartOIcon color={color} />),
                    lazy: true,
                    tabBarShowLabel: false,
                }}
            >
                {() => <ProfileLikedPlaces profile={profile} />}
            </TopTab.Screen>
        </TopTab.Navigator>
    );
};

export const ProfileContentSkeleton = () => {
    return (
        <View style={styles.wrapper}>
            <LoadingSkeleton style={styles.tabsWrapper} />
            <ProfileAboutTabSkeleton />
        </View>
    );
};

export default ProfileContent;

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        gap: 20,
    },
    tabsWrapper: {
        flexDirection: 'row',
        gap: 30,
    },
    tab: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5,
    },
    tabText: {
        fontSize: Sizes.FONT_SIZE_H3,
        fontWeight: '500',
        color: Colours.DARK,
    },
    activeTabText: {
        color: Colours.PRIMARY,
    },
    inactiveTabText: {
        color: Colours.GRAY,
    },
    bodyHeader: {
        borderBottomWidth: 1,
        borderColor: Colours.GRAY_EXTRA_LIGHT,
        width: '100%',
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
