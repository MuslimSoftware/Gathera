import { Conversation } from './Inbox';
import { UserPreview } from './User';
export interface Gathering {
    _id: string;
    host_user: string;
    place: {
        _id: string;
        name: string;
    };
    gathering_name: string;
    user_list: UserPreview[];
    max_count: number;
    conversation: Conversation;
    gathering_pic: string;
    requested_user_list: UserPreview[];
    is_private: boolean;
    gathering_description: string;
    event_date: string;
    invited_user_list?: UserPreview[];
    createdAt: Date;
    updatedAt: Date;
}
