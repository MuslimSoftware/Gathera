import { Gathering } from './Gathering';
import { UserPreview } from './User';

export interface Message {
    _id: string;
    sender: any;
    message: string;
    createdAt: Date;
    read_users: string[];
}

export interface Conversation {
    _id: string;
    conversation_name: string;
    users: UserPreview[];
    createdAt: Date;
    updatedAt: Date;
    gathering?: Gathering;
    last_message: Message;
}
