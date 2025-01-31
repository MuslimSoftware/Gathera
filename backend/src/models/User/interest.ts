import { Schema, Model, model } from 'mongoose';

export interface IInterest extends Document {
    // Required fields
    name: string;
    icon: string;
    category: string;
}

const interestSchema = new Schema<IInterest>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    icon: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
});

// Virtuals
interestSchema.virtual('count', {
    ref: 'UserInterest',
    localField: '_id',
    foreignField: 'interest',
    count: true,
});

// Indexes
interestSchema.index({ name: 1 }, { unique: true });

export const InterestModel: Model<IInterest> = model<IInterest>('Interest', interestSchema);
