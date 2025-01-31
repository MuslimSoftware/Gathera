import React from 'react';
import { StyleSheet, Text, View, Image, Modal, ModalProps, NativeSyntheticEvent } from 'react-native';
import { Colours, Sizes } from '../../styles/Styles';
import { Backdrop } from '../Sheets/Backdrop';
import { PrimaryButton } from '../Buttons/PrimaryButton';

interface ModalContent {
    title?: string;
    description?: string;
    imageSource?: any;
}

interface Props {
    content: ModalContent | React.ReactNode; // Can be a standardised ModalContent object or any ReactNode
    dismissOverlay: () => any; // Function that closes the overlay
    modalProps?: ModalProps; // Any additional props to pass to the modal
    dismissOnBackdropPress?: boolean; // Whether to dismiss the modal when the backdrop is pressed, defaults to false
    dismissButtonLabel?: string; // Label for the dismiss button
    children?: React.ReactNode; // Any additional children to render in the modal
}

export const Overlay = ({ content, dismissOverlay, modalProps, dismissOnBackdropPress = false, dismissButtonLabel, children }: Props) => {
    const requestCloseHandler = (event: NativeSyntheticEvent<any>) => {
        if (dismissOnBackdropPress) dismissOverlay();
        else event.stopPropagation();
    };

    const backdropPressHandler = () => {
        if (dismissOnBackdropPress) dismissOverlay();
    };

    const renderContent = () => {
        if (React.isValidElement(content)) return content;

        const { title, description, imageSource } = content as ModalContent;
        return (
            <>
                {imageSource && <Image source={imageSource} style={styles.image} />}
                <View style={styles.textWrapper}>
                    <Text style={styles.headerText}>{title}</Text>
                    <Text style={styles.descriptionText}>{description}</Text>
                </View>
                {children}
            </>
        );
    };

    return (
        <Modal animationType='fade' transparent statusBarTranslucent onRequestClose={requestCloseHandler} {...modalProps}>
            <Backdrop onPress={backdropPressHandler} />
            <View style={styles.container} pointerEvents='box-none'>
                <View style={styles.contentWrapper}>
                    {renderContent()}
                    {dismissButtonLabel && (
                        <PrimaryButton containerStyle={styles.dismissButton} label={dismissButtonLabel} onPress={dismissOverlay} />
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },

    contentWrapper: {
        width: '80%',
        minHeight: '35%',
        backgroundColor: Colours.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Sizes.BORDER_RADIUS_LG,
        gap: 20,
        paddingVertical: 20,
        paddingHorizontal: 10,

        // Android Box Shadow
        elevation: 5,

        // iOS Box Shadow
        shadowColor: Colours.BLACK,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    headerText: {
        fontSize: Sizes.FONT_SIZE_LG,
        fontWeight: 'bold',
        color: Colours.DARK,
    },
    descriptionText: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.GRAY,
        fontWeight: '400',
        textAlign: 'center',
    },
    image: {
        width: 100,
        height: 100,
    },
    textWrapper: {
        width: '85%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    dismissButton: {
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
});
