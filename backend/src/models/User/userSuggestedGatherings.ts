import { ONE_DAY_MS } from '@/utils/validators/Validators';
import { Schema, model, Document, Model } from 'mongoose';

export const MAX_NUM_SUGGESTED_GATHERINGS = 50; // Max number of suggested gatherings to store for each user

export interface IUserSuggestedGatherings extends Document {
    // Required fields
    user: Schema.Types.ObjectId;
    suggested_gatherings: Schema.Types.ObjectId[]; // List of gathering ids that are suggested to the user sorted by score descending
}

const userSuggestedGatheringsSchema = new Schema<IUserSuggestedGatherings>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        suggested_gatherings: {
            type: [Schema.Types.ObjectId],
            ref: 'Gathering',
            required: true,
            maxlength: MAX_NUM_SUGGESTED_GATHERINGS,
        },
    },
    { timestamps: true }
);

// Indexes
userSuggestedGatheringsSchema.index({ user: 1 }, { unique: true }); // Query by user & 1 doc per user
userSuggestedGatheringsSchema.index({ updatedAt: 1 }, { expireAfterSeconds: ONE_DAY_MS / 1000 }); // Auto expire docs after 1 day of inactivity

export const UserSuggestedGatheringsModel: Model<IUserSuggestedGatherings> = model<IUserSuggestedGatherings>(
    'UserSuggestedGatherings',
    userSuggestedGatheringsSchema
);
