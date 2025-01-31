import { Schema, model, Document } from 'mongoose';
import { validateMessage } from '@lib/validators/MessageValidators';
import { THIRTY_DAYS_MS } from '@utils/validators/Validators';

export interface IMessage extends Document {
    // Required fields
    sender: Schema.Types.ObjectId;
    conversation: Schema.Types.ObjectId;
    message: string;

    // Default fields
    read_users: Schema.Types.ObjectId[];
}

const messageSchema = new Schema<IMessage>(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        conversation: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        message: {
            type: String,
            required: true,
            validate: {
                validator: validateMessage,
                message: 'Invalid message',
            },
        },
        read_users: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                default: [],
                required: false,
            },
        ],
    },
    { timestamps: true }
);

// Indexes
messageSchema.index({ conversation: 1, createdAt: -1 }); // Sorts messages by conversation and createdAt in descending order
messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: THIRTY_DAYS_MS / 1000 }); // 30 days in seconds

export const MessageModel = model<IMessage>('Message', messageSchema);
