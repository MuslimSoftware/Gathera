import { THIRTY_DAYS_MS } from '@utils/validators/Validators';
import { NotificationType } from '@lib/enums/notification';
import { Schema, Document, model } from 'mongoose';
export interface INotification extends Document {
    // Required fields
    user: Schema.Types.ObjectId;
    user_from: Schema.Types.ObjectId;
    type: NotificationType;

    // Defaulted fields
    is_read?: boolean;

    // Optional fields
    gathering?: Schema.Types.ObjectId; // For invite notifications
    place?: Schema.Types.ObjectId; // For invite notifications
}

const notificationSchema = new Schema<INotification>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        user_from: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(NotificationType),
            required: true,
        },
        gathering: {
            type: Schema.Types.ObjectId,
            ref: 'Gathering',
            required: false,
        },
        place: {
            type: Schema.Types.ObjectId,
            ref: 'Place',
            required: false,
        },
        is_read: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    { timestamps: true }
);

// Indexes
notificationSchema.index({ user: 1, createdAt: -1 }); // Sorts notifications by user and createdAt in descending order
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: (THIRTY_DAYS_MS * 6) / 1000 }); // 6 months in seconds

export const NotificationModel = model<INotification>('Notification', notificationSchema);
