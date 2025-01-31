import { useState } from 'react';
import { useFetch } from './useFetch';
import { FollowingStatus, getFollowingStatus } from '../utils/userHelper';

export const useFollowUser = (profile: any, setProfile?: Function) => {
    const defFollowingStatus = getFollowingStatus(profile);
    const [followingStatus, setFollowingStatus] = useState<FollowingStatus>(defFollowingStatus);
    const { isLoading, error, fetchAsync } = useFetch();

    const followUser = async () => {
        await fetchAsync({ url: `/user/follow/${profile._id}`, method: 'POST' }, (data: any) => {
            setProfile && setProfile(data);
            data.isRequested && setFollowingStatus(FollowingStatus.REQUESTED);
            data.isFollowing && setFollowingStatus(FollowingStatus.FOLLOWING);
        });
    };

    const unfollowUser = async () => {
        await fetchAsync({ url: `/user/unfollow/${profile._id}`, method: 'POST' }, (data: any) => {
            setProfile && setProfile(data);
            !data.isFollowing && setFollowingStatus(FollowingStatus.NOT_FOLLOWING);
        });
    };

    const cancelFollowRequest = async () => {
        await fetchAsync({ url: `/user/cancel-follow-request/${profile._id}`, method: 'POST' }, (data: any) => {
            setProfile && setProfile(data);
            !data.isRequested && setFollowingStatus(FollowingStatus.NOT_FOLLOWING);
        });
    };

    return { error, isLoading, followUser, unfollowUser, cancelFollowRequest, followingStatus };
};
