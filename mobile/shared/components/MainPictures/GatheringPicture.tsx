import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import { Sizes, Colours } from '../../styles/Styles';
import { ProfilePictureSize } from '../../../types/User';
import { PROFILE_PIC_SIZES } from './ProfilePicture';
import { DEFAULT_IMAGES } from './MainPicture';

interface GatheringPictureProps {
    uri: string;
    icon?: React.ReactNode;
    size?: ProfilePictureSize;
}

export const GatheringPicture = ({ uri, icon, size = 'medium' }: GatheringPictureProps) => {
    const padding = size === 'large' ? 3 : 2;
    const sourceUri = uri ? { uri } : DEFAULT_IMAGES.gathering;
    return (
        <View style={[styles.wrapper, { ...PROFILE_PIC_SIZES[size] }]}>
            <Image source={sourceUri} style={[styles.image, { ...PROFILE_PIC_SIZES[size] }]} />
            {icon && <View style={[styles.icon, , { padding }]}>{icon}</View>}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        borderWidth: 1,
        borderColor: Colours.GRAY,
    },
    image: {
        borderRadius: Sizes.BORDER_RADIUS_FULL,
    },
    icon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colours.WHITE,
        borderWidth: 1,
        borderColor: Colours.GRAY,
    },
});
