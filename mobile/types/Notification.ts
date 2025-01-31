import { NotificationType } from '../gathera-lib/enums/notification';
import { UserPreview } from './User';

export interface Notification {
    _id: string;
    user: string;
    user_from: UserPreview;
    type: NotificationType;
    createdAt: Date;
    updatedAt: Date;
    isFull?: boolean;
    gathering?: string | any;
    place?: string;
}

export enum PushNotificationType {
    Follow = 'follow',
    FollowReq = 'followReq',
    Invite = 'invite',
    Message = 'message',
}

export interface PushNotification {
    title: string;
    subtitle?: string;
    body: string;
    data: {
        type: PushNotificationType;
        picture_uri?: string;
        conversation_id?: string;
        profileId?: string;
        gatheringId?: string;
    };
}
