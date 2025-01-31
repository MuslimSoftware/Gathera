import { StyleSheet, View } from 'react-native';
import React, { Dispatch, SetStateAction } from 'react';
import { getAuthContextValues } from '../../../../shared/context/AuthContext';
import { getPlaceBottomSheetContextValues } from '../../../../shared/context/PlaceBottomSheetContext';
import { Sizes, Colours } from '../../../../shared/styles/Styles';
import { GrayButton } from '../../../../shared/components/Buttons/GrayButton';
import { PrimaryButton } from '../../../../shared/components/Buttons/PrimaryButton';
import { useFollowUser } from '../../../../shared/hooks/useFollowUser';
import { Loading } from '../../../../shared/components/Core/Loading';
import { BUTTON_DEFAULT_MIN_WIDTH } from '../../../../shared/components/Buttons/Button';
import { FollowingStatus } from '../../../../shared/utils/userHelper';
import { useFetch } from '../../../../shared/hooks/useFetch';
import { useToastError } from '../../../../shared/hooks/useToastError';

interface ProfileActionButtonsProps {
    profile: any;
    setProfile: Dispatch<SetStateAction<any>>;
    setShowEditSheet?: Dispatch<SetStateAction<boolean>>;
    loading?: boolean;
}

export const ProfileActionButtons: React.FC<ProfileActionButtonsProps> = ({ profile, setProfile, setShowEditSheet, loading }) => {
    const {
        user: { _id: userId },
    } = getAuthContextValues();
    const { appNavigationContainerRef } = getPlaceBottomSheetContextValues();
    const isSelfProfile = userId === profile._id;
    const { error, isLoading, followUser, unfollowUser, cancelFollowRequest, followingStatus } = useFollowUser(profile, setProfile);
    const { fetchAsync: createConversation, error: createConversationError, isLoading: createConversationIsLoading } = useFetch();

    useToastError(error || createConversationError);

    // POSSIBLE CASES
    // Looking at own profile                               -> Edit Profile
    // looking at non-followed profile [private & public]   -> Follow & Message
    // looking at followed profile                          -> Unfollow & Message
    const handleEditProfilePress = () => {
        if (setShowEditSheet) {
            setShowEditSheet(true);
        }
    };

    const handleMessageBtnPress = async () => {
        createConversation(
            {
                url: '/conversation/create',
                method: 'POST',
                body: { users: [profile._id] },
            },
            (conversation) => {
                // navigate to chat room
                appNavigationContainerRef.navigate('Inbox', {
                    screen: 'ChatRoom',
                    params: { conversationId: conversation._id },
                });
            }
        );
    };

    return (
        <View style={styles.wrapper}>
            {isSelfProfile && <GrayButton onPress={handleEditProfilePress} label='Edit Profile' containerStyle={styles.button} />}
            {isLoading && <Loading style={styles.loadingButton} />}
            {!isSelfProfile && !isLoading && (
                <>
                    {followingStatus === FollowingStatus.REQUESTED && (
                        <GrayButton onPress={() => cancelFollowRequest()} label='Requested' containerStyle={styles.button} />
                    )}
                    {followingStatus === FollowingStatus.FOLLOWING && (
                        <GrayButton onPress={() => unfollowUser()} label='Unfollow' containerStyle={styles.button} />
                    )}
                    {followingStatus === FollowingStatus.NOT_FOLLOWING && (
                        <PrimaryButton onPress={() => followUser()} label='Follow' containerStyle={styles.button} />
                    )}
                    {profile.isPublic ||
                        (followingStatus === FollowingStatus.FOLLOWING && (
                            <GrayButton
                                onPress={handleMessageBtnPress}
                                label='Message'
                                containerStyle={styles.button}
                                isLoading={createConversationIsLoading}
                            />
                        ))}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        height: 40,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    buttonText: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.PRIMARY,
        fontWeight: 'bold',
    },
    loadingButton: {
        flex: 1,
        minWidth: BUTTON_DEFAULT_MIN_WIDTH,
        gap: 5,
        flexDirection: 'row',
        paddingHorizontal: 12.5,
        paddingVertical: 6,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Sizes.BORDER_RADIUS_MD,
        backgroundColor: Colours.GRAY_LIGHT,
    },
    button: {
        flex: 1,
    },
});
