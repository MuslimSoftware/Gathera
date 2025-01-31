import { Schema, Model, model } from 'mongoose';

export interface IFeedback extends Document {
    // Required fields
    user: Schema.Types.ObjectId;
    idea: number;
    easeOfUse: number;
    feedbackText?: string;
}

const feedbackSchema = new Schema<IFeedback>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    idea: {
        type: Number,
        required: true,
    },
    easeOfUse: {
        type: Number,
        required: true,
    },
    feedbackText: {
        type: String,
        required: false,
    },
});

export const FeedbackModel: Model<IFeedback> = model<IFeedback>('Feedback', feedbackSchema);
