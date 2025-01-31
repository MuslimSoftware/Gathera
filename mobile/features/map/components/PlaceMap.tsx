import { Pressable, StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useRef } from 'react';
import MapView from 'react-native-map-clustering';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { getMapContextValues } from '../../../shared/context/MapContext';
import MapStyle from '../utils/MapStyle';
import * as Location from 'expo-location';
import { MapCluster } from './MapCluster';
import SuperCluster from 'supercluster';
import { handleMarkerPress, getClusterPlaces } from '../utils/clusterHelper';
import { PlaceMarker } from './PlaceMarker';
import { GPSIcon } from '../../../shared/components/Core/Icons';
import { Colours, Sizes } from '../../../shared/styles/Styles';
import { getPlaceBottomSheetContextValues } from '../../../shared/context/PlaceBottomSheetContext';
import { useNavigate } from '../../../shared/hooks/useNavigate';
import { IPlace } from '../../../types/Place';
import { useOnFocus } from '../../../shared/hooks/useOnFocus';
import { PLACE_BOTTOM_SHEET_HEADER_HEIGHT, getNavigationBarBottomPadding } from '../../../shared/utils/uiHelper';
import { getAuthContextValues } from '../../../shared/context/AuthContext';

export const PlaceMap = React.memo(() => {
    const [isLocationEnabled, setIsLocationEnabled] = React.useState<boolean>(false);

    const { places, selectedPlace, setSelectedPlaceId, refreshPlaces } = getMapContextValues();
    const { bottomSheetRef, mapViewRef, bottomSheetCurrentIndex } = getPlaceBottomSheetContextValues();
    const { accessToken } = getAuthContextValues();
    const { navigateToScreen } = useNavigate();
    const superClusterRef = useRef<SuperCluster>(new SuperCluster());

    useOnFocus(refreshPlaces, [useCallback(refreshPlaces, [accessToken])]);

    useEffect(() => {
        const getLocationPermission = async () => {
            const { status } = await Location.getForegroundPermissionsAsync().catch(() => ({ status: 'denied' }));
            setIsLocationEnabled(status === 'granted');
        };

        getLocationPermission();
    }, []);

    const centerOnUser = async () => {
        let location = await Location.getLastKnownPositionAsync({}); // Use last known location if available
        if (!location) {
            location = await Location.getCurrentPositionAsync({}); // Otherwise, get current location
        }
        mapViewRef.current.animateToRegion(
            {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            },
            1000
        );
    };

    const renderCluster = (
        cluster: any,
        places: Map<string, IPlace>,
        superClusterRef: React.MutableRefObject<SuperCluster<SuperCluster.AnyProps, SuperCluster.AnyProps>>
    ): React.ReactNode => {
        const clusterPlaces = getClusterPlaces(cluster, places, superClusterRef);
        const hasBorder = clusterPlaces.some((place) => (place.gathering_count ? place.gathering_count > 0 : false));
        const hasSelectedPlace: boolean = selectedPlace ? clusterPlaces.some((place) => place._id === selectedPlace._id) : false;

        // place in the cluster with the most gatherings will be the one showcased
        const showcasedPlace =
            hasSelectedPlace && selectedPlace
                ? selectedPlace
                : clusterPlaces.reduce(
                      (maxGatheringPlace, currPlace) =>
                          currPlace.gathering_count! > maxGatheringPlace.gathering_count! ? currPlace : maxGatheringPlace,
                      clusterPlaces[0]
                  );

        const size = showcasedPlace._id === selectedPlace?._id ? 70 : undefined;
        return (
            <MapCluster
                key={cluster.id}
                placeImage={showcasedPlace.default_photo !== undefined ? showcasedPlace.default_photo : ''}
                placeName={showcasedPlace.name !== undefined ? showcasedPlace.name : ''}
                cluster={cluster}
                size={size}
                onPress={() => {
                    handleMarkerPress(showcasedPlace, setSelectedPlaceId, mapViewRef, bottomSheetRef, bottomSheetCurrentIndex);
                    navigateToScreen('PlacePage', { placeId: showcasedPlace._id });
                }}
                hasBorder={hasBorder}
            />
        );
    };

    const locationButtonPadding = getNavigationBarBottomPadding() + PLACE_BOTTOM_SHEET_HEADER_HEIGHT + 30;
    return (
        <View style={styles.wrapper}>
            <LinearGradient style={styles.mapGradient} colors={['rgba(0,0,0,0.3)', 'transparent']} />

            {isLocationEnabled && (
                <Pressable style={[styles.locateUserWrapper, { bottom: locationButtonPadding }]} onPress={centerOnUser}>
                    <GPSIcon size={Sizes.ICON_SIZE_MD} color={Colours.LIGHT_DARK} />
                </Pressable>
            )}

            <MapView
                ref={mapViewRef}
                style={styles.map}
                customMapStyle={MapStyle}
                region={{
                    latitude: 45.5,
                    longitude: -73.58,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
                showsCompass={true}
                minPoints={1}
                superClusterRef={superClusterRef}
                radius={75}
                clusteringEnabled={true}
                renderCluster={(cluster) => renderCluster(cluster, places, superClusterRef)}
                pitchEnabled={false}
                rotateEnabled={false}
                showsUserLocation
                showsMyLocationButton={false}
                maxZoomLevel={20}
                minZoomLevel={10}
            >
                {places &&
                    Array.from(places.keys()).map((placeId) => {
                        const place = places.get(placeId)!;
                        return (
                            <PlaceMarker
                                key={place._id + place.name}
                                place={place}
                                size={place._id === selectedPlace?._id ? 70 : undefined}
                                coordinate={{ latitude: place.location.lat, longitude: place.location.lng }}
                                onPress={() => {
                                    handleMarkerPress(place, setSelectedPlaceId, mapViewRef, bottomSheetRef, bottomSheetCurrentIndex);
                                    navigateToScreen('PlacePage', { placeId: place._id });
                                }}
                                hasBorder={place.gathering_count ? place.gathering_count > 0 : false}
                            />
                        );
                    })}
            </MapView>
        </View>
    );
});

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    mapGradient: {
        width: '100%',
        height: Constants.statusBarHeight * 2,
        position: 'absolute',
        zIndex: 500,
    },
    locateUserWrapper: {
        position: 'absolute',
        right: 10,
        zIndex: 100,
        padding: 20,
        backgroundColor: Colours.LIGHT,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        borderColor: Colours.GRAY_LIGHT,
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',

        // Shadow
        shadowColor: Colours.BLACK, // IOS
        shadowOffset: {
            width: 0,
            height: 2,
        }, // IOS
        shadowOpacity: 0.25, // IOS
        shadowRadius: 2.5, // IOS
        elevation: 5, // Android
    },
});
