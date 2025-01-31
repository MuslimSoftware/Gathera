import { StyleSheet } from 'react-native';
import React from 'react';
import { MapMarker } from './MapMarker';

interface MapClusterProps {
    placeImage: string;
    placeName: string;
    cluster: any;
    onPress: () => void;
    hasBorder?: boolean;
    size?: number;
}

const areEqual = (prevProps: MapClusterProps, nextProps: MapClusterProps) => {
    return (
        prevProps.cluster.geometry.coordinates[1] === nextProps.cluster.geometry.coordinates[1] &&
        prevProps.cluster.geometry.coordinates[0] === nextProps.cluster.geometry.coordinates[0] &&
        prevProps.size === nextProps.size
    );
};

export const MapCluster = React.memo(({ placeImage, placeName, cluster, onPress, hasBorder = false, size = 40 }: MapClusterProps) => {
    return (
        <MapMarker
            imageUrl={placeImage}
            label={placeName}
            subLabel={`+${cluster.properties.point_count - 1} more`}
            onPress={onPress}
            hasBorder={hasBorder}
            size={size}
            coordinate={{ latitude: cluster.geometry.coordinates[1], longitude: cluster.geometry.coordinates[0] }}
        />
    );
}, areEqual);

const styles = StyleSheet.create({});
