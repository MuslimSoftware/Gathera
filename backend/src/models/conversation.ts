import { Schema, Document, model } from 'mongoose';
import { conversationDeletionHandler } from '@utils/ConversationsHelper';
import { validateConversationName } from '@lib/validators/ConversationValidators';

export interface IConversation extends Document {
    // Required fields
    conversation_name: string;
    users: Array<Schema.Types.ObjectId>;
    visible_to: Array<Schema.Types.ObjectId>;

    // Defaulted fields
    last_message: Schema.Types.ObjectId;

    // Optional fields
    gathering?: Schema.Types.ObjectId;
}

const conversationSchema = new Schema<IConversation>(
    {
        conversation_name: {
            type: String,
            required: false,
            validate: {
                validator: validateConversationName,
                message: 'Invalid conversation name',
            },
        },
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        visible_to: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        last_message: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
            default: null,
            required: false,
        },
        gathering: {
            type: Schema.Types.ObjectId,
            ref: 'Gathering',
            required: false,
        },
    },
    { timestamps: true }
);

// Middleware
conversationSchema.post('findOneAndDelete', async (conversation) => {
    if (!conversation) return;
    await conversationDeletionHandler(conversation._id);
});

export const ConversationModel = model<IConversation>('Conversation', conversationSchema);
