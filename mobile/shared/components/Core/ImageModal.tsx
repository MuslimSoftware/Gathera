import { Modal, Pressable, StyleSheet, View, Image } from 'react-native';
import React from 'react';
import { Sizes } from '../../styles/Styles';

interface ImageModalProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    url: string;
}

export const ImageModal = ({ showModal, setShowModal, url }: ImageModalProps) => {
    return (
        <Modal visible={showModal} transparent>
            <View style={styles.container}>
                <Pressable style={styles.modalContainer} onPress={() => setShowModal(false)} />
                <View style={styles.imageWrapper}>
                    <Image
                        source={{
                            uri: url,
                        }}
                        style={styles.modalImage}
                        resizeMode='cover'
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,.8)',
    },
    imageWrapper: {
        width: '95%',
        height: '40%',
        position: 'absolute',
        top: '30%',
        left: '2.5%',
        borderRadius: Sizes.BORDER_RADIUS_SM,
        zIndex: 10,
    },
    modalImage: {
        flex: 1,
    },
});
