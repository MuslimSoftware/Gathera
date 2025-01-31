import { Schema, model, Document, Model } from 'mongoose';

export interface IUserInterest extends Document {
    // Required fields
    user: Schema.Types.ObjectId;
    interest: Schema.Types.ObjectId;
}

const userInterestSchema = new Schema<IUserInterest>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    interest: {
        type: Schema.Types.ObjectId,
        ref: 'Interest',
        required: true,
    },
});

// Indexes
userInterestSchema.index({ user: 1, interest: 1 }, { unique: true });

export const UserInterestModel = (Model<IUserInterest> = model<IUserInterest>('UserInterest', userInterestSchema));
