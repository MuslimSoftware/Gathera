import { Schema, Model, model } from 'mongoose';

export interface IFollower extends Document {
    // Required fields
    user: Schema.Types.ObjectId;
    follower: Schema.Types.ObjectId;
}

const followerSchema = new Schema<IFollower>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        follower: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

// Indexes
followerSchema.index({ user: 1, createdAt: 1 }); // Sorts followers by user and createdAt in ascending order
followerSchema.index({ follower: 1, createdAt: 1 }); // Sorts followers by follower and createdAt in ascending order
followerSchema.index({ user: 1, follower: 1 }, { unique: true }); // Prevents duplicate followers for a user

export const FollowerModel: Model<IFollower> = model<IFollower>('Follower', followerSchema);
