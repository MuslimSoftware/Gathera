import { Schema, model, Document } from 'mongoose';

export interface IBlock extends Document {
    user: Schema.Types.ObjectId;
    user_blocked: Schema.Types.ObjectId;
}

const blockSchema = new Schema<IBlock>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        user_blocked: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

// Indexes
blockSchema.index({ user: 1 });
blockSchema.index({ user: 1, user_blocked: 1 }, { unique: true });

export const BlockModel = model<IBlock>('Block', blockSchema);
