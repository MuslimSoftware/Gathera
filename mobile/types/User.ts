import { Gender, SubscriptionType, UserBorder } from '../gathera-lib/enums/user';

export interface User {
    _id: string;
    phone_number: string;
    email: string;
    fname: string;
    lname: string;
    date_of_birth: Date;
    gender: Gender;
    display_name: string;
    avatar_uri: string;
    bio: string;
    is_public: boolean;
    createdAt: Date;
    updatedAt: Date;
    is_subscribed: boolean;
    expo_push_token: string;
    instagram_username: string;
    subscription: string;
    border: string;
    details: UserDetails[];
    interests: string[];
}

export interface UserDetails {
    _id: string;

    // Required fields
    user: string;

    // Optional fields
    education?: string;
    work?: string;
    alcohol?: string;
    smoke?: string;
    weed?: string;
    fitness?: string;
    height?: string;
    politics?: string;
    religion?: string;
    zodiac?: string;
    nationality?: string[];
}

export interface Profile {
    _id: string;
    avatar_uri: string;
    display_name: string;
    subscription: SubscriptionType;
    border: UserBorder;
    bio: string;
    is_public: boolean;
    instagram_username: string;
    date_of_birth: Date;
    follower_count: number;
    following_count: number;
    gathering_count: number;
    isFollowing: true;
    isRequested: false;
    isVisible: true;
    isAuthedUserBlocked: boolean;
    isRequestedUserBlocked: boolean;
    details: Array<UserDetails>;
    interests: Array<string> | Set<string>;
    views: number;
}

export interface UserPreview {
    _id: string;
    avatar_uri: string;
    display_name: string;
    subscription: SubscriptionType;
    border: UserBorder;
    isRequested?: boolean;
    isFollowing?: boolean;
}

export interface UserPreviewWithFollowers extends UserPreview {
    follower_count: number;
}

export type ProfilePictureSize = 'mini' | 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface PermissionType {
    status: PermissionStatus;
    canAskAgain: boolean;
}
