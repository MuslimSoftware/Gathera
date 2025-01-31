export enum FollowingStatus {
    NOT_FOLLOWING = 'Follow',
    FOLLOWING = 'Unfollow',
    REQUESTED = 'Requested',
}

/**
 * Gets the following status of a another user for the authed user
 * @param user
 * @returns
 */
export const getFollowingStatus = (user: any): FollowingStatus => {
    return user.isRequested ? FollowingStatus.REQUESTED : user.isFollowing ? FollowingStatus.FOLLOWING : FollowingStatus.NOT_FOLLOWING;
};
