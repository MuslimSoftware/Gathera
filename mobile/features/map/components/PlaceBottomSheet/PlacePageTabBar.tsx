import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colours, Sizes } from '../../../../shared/styles/Styles';

type TabNames = 'Photos' | 'Gatherings' | 'Likes';

const TabButton = ({ label, onPress, isSelected }: { label: TabNames; onPress: any; isSelected: boolean }) => {
    return (
        <Pressable style={[styles.tab, isSelected && { borderBottomColor: Colours.DARK, borderBottomWidth: 1 }]} onPress={onPress}>
            <Text style={[styles.tabText, isSelected && { color: Colours.DARK }]}>{label}</Text>
        </Pressable>
    );
};

interface PlacePageTabBarProps {
    state: any;
    descriptors: any;
    navigation: any;
}

export const PlacePageTabBar = React.memo(({ state, descriptors, navigation }: PlacePageTabBarProps) => {
    const activeTab = state.routes[state.index].name;
    const getRouteByIndex = (index: number) => state.routes[index];

    const onTabPress = (routeIndex: number) => {
        const currRoute = getRouteByIndex(routeIndex);

        const event = navigation.emit({
            type: 'tabPress',
            target: currRoute.key,
            canPreventDefault: true,
        });

        if (currRoute.name !== activeTab && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: currRoute.name, merge: true });
        }
    };

    return (
        <View style={styles.tabsWrapper}>
            <TabButton label='Photos' onPress={() => onTabPress(0)} isSelected={activeTab === 'Photos'} />
            <TabButton label='Gatherings' onPress={() => onTabPress(1)} isSelected={activeTab === 'Gatherings'} />
            <TabButton label='Likes' onPress={() => onTabPress(2)} isSelected={activeTab === 'Likes'} />
        </View>
    );
});

const styles = StyleSheet.create({
    tabsWrapper: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: Colours.GRAY_LIGHT,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText: {
        fontSize: Sizes.FONT_SIZE_MD,
        color: Colours.GRAY,
        fontWeight: 'bold',
    },
});
