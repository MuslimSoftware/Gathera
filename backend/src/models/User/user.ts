import { Schema, model, Model, Document } from 'mongoose';
import { userDeletionHandler } from '@utils/Profiles';
import { validateImageUrl } from '@lib/validators/Validators';
import {
    validateDateOfBirth,
    validateEmail,
    validateDisplayName,
    validatePhoneNumber,
    validateName,
    validateBio,
    validateInstagramUsername,
    validateLastName,
} from '@lib/validators/UserValidators';
import { Gender, SubscriptionType, UserBorder } from '@lib/enums/user';
import { MAX_NAME_LENGTH } from '@lib/constants/user';
import { validatePushToken } from '@/utils/validators/UserValidators';

export interface IUser extends Document {
    // Required fields
    phone_number: string;
    fname: string;
    date_of_birth: Date;
    gender: Gender;
    display_name: string;

    // Defaulted fields
    is_public: boolean;
    subscription: SubscriptionType;
    border?: UserBorder;
    trending_score?: number; // Used for trending users

    // Optional fields
    avatar_uri?: string;
    instagram_username?: string;
    email?: string;
    bio?: string;
    lname?: string;
    expo_push_token?: string;
}

const userSchema = new Schema<IUser>(
    {
        phone_number: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: validatePhoneNumber,
                message: 'Invalid phone number',
            },
        },
        fname: {
            type: String,
            required: true,
            validate: {
                validator: validateName,
                message: `First name must be between 1 and ${MAX_NAME_LENGTH} characters long.`,
            },
        },
        date_of_birth: {
            type: Date,
            required: true,
            validate: {
                validator: validateDateOfBirth,
                message: 'Date of birth must be more than 18 years ago.',
            },
        },
        gender: {
            required: true,
            type: String,
            enum: Object.values(Gender),
        },

        display_name: {
            type: String,
            required: true,
            validate: {
                validator: validateDisplayName,
                message: `Display name must be between 1 and ${MAX_NAME_LENGTH * 2 + 1} characters long.`,
            },
        },
        avatar_uri: {
            type: String,
            required: false,
            validate: {
                validator: validateImageUrl,
                message: 'Profile picture must be a valid url.',
            },
        },

        email: {
            type: String,
            unique: true,
            sparse: true, // Allows multiple documents that have no value for the indexed field
            required: false,
            validate: {
                validator: validateEmail,
                message: 'Invalid email',
            },
        },
        lname: {
            type: String,
            required: false,
            validate: {
                validator: validateLastName,
                message: `Invalid last name`,
            },
        },

        border: {
            type: String,
            enum: Object.values(UserBorder),
            required: false,
            default: UserBorder.NONE,
        },

        trending_score: {
            type: Number,
            required: false,
            default: 0,
        },

        bio: {
            type: String,
            required: false,
            validate: {
                validator: validateBio,
                message: 'Invalid bio',
            },
        },
        is_public: {
            type: Boolean,
            required: false,
            default: true,
        },
        expo_push_token: {
            type: String,
            required: false,
            validate: {
                validator: validatePushToken,
                message: 'Invalid Expo push token',
            },
        },
        subscription: {
            type: String,
            required: true,
            enum: Object.values(SubscriptionType),
            default: SubscriptionType.FREE,
        },
        instagram_username: {
            type: String,
            required: false,
            validate: {
                validator: validateInstagramUsername,
                message: 'Invalid Expo push token',
            },
        },
    },
    { timestamps: true }
);

// Virtuals
userSchema.virtual('follower_count', {
    ref: 'Follower',
    localField: '_id',
    foreignField: 'user',
    count: true,
});

userSchema.virtual('following_count', {
    ref: 'Follower',
    localField: '_id',
    foreignField: 'follower',
    count: true,
});

userSchema.virtual('gathering_count', {
    ref: 'Gathering',
    localField: '_id',
    foreignField: 'user_list',
    count: true,
});

userSchema.virtual('interests', {
    ref: 'UserInterest',
    localField: '_id',
    foreignField: 'user',
});

userSchema.virtual('blocked_users', {
    ref: 'Block',
    localField: '_id',
    foreignField: 'user',
});

// Middleware
userSchema.post('findOneAndDelete', async (user) => {
    if (!user) return;
    await userDeletionHandler(user._id);
});

// Indexes
userSchema.index({ phone_number: 1 }); // Query users by phone number
userSchema.index({ email: 1 }, { partialFilterExpression: { email: { $exists: true } } }); // Query users by email if email exists
userSchema.index({ display_name: 1 }); // Query users by display name
userSchema.index({ trending_score: 'desc' }); // Query users by trending score

export const UserModel: Model<IUser> = model<IUser>('User', userSchema);
