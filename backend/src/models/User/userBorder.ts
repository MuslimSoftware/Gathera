import { UserBorder } from '@lib/enums/user';
import { Schema, Document, model, Model } from 'mongoose';

export interface IUserBorder extends Document {
    // Required fields
    user: Schema.Types.ObjectId;
    border_owned: UserBorder;
}

const userBorderSchema = new Schema<IUserBorder>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    border_owned: {
        type: String,
        enum: UserBorder,
        required: true,
    },
});

// Indexes
userBorderSchema.index({ user: 1, border_owned: 1 }, { unique: true });

export const UserBorderModel: Model<IUserBorder> = model<IUserBorder>('UserBorder', userBorderSchema);
