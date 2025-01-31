import { useNavigation } from '@react-navigation/native';
import { getMapContextValues } from '../context/MapContext';
import { getPlaceBottomSheetContextValues } from '../context/PlaceBottomSheetContext';
import { handleMarkerPress } from '../../features/map/utils/clusterHelper';

export const NOTIFICATIONS_TAB_SCREEN_NAME = 'NotificationsTab';
export const PROFILE_TAB_SCREEN_NAME = 'ProfileTab';
export const DISCOVER_TAB_SCREEN_NAME = 'DiscoverTab';
export const MAP_TAB_SCREEN_NAME = 'MapTab';

export const useNavigate = () => {
    const navigation: any = useNavigation();
    const { appNavigationContainerRef, bottomSheetRef, mapViewRef, bottomSheetCurrentIndex, setBottomSheetCurrentIndex } =
        getPlaceBottomSheetContextValues();
    const { places, setSelectedPlaceId } = getMapContextValues();

    let currentPage = '';
    if (appNavigationContainerRef.isReady()) {
        currentPage = appNavigationContainerRef.getCurrentRoute().name;
    }

    const navigateToPlaceMarker = (place_id: string) => {
        const navigatingToMapTab = currentPage !== 'Map';
        if (navigatingToMapTab) {
            navigation.navigate('MainTabs', {
                screen: MAP_TAB_SCREEN_NAME,
            });
        }

        const place = places.get(place_id);

        setTimeout(
            () => {
                handleMarkerPress(place, setSelectedPlaceId, mapViewRef, bottomSheetRef, bottomSheetCurrentIndex);
                navigateToScreen('PlacePage', { placeId: place!._id });
            },
            navigatingToMapTab ? 200 : 0
        );
    };

    const snapBottomSheetToIndex = (index: number) => {
        if (bottomSheetRef.current && bottomSheetRef.current.index !== index) {
            bottomSheetRef.current.snapToIndex(index);
            setBottomSheetCurrentIndex(index);
        }
    };

    const navigateToMapGathering = (gathering_id: string, place_id: string) => {
        navigateToPlaceMarker(place_id);
        setTimeout(() => {
            pushScreen('Gathering', { gatheringId: gathering_id });
            snapBottomSheetToIndex(2);
        }, 300);
    };

    const navigateToPlaceDetails = (place_id?: string) => {
        if (place_id) navigateToPlaceMarker(place_id);
    };

    const navigateToScreen = (screenName: string, params?: any) => {
        navigation.navigate(screenName, params);
    };

    const pushScreen = (screenName: string, params?: any) => {
        navigation.push(screenName, params);
    };

    const replaceScreen = (screenName: string, params?: any) => {
        navigation.replace(screenName, params);
    };

    const popScreen = () => {
        navigation.pop();
    };

    const goBack = () => {
        navigation.goBack();
    };

    const navigateToChatRoomFromGathering = (conversation_id: any) => {
        if (appNavigationContainerRef.isReady()) {
            appNavigationContainerRef.navigate('Inbox', {
                screen: 'ChatRoom',
                params: { conversationId: conversation_id },
            });
        }
    };

    const navigateApp = (screenName: string, params?: any) => {
        if (appNavigationContainerRef.isReady()) {
            appNavigationContainerRef.navigate(screenName, params);
        }
    };

    return {
        navigateToScreen,
        goBack,
        navigateToMapGathering,
        navigateToPlaceDetails,
        navigateToPlaceMarker,
        navigateToChatRoomFromGathering,
        snapBottomSheetToIndex,
        replaceScreen,
        pushScreen,
        popScreen,
        navigateApp,

        currentPage,
    };
};
