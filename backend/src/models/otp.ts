import { THIRTY_MINUTES_MS } from '@utils/validators/Validators';
import { Schema, Document, model } from 'mongoose';
import { validatePhoneNumber } from '@/gathera-lib/validators/UserValidators';

export interface IOtp extends Document {
    // Required fields
    phone_number: string;
    code: string;
}

const otpSchema = new Schema<IOtp>(
    {
        phone_number: {
            type: String,
            validate: {
                validator: validatePhoneNumber,
                message: 'Invalid phone number',
            },
            required: true,
        },
        code: { type: String, maxlength: 6, required: true },
    },
    { timestamps: true }
);

// Indexes
otpSchema.index({ phone_number: 1 });
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: THIRTY_MINUTES_MS / 1000 }); // expire after 30 minutes

export const OtpModel = model<IOtp>('Otp', otpSchema);
