import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React, { Dispatch, SetStateAction, useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import { Colours } from '../../../../shared/styles/Styles';

interface ImageEditSectionProps {
    profilePic: string;
    setFieldsToUpdate: Dispatch<SetStateAction<any>>;
}

const ImageEditSection = ({ profilePic, setFieldsToUpdate }: ImageEditSectionProps) => {
    const [displayedImageUri, setDisplayedImageUri] = useState<string>(
        profilePic.includes('/images/default_pp.png') ? `${process.env.EXPO_PUBLIC_API_HOSTNAME}${profilePic}` : profilePic
    );

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            base64: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setFieldsToUpdate((fields: any) => {
                if (result.assets) fields.avatar_uri = result.assets[0].base64;

                return fields;
            });
            setDisplayedImageUri(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    return (
        <View style={styles.body}>
            <Image
                source={{
                    uri: displayedImageUri,
                }}
                style={styles.profilePicture}
            />
            <Pressable onPress={pickImage}>
                <Text style={styles.editPhotoText}>Edit Profile Picture</Text>
            </Pressable>
        </View>
    );
};

export default ImageEditSection;

const styles = StyleSheet.create({
    body: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 15,
        gap: 20,
        borderBottomColor: Colours.PRIMARY_TRANSPARENT_75,
        borderBottomWidth: 1,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editPhotoText: {
        fontSize: 18,
        fontWeight: '400',
        color: Colours.PRIMARY,
    },
});
