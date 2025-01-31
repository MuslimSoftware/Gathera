import { StyleSheet } from 'react-native';
import React from 'react';
import { MapMarker } from './MapMarker';

interface PlaceMarkerProps {
    coordinate: { latitude: number; longitude: number };
    place: any;
    onPress: () => void;
    hasBorder?: boolean;
    size?: number;
}

const areEqual = (prevProps: PlaceMarkerProps, nextProps: PlaceMarkerProps) => {
    return prevProps.hasBorder === nextProps.hasBorder && prevProps.size === nextProps.size;
};

export const PlaceMarker = React.memo(({ coordinate, place, onPress, hasBorder = false, size }: PlaceMarkerProps) => {
    return (
        <MapMarker coordinate={coordinate} imageUrl={place.default_photo} size={size} label={place.name} onPress={onPress} hasBorder={hasBorder} />
    );
}, areEqual);
const styles = StyleSheet.create({});
