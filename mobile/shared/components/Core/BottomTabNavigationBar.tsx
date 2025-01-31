import { Keyboard, Platform, StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { Colours, Sizes } from '../../styles/Styles';
import { CompassIcon, ProfileIcon, MapIcon, CompassOIcon, MapOIcon, ProfileOIcon, ChatIcon, ChatOIcon } from './Icons';
import { getNotificationContextValues } from '../../../features/notifications/context/NotificationContext';
import { NAV_BAR_HEIGHT, getBottomInset } from '../../utils/uiHelper';
import { IconWithRedNumberBadge } from './IconWithRedNumberBadge';
import { MAP_TAB_SCREEN_NAME, DISCOVER_TAB_SCREEN_NAME, NOTIFICATIONS_TAB_SCREEN_NAME, PROFILE_TAB_SCREEN_NAME } from '../../hooks/useNavigate';

interface BottomTabNavigationBarProps {
    state: any;
    descriptors: any;
    navigation: any;
}

export const BottomTabNavigationBar = React.memo(
    ({ state, navigation }: BottomTabNavigationBarProps) => {
        const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

        useEffect(() => {
            const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
            const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

            Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
            Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

            return () => {
                Keyboard.removeAllListeners(showEvent);
                Keyboard.removeAllListeners(hideEvent);
            };
        }, []);

        const activeTab = state.routes[state.index].name;
        const { notificationsCount } = getNotificationContextValues();

        const getRouteByIndex = (index: number) => state.routes[index];

        const getIconColor = (tab: string) => {
            if (activeTab === MAP_TAB_SCREEN_NAME) {
                if (tab === MAP_TAB_SCREEN_NAME) return Colours.BLACK;

                return Colours.GRAY;
            }

            if (activeTab === tab) return Colours.LIGHT;
            return Colours.GRAY_TRANSPARENT;
        };

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

        const [isMapTab, isDiscoverTab, isInboxTab, isProfileTab] = [
            activeTab === MAP_TAB_SCREEN_NAME,
            activeTab === DISCOVER_TAB_SCREEN_NAME,
            activeTab === NOTIFICATIONS_TAB_SCREEN_NAME,
            activeTab === PROFILE_TAB_SCREEN_NAME,
        ];

        const bottomInset = getBottomInset();
        return (
            <>
                <View
                    style={[
                        styles.globalWrapper,
                        isKeyboardVisible ? { display: 'none' } : { display: 'flex' },
                        activeTab === MAP_TAB_SCREEN_NAME ? styles.mapStyle : {},
                        { bottom: bottomInset },
                    ]}
                >
                    <TabIcon Icon={isMapTab ? MapIcon : MapOIcon} color={getIconColor(MAP_TAB_SCREEN_NAME)} onPress={() => onTabPress(0)} />
                    <TabIcon
                        Icon={isDiscoverTab ? CompassIcon : CompassOIcon}
                        color={getIconColor(DISCOVER_TAB_SCREEN_NAME)}
                        onPress={() => onTabPress(1)}
                    />
                    <TabIcon
                        Icon={isInboxTab ? ChatIcon : ChatOIcon}
                        color={getIconColor(NOTIFICATIONS_TAB_SCREEN_NAME)}
                        onPress={() => onTabPress(2)}
                        badge={notificationsCount}
                    />
                    <TabIcon
                        Icon={isProfileTab ? ProfileIcon : ProfileOIcon}
                        color={getIconColor(PROFILE_TAB_SCREEN_NAME)}
                        onPress={() => onTabPress(3)}
                    />
                </View>
                <View
                    style={
                        isKeyboardVisible || !isMapTab ? { display: 'none' } : [styles.backgroundWrapper, { height: bottomInset + NAV_BAR_HEIGHT }]
                    }
                />
            </>
        );
    },
    (prevProps, nextProps) => prevProps.state.index === nextProps.state.index
);

const TabIcon = React.memo(({ Icon, color, onPress, badge }: { Icon: Function; color: string; onPress: () => void; badge?: number }) => {
    return (
        <IconWithRedNumberBadge
            icon={<Icon size={Sizes.ICON_SIZE_XL} color={color} style={{ marginBottom: 1 }} />}
            onPress={onPress}
            badgeNumber={badge ? badge : 0}
        />
    );
});

const styles = StyleSheet.create({
    globalWrapper: {
        position: 'absolute',
        zIndex: 100,
        left: '8%',
        right: '8%',
        height: NAV_BAR_HEIGHT,
        backgroundColor: Colours.BLACK,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    mapStyle: {
        backgroundColor: Colours.WHITE,
    },
    backgroundWrapper: {
        position: 'absolute',
        zIndex: 99,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colours.WHITE,
    },
});
