import React, { useMemo, useState } from 'react';
import EditProfileBottomSheet from '../components/EditProfileBottomSheet/EditProfileBottomSheet';
import ProfileBio, { ProfileBioSkeleton } from '../components/Profile/ProfileBio';
import ProfileContent, { ProfileContentSkeleton } from '../components/Profile/ProfileContent';
import ErrorAlert from '../../../shared/components/ErrorAlert';
import { StyleSheet, View, Linking, RefreshControl, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ProfileInfo, ProfileInfoSkeleton } from '../components/Profile/ProfileInfo';
import { GatheringInviteBottomSheet } from '../../../shared/components/Sheets/GatheringInviteBottomSheet';
import { GearsIcon, MoreVerticalIcon } from '../../../shared/components/Core/Icons';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { ProfileInviteMoreButtons } from '../components/Profile/ProfileInviteMoreButtons';
import { MoreActionsBottomSheet } from './MoreActionsBottomSheet';
import { useNavigate } from '../../../shared/hooks/useNavigate';
import { ViewsIndicator } from '../../../shared/components/Core/Views/ViewsIndicator';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
interface ProfileProps {
    profile: any;
    setProfile: React.Dispatch<React.SetStateAction<any>>;
    isLoading: boolean;
    error: string;
    isUser: boolean;
    isVisible: boolean;
    showBackBtn: boolean;
    fetchProfile: () => void;
}

const areEqual = (prevProps: ProfileProps, nextProps: ProfileProps) => {
    return (
        prevProps.profile === nextProps.profile &&
        prevProps.isLoading === nextProps.isLoading &&
        prevProps.error === nextProps.error &&
        prevProps.isUser === nextProps.isUser &&
        prevProps.isVisible === nextProps.isVisible &&
        prevProps.showBackBtn === nextProps.showBackBtn
    );
};

export const Profile: React.FC<ProfileProps> = React.memo(
    ({ profile, setProfile, error, isLoading, isUser, isVisible, showBackBtn, fetchProfile }: ProfileProps) => {
        const [showEditSheet, setShowEditSheet] = useState<boolean>(false);
        const [showGatheringSheet, setShowGatheringSheet] = useState<boolean>(false);
        const [showMoreSheet, setShowMoreSheet] = useState<boolean>(false);
        const { navigateToScreen, pushScreen } = useNavigate();

        if (error) {
            ErrorAlert('Error', error);
            return <></>;
        }

        const HeaderRight = useMemo(() => {
            if (isLoading) return <></>;
            return (
                <View style={styles.pageHeader}>
                    <ViewsIndicator
                        count={profile.views}
                        onPress={() => pushScreen('ProfileViewsDetails', { profileId: profile._id, viewCount: profile.views })}
                    />
                    {isUser && <GearsIcon style={styles.iconButton} onPress={() => navigateToScreen('Settings')} />}
                    {!isUser && <MoreVerticalIcon style={styles.iconButton} onPress={() => setShowMoreSheet(true)} />}
                </View>
            );
        }, [isLoading, isUser, profile._id]);

        return (
            <HeaderPageLayout showBackBtn={showBackBtn} headerLeft={showBackBtn ? '' : 'Profile'} headerRight={HeaderRight}>
                <View>
                    <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={fetchProfile} />}>
                        <View style={styles.headerSection}>
                            <View style={styles.headerInfo}>
                                {isLoading && <ProfileInfoSkeleton />}
                                {!isLoading && (
                                    <ProfileInfo
                                        profile={profile}
                                        setProfile={setProfile}
                                        setShowEditSheet={setShowEditSheet}
                                        isVisible={isVisible}
                                    />
                                )}
                                {isLoading && <ProfileBioSkeleton />}
                                {!isLoading && <ProfileBio display_name={`${profile.display_name}`} bio={profile.bio} />}
                            </View>
                            {!isUser && (
                                <ProfileInviteMoreButtons
                                    onInviteBtnPress={setShowGatheringSheet.bind(null, true)}
                                    onInstagramPress={
                                        profile.instagram_username &&
                                        (() => Linking.openURL(`https://www.instagram.com/${profile.instagram_username}`))
                                    }
                                />
                            )}
                        </View>
                    </ScrollView>
                </View>
                <ProfileContent profile={profile} />
                {showGatheringSheet && <GatheringInviteBottomSheet setShowGatheringSheet={setShowGatheringSheet} profileId={profile._id} />}
                <NavigationContainer independent={true}>
                    {showEditSheet && <EditProfileBottomSheet profile={profile} setProfile={setProfile} setShowEditSheet={setShowEditSheet} />}
                    {showMoreSheet && (
                        <MoreActionsBottomSheet
                            userBeingViewedDisplayName={profile.display_name}
                            userBeingViewedId={profile._id}
                            setShowSheet={setShowMoreSheet}
                            isBlocked={profile.isRequestedUserBlocked}
                        />
                    )}
                </NavigationContainer>
            </HeaderPageLayout>
        );
    },
    areEqual
);

export const ProfileSkeleton = ({ error }: any) => {
    return (
        <HeaderPageLayout showBackBtn={false}>
            <View style={[styles.pageWrapper, { gap: 10 }]}>
                <View style={styles.headerSection}>
                    <ProfileInfoSkeleton hasError={!!error} />
                    <ProfileBioSkeleton hasError={!!error} />
                </View>
                <ErrorMessage message={error} />
                {!error && <ProfileContentSkeleton />}
            </View>
        </HeaderPageLayout>
    );
};
const styles = StyleSheet.create({
    pageWrapper: {},
    pageHeader: {
        flexDirection: 'row',
        gap: 10,
    },
    headerSection: {
        paddingHorizontal: 20,
        paddingBottom: 5,
        gap: 10,
    },
    headerInfo: {
        gap: 5,
    },
    contentContainer: {
        flex: 1,
    },
    iconButton: {
        padding: 5,
        paddingRight: 0,
    },
});
