import { StyleSheet, Image, Pressable } from 'react-native';
import React from 'react';
import { ImageModal } from './ImageModal';
import { Colours } from '../../styles/Styles';
import { getResizedImageUrl } from '../../utils/getResizedImageUrl';

interface PressableImageProps {
    url: string;
    style?: any;
}

export const PressableImage = React.memo(({ url, style }: PressableImageProps) => {
    const [showModal, setShowModal] = React.useState(false);
    const compressedImage = getResizedImageUrl(url, 200, 200);

    return (
        <>
            <Pressable style={[styles.globalWrapper, style]} onPress={() => setShowModal(true)}>
                <Image source={{ uri: compressedImage }} style={[style, styles.image]} resizeMode='cover' />
            </Pressable>
            <ImageModal url={url} showModal={showModal} setShowModal={setShowModal} />
        </>
    );
});

const styles = StyleSheet.create({
    globalWrapper: {},
    image: { width: '100%', height: '100%', backgroundColor: Colours.GRAY_LIGHT },
});
