import React from 'react';
import { Pressable, RefreshControl, StyleSheet } from 'react-native';
import { BORDER_LIST } from '../../../../../shared/utils/borderHelper';
import { HeaderPageLayout } from '../../../../../shared/layouts/HeaderPageLayout';
import { useUpdateProfile } from '../../../hooks/useUpdateProfile';
import { ScrollView } from 'react-native-gesture-handler';
import { PROFILE_PIC_SIZES, ProfilePicture } from '../../../../../shared/components/MainPictures/ProfilePicture';
import { Colours, Sizes } from '../../../../../shared/styles/Styles';
import { getAuthContextValues } from '../../../../../shared/context/AuthContext';
import { useNavigate } from '../../../../../shared/hooks/useNavigate';
import { UserBorder } from '../../../../../gathera-lib/enums/user';
import { HeaderPageSubmit } from '../../../../../shared/components/Forms/Form';
import { ErrorMessage } from '../../../../../shared/components/ErrorMessage';

export const BorderPicker = ({ profile, setProfile }: any) => {
    const { user, setUser } = getAuthContextValues();
    const [selectedBorder, setSelectedBorder] = React.useState<UserBorder>(user.border as UserBorder);
    const { isLoading, updateProfile } = useUpdateProfile();
    const { goBack, navigateApp } = useNavigate();

    const handleSubmitPremium = () => {
        setUser({
            ...user,
            border: selectedBorder,
        });
        setProfile({
            ...profile,
            border: selectedBorder,
        });

        updateProfile({ border: selectedBorder });
        goBack();
    };

    const handleSubmitNonPremium = () => {
        navigateApp('Subscription');
    };

    const handleSubmit = () => {
        if (selectedBorder === user.border) {
            goBack();
            return;
        }

        if (user.subscription === 'free') {
            handleSubmitNonPremium();
        } else {
            handleSubmitPremium();
        }
    };

    const pageSubmit: HeaderPageSubmit = {
        canSubmit: selectedBorder !== user.border,
        label: 'Save',
        onSubmit: handleSubmit,
        isLoading: isLoading,
    };

    const handleBorderPressNonPremium = (border: UserBorder) => {
        navigateApp('Subscription', { border: border });
    };

    const handleBorderPressPremium = (border: UserBorder) => {
        setSelectedBorder(border);
    };

    const handleBorderPress = (border: UserBorder) => {
        if (user.subscription === 'free') {
            handleBorderPressNonPremium(border);
        } else {
            handleBorderPressPremium(border);
        }
    };

    return (
        <HeaderPageLayout title='Manage Borders' submit={pageSubmit}>
            {user.subscription === 'free' && <ErrorMessage message={'You need Gathera Premium to use profile borders!'} />}
            <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={false} />}>
                <Pressable
                    style={[
                        styles.borderContainer,
                        {
                            backgroundColor: selectedBorder === UserBorder.NONE ? Colours.GRAY_LIGHT : 'transparent',
                        },
                    ]}
                    onPress={() => handleBorderPress(UserBorder.NONE)}
                >
                    <ProfilePicture uri={user.avatar_uri} border={UserBorder.NONE} size='large' />
                </Pressable>
                {BORDER_LIST.map((border: UserBorder) => {
                    return (
                        <Pressable
                            key={border}
                            style={[
                                styles.borderContainer,
                                {
                                    backgroundColor: border === selectedBorder ? Colours.GRAY_LIGHT : 'transparent',
                                },
                            ]}
                            onPress={() => handleBorderPress(border)}
                        >
                            <ProfilePicture uri={user.avatar_uri} border={border} size='large' />
                        </Pressable>
                    );
                })}
            </ScrollView>
        </HeaderPageLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    lockWrapper: {
        position: 'absolute',
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0.65)',
        width: PROFILE_PIC_SIZES.large.width,
        height: PROFILE_PIC_SIZES.large.height,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        justifyContent: 'center',
        alignItems: 'center',
    },
    borderContainer: {
        height: 100,
        width: '45%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
