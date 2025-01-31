import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Colours, Sizes } from '../../styles/Styles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ProfilePictureSize } from '../../../types/User';

export const DEFAULT_IMAGES = {
    place: require('../../../assets/images/places/default_place_image.png'),
    gathering: require('../../../assets/images/gatherings/default_gathering_image.png'),
    user: require('../../../assets/images/profile/default_pfp_image.png'),
};

interface MainPictureProps {
    uri?: string;
    size?: ProfilePictureSize;
    type: 'place' | 'gathering' | 'user';
}

const areEqual = (prevProps: MainPictureProps, nextProps: MainPictureProps) => {
    return prevProps.uri === nextProps.uri && prevProps.size === nextProps.size;
};

export const MainPicture = React.memo(({ size = 'small', uri, type }: MainPictureProps) => {
    const sourceUri = uri ? { uri } : DEFAULT_IMAGES[type];

    return (
        <TouchableWithoutFeedback style={styles.profile} touchSoundDisabled>
            <View style={[styles.profilePicWrapper, { width: PROFILE_PIC_SIZES[size].width, height: PROFILE_PIC_SIZES[size].height * 1.1 }]}>
                <Image source={sourceUri} style={[styles.profilePic, PROFILE_PIC_SIZES[size]]} />
            </View>
        </TouchableWithoutFeedback>
    );
}, areEqual);

const styles = StyleSheet.create({
    profile: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    profilePicWrapper: {
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colours.TRANSPARENT,
    },
    profilePic: {
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        backgroundColor: Colours.WHITE,
        borderWidth: 1,
        borderColor: Colours.GRAY_LIGHT,
    },
    icon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colours.WHITE,
        borderWidth: 1,
        borderColor: Colours.GRAY,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    modalContainer: {
        position: 'absolute',
        zIndex: 5,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        backgroundColor: Colours.WHITE,
        zIndex: 10,
    },
    modalImage: {
        width: 200,
        height: 200,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
    },
});

export const PROFILE_PIC_SIZES = {
    mini: {
        width: 25,
        height: 25,
    },
    xxsmall: {
        width: 40,
        height: 40,
    },
    xsmall: {
        width: 50,
        height: 50,
    },
    small: {
        width: 55,
        height: 55,
    },
    medium: {
        width: 60,
        height: 60,
    },
    large: {
        width: 95,
        height: 95,
    },
    xlarge: {
        width: 120,
        height: 120,
    },
    xxlarge: {
        width: 150,
        height: 150,
    },
};
