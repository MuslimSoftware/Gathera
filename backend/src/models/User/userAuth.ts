import { DeviceType } from '@/gathera-lib/enums/user';
import { DeviceInfo } from '@/gathera-lib/types/user';
import { Document, Schema, Model, model } from 'mongoose';

export const MAX_AUTH_FIELD_LENGTH = 255;

export interface IUserAuth extends Document {
    // Required fields
    user: Schema.Types.ObjectId;
    ip_address: string;
    refresh_token: string;

    // Optional fields
    device_info?: DeviceInfo;
}

const userAuthSchema = new Schema<IUserAuth>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        ip_address: {
            type: String,
            required: true,
            maxlength: MAX_AUTH_FIELD_LENGTH,
        },
        refresh_token: {
            type: String,
            required: true,
            unique: true,
            maxlength: MAX_AUTH_FIELD_LENGTH,
        },
        device_info: {
            device_name: {
                type: String,
                required: false,
                maxlength: MAX_AUTH_FIELD_LENGTH,
            },
            device_type: {
                type: String,
                enum: Object.values(DeviceType),
                required: false,
                maxlength: MAX_AUTH_FIELD_LENGTH,
            },
            device_model: {
                type: String,
                required: false,
                maxlength: MAX_AUTH_FIELD_LENGTH,
            },
            device_os: {
                type: String,
                required: false,
                maxlength: MAX_AUTH_FIELD_LENGTH,
            },
            device_os_version: {
                type: String,
                required: false,
                maxlength: MAX_AUTH_FIELD_LENGTH,
            },
        },
    },
    { timestamps: true }
);

// Indexes
userAuthSchema.index({ user: 1 }, { unique: true });
userAuthSchema.index({ refresh_token: 1 }, { unique: true });

export const UserAuthModel: Model<IUserAuth> = model<IUserAuth>('UserAuth', userAuthSchema);
