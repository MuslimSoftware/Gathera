import { StyleSheet, View, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Colours, Sizes } from '../styles/Styles';
import { PROFILE_PIC_SIZES, ProfilePicture } from './MainPictures/ProfilePicture';
import { EditIcon } from './Core/Icons';
import { ProfilePictureSize } from '../../types/User';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImageLibrary from 'expo-image-picker';
import { UserBorder } from '../../gathera-lib/enums/user';

interface ImagePickerProps {
    sendImageUri: (uri: string) => void;
    defaultImageUri?: string;
    size?: ProfilePictureSize;
    border?: UserBorder;
    editable?: boolean;
}

const ImagePicker = ({ sendImageUri, defaultImageUri, size = 'large', border = UserBorder.NONE, editable = true }: ImagePickerProps) => {
    const [displayedImageUri, setDisplayedImageUri] = useState<string>(defaultImageUri || '');

    const pickImage = async () => {
        if (!editable) return;

        let result = await ImageLibrary.launchImageLibraryAsync({
            base64: true,
            mediaTypes: ImageLibrary.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            presentationStyle: ImageLibrary.UIImagePickerPresentationStyle.AUTOMATIC,
        });

        if (!result.canceled) {
            const uri = `data:image/jpeg;base64,${result.assets[0].base64}`;
            const compressedImage = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 250 } }], {
                base64: true,
                format: ImageManipulator.SaveFormat.PNG,
                compress: 0,
            });

            setDisplayedImageUri(compressedImage.uri);
            sendImageUri(`${compressedImage.base64}`);
        }
    };

    return (
        <View style={styles.body}>
            <Pressable onPress={pickImage}>
                {(!displayedImageUri || displayedImageUri === '') && (
                    <View style={[styles.defaultPfp, { width: PROFILE_PIC_SIZES[size].width, height: PROFILE_PIC_SIZES[size].height }]}>
                        <View style={styles.verticalLine} />
                        <View style={styles.horizontalLine} />
                    </View>
                )}
                {displayedImageUri && displayedImageUri !== '' && <ProfilePicture uri={displayedImageUri} size={size} border={border} />}
                {editable && (
                    <View style={styles.editIcon}>
                        <EditIcon size={Sizes.ICON_SIZE_SM} />
                    </View>
                )}
            </Pressable>
        </View>
    );
};

export { ImagePicker };

const styles = StyleSheet.create({
    body: {
        width: '100%',
        alignItems: 'center',
        gap: 10,
    },
    defaultPfp: { backgroundColor: Colours.WHITE, borderRadius: Sizes.BORDER_RADIUS_FULL, justifyContent: 'center', alignItems: 'center' },
    verticalLine: { position: 'absolute', width: 5, height: 50, backgroundColor: Colours.GRAY_LIGHT },
    horizontalLine: { position: 'absolute', width: 50, height: 5, backgroundColor: Colours.GRAY_LIGHT },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colours.WHITE,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        padding: 5,
        borderWidth: 1,
        borderColor: Colours.GRAY_LIGHT,
    },
});
