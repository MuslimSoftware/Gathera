import React from 'react';
import { StyleSheet, View, Image, Modal } from 'react-native';
import { Colours, Sizes } from '../../styles/Styles';
import { ProfilePictureSize } from '../../../types/User';
import { Backdrop } from '../Sheets/Backdrop';
import { useNavigation } from '@react-navigation/native';
import { getBorder } from '../../utils/borderHelper';
import { UserBorder } from '../../../gathera-lib/enums/user';
import { DEFAULT_IMAGES, MainPicture } from './MainPicture';

interface ProfilePictureProps {
    uri?: string;
    size?: ProfilePictureSize;
    profileId?: string;
    border?: UserBorder | string;
    icon?: React.ReactNode;
    onPress?: () => void;
    enableImageModal?: boolean;
    isDummy?: boolean;
}

const areEqual = (prevProps: ProfilePictureProps, nextProps: ProfilePictureProps) => {
    return (
        prevProps.uri === nextProps.uri &&
        prevProps.size === nextProps.size &&
        prevProps.profileId === nextProps.profileId &&
        prevProps.border === nextProps.border
    );
};

export const ProfilePicture = React.memo(
    ({ size = 'small', uri, border = UserBorder.NONE, icon, onPress, profileId, enableImageModal = false, isDummy = false }: ProfilePictureProps) => {
        const [imageModalVisible, setImageModalVisible] = React.useState(false);
        const navigation: any = useNavigation();

        const handlePicturePress = () => {
            onPress && onPress();
            if (profileId) {
                navigation.navigate('OtherProfile', { profileId });
            }
        };

        const openImageModal = () => {
            enableImageModal && setImageModalVisible(true);
        };

        const sourceUri = uri ? { uri } : DEFAULT_IMAGES.user;
        const BorderComponent: any = getBorder(border);

        return (
            <>
                <View style={styles.profile} onTouchStart={profileId || onPress ? handlePicturePress : openImageModal} pointerEvents='box-none'>
                    {BorderComponent && <BorderComponent size={PROFILE_PIC_SIZES[size].width} />}
                    <View style={[styles.profilePicWrapper, { width: PROFILE_PIC_SIZES[size].width, height: PROFILE_PIC_SIZES[size].height * 1.1 }]}>
                        {!isDummy && <MainPicture size={size} uri={uri} type='user' />}
                        {isDummy && <View style={[styles.profilePic, PROFILE_PIC_SIZES[size]]}></View>}
                    </View>

                    {icon && <View style={styles.icon}>{icon}</View>}
                </View>

                <Modal visible={imageModalVisible} transparent>
                    <View style={[styles.container, styles.modalContainer]}>
                        <Backdrop onPress={() => setImageModalVisible(false)} />
                        <View style={styles.imageWrapper}>
                            <Image source={sourceUri} style={styles.modalImage} />
                        </View>
                    </View>
                </Modal>
            </>
        );
    },
    areEqual
);

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
