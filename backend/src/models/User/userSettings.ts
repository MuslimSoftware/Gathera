import { Schema, model, Document, Model } from 'mongoose';

export interface IUserSettings extends Document {
    // Required fields
    user: Schema.Types.ObjectId;

    // Defaulted fields
    is_notifications_enabled: boolean;
    is_subscribed_to_emails: boolean;
}

const userSettingsSchema = new Schema<IUserSettings>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    is_notifications_enabled: {
        type: Boolean,
        required: false,
        default: false,
    },
    is_subscribed_to_emails: {
        type: Boolean,
        required: false,
        default: true,
    },
});

// Indexes
userSettingsSchema.index({ user: 1 }, { unique: true });

export const UserSettingsModel: Model<IUserSettings> = model<IUserSettings>('UserSettings', userSettingsSchema);
