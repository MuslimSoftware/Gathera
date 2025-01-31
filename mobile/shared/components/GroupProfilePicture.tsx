import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import { Sizes, Colours } from '../styles/Styles';

interface GroupProfilePictureProps {
    uri: string | undefined;
    otherUri: string | undefined;
    size?: 'small' | 'medium' | 'large';
}

const GroupProfilePicture = ({ uri, otherUri, size = 'small' }: GroupProfilePictureProps) => {
    return (
        <View
            style={[
                styles.wrapper,
                size === 'small' && { width: 60, height: 60 },
                size === 'medium' && { width: 100, height: 100 },
                size === 'large' && { width: 140, height: 140 },
            ]}
        >
            <Image source={{ uri }} style={[styles.profilePic, styles.imageOne]} />
            <Image source={{ uri: otherUri }} style={[styles.profilePic, styles.imageTwo]} />
        </View>
    );
};

export default GroupProfilePicture;

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageOne: {
        zIndex: 10,
        bottom: 0,
        right: 0,
    },
    imageTwo: { zIndex: -10, top: 0, left: 0 },
    profilePic: {
        position: 'absolute',
        width: '85%',
        height: '85%',
        backgroundColor: Colours.WHITE,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        borderColor: Colours.GRAY,
        borderWidth: 1,
    },
});
