import React from 'react';
import { Profile, ProfileSkeleton } from './Profile';
import { useProfile } from '../hooks/useProfile';
import { getAuthContextValues } from '../../../shared/context/AuthContext';
import { useOnFocus } from '../../../shared/hooks/useOnFocus';

export const ProfileContainer = React.memo(({ route }: any) => {
    const { profileId } = route.params as any;
    const { profile, setProfile, isLoading, error, fetchProfile } = useProfile(profileId);
    const {
        user: { _id: userId },
    } = getAuthContextValues();
    const isUser = route.name !== 'OtherProfile' || userId == profileId;
    const isVisible = profile && (userId == profile._id || profile.is_public || profile.isFollowing);
    const showBackBtn = route.name === 'OtherProfile';
    useOnFocus(fetchProfile);

    if (isLoading) return <ProfileSkeleton />;
    if (error || !profile) return <ProfileSkeleton error={error} />;
    return (
        <Profile
            profile={profile}
            setProfile={setProfile}
            isLoading={isLoading}
            error={error}
            isUser={isUser}
            isVisible={isVisible}
            showBackBtn={showBackBtn}
            fetchProfile={fetchProfile}
        />
    );
});
