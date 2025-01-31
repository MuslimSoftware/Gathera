import { ObjectId } from 'mongoose';
import { ConversationModel } from '@models/conversation';
import { USER_PREVIEW_FIELDS } from '@utils/Profiles';
import StatusError from '@utils/StatusError';
import { fetchDocument } from '@utils/fetchDocument';
import { MessageModel } from '@models/message';
import { compareObjectIds } from '@utils/validators/Validators';

export const getFullConversationInfo = async (conversation_id: string, user_id: string) => {
    const conversation = await fetchDocument(conversation_id, ConversationModel);

    // check if user is in conversation
    if (!conversation.users.some((id: string) => compareObjectIds(id, user_id))) throw new StatusError('User is not in conversation.', 400);

    const promises = [
        conversation.populate('users', USER_PREVIEW_FIELDS),
        conversation.populate({
            path: 'last_message',
            select: 'message createdAt sender read_users',
            populate: {
                path: 'sender',
                select: USER_PREVIEW_FIELDS,
            },
        }),
        conversation.populate('gathering', 'gathering_pic createdAt'),
    ];

    await Promise.all(promises);

    if (conversation.last_message) {
        const uniqueUsers = new Set<string>(conversation.last_message.read_users.map((id: string) => id.toString()));
        uniqueUsers.add(user_id);
        conversation.last_message.read_users = Array.from(uniqueUsers);

        await conversation.last_message.save();
    }

    return conversation.toObject();
};

export const conversationDeletionHandler = async (conversation_id: string | ObjectId) => {
    // delete all messages in conversation
    await MessageModel.deleteMany({ conversation: conversation_id });
};
