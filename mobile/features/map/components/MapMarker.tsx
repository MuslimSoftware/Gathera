import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useMemo } from 'react';
import { Marker } from 'react-native-maps';
import { Sizes, Colours } from '../../../shared/styles/Styles';
import { LinearGradient } from 'expo-linear-gradient';
import { getResizedImageUrl } from '../../../shared/utils/getResizedImageUrl';

interface MapMarkerProps {
    coordinate: { latitude: number; longitude: number };
    onPress: () => void;
    imageUrl: string;
    label: string;
    hasBorder?: boolean;
    size?: number;
    subLabel?: string;
}

const areEqual = (prevProps: MapMarkerProps, nextProps: MapMarkerProps) => {
    return (
        prevProps.coordinate.latitude === nextProps.coordinate.latitude &&
        prevProps.coordinate.longitude === nextProps.coordinate.longitude &&
        prevProps.imageUrl === nextProps.imageUrl &&
        prevProps.label === nextProps.label &&
        prevProps.hasBorder === nextProps.hasBorder &&
        prevProps.size === nextProps.size &&
        prevProps.subLabel === nextProps.subLabel
    );
};

export const MapMarker = React.memo(({ coordinate, imageUrl, label, subLabel, hasBorder = false, size = 40, onPress }: MapMarkerProps) => {
    // init to true to load images on first render, then set to false after 1 second
    const [tracksViewChanges, setTracksViewChanges] = React.useState(true);

    React.useEffect(() => {
        setTimeout(() => {
            setTracksViewChanges(false);
        }, 1000);
    }, []);

    const imageBorderSize = size + 2;
    const gradientSize = imageBorderSize + (hasBorder ? 6 : -5);
    const wrapperSize = gradientSize + 4;

    const Gradient = ({ children }: { children: React.ReactNode }) => {
        return hasBorder ? (
            <LinearGradient
                colors={[Colours.MARKER_GRADIENT_1, Colours.MARKER_GRADIENT_2, Colours.MARKER_GRADIENT_3]}
                style={{
                    width: gradientSize,
                    height: gradientSize,
                    borderRadius: Sizes.BORDER_RADIUS_FULL,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {children}
            </LinearGradient>
        ) : (
            <>{children}</>
        );
    };

    const resizedImage = useMemo(() => getResizedImageUrl(imageUrl, 100, 100), [imageUrl]);

    return (
        <Marker
            tracksViewChanges={tracksViewChanges}
            coordinate={{ latitude: coordinate.latitude, longitude: coordinate.longitude }}
            onPress={onPress}
        >
            <View style={styles.marker}>
                <View style={[styles.imageWrapper, { width: wrapperSize, height: wrapperSize }]}>
                    <Gradient>
                        <View style={[styles.border, { width: imageBorderSize, height: imageBorderSize }]}>
                            <Image source={{ uri: resizedImage }} style={[styles.image, { width: size, height: size }]} />
                        </View>
                    </Gradient>
                </View>
                <View style={styles.labelWrapper}>
                    <Text style={styles.labelText} numberOfLines={2}>
                        {label}
                    </Text>
                    <Text style={styles.labelText} numberOfLines={1}>
                        {subLabel}
                    </Text>
                </View>
            </View>
        </Marker>
    );
}, areEqual);

const styles = StyleSheet.create({
    marker: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageWrapper: {
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        backgroundColor: Colours.LIGHT,
        borderWidth: 1,
        borderColor: Colours.GRAY_LIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        // Drop shadow
        shadowColor: Colours.BLACK, // IOS
        shadowOffset: {
            width: 0,
            height: 2,
        }, // IOS
        shadowOpacity: 0.25, // IOS
        shadowRadius: 4, // IOS
        elevation: 5, // Android
    },
    border: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        backgroundColor: Colours.LIGHT,
    },
    image: {
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        borderWidth: 1,
        borderColor: Colours.GRAY_LIGHT,
    },
    labelWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 100,
    },
    labelText: {
        fontSize: Sizes.FONT_SIZE_XS,
        fontWeight: '600',
        color: Colours.DARK,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
