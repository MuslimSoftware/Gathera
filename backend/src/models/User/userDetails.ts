import { validateHeight, validateNationalities } from '@/gathera-lib/validators/UserValidators';
import { MAX_DETAIL_VALUE_LENGTH } from '@lib/constants/user';
import { ConsumptionValues, EducationValues, FitnessValues, PoliticsValues, ReligionValues, ZodiacValues } from '@lib/enums/user';
import { Schema, Document, model, Model } from 'mongoose';

export interface IUserDetails extends Document {
    // Required fields
    user: Schema.Types.ObjectId;

    // Optional fields
    education?: string;
    work?: string;
    alcohol?: string;
    smoke?: string;
    weed?: string;
    fitness?: string;
    height?: string;
    politics?: string;
    religion?: string;
    zodiac?: string;
    nationality?: string[];
}

const userDetailsSchema = new Schema<IUserDetails>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    education: {
        type: String,
        enum: EducationValues,
        required: false,
    },
    work: {
        type: String,
        maxlength: MAX_DETAIL_VALUE_LENGTH,
        required: false,
    },
    alcohol: {
        type: String,
        enum: ConsumptionValues,
        required: false,
    },
    smoke: {
        type: String,
        enum: ConsumptionValues,
        required: false,
    },
    weed: {
        type: String,
        enum: ConsumptionValues,
        required: false,
    },
    fitness: {
        type: String,
        enum: FitnessValues,
        required: false,
    },
    height: {
        type: String,
        maxlength: MAX_DETAIL_VALUE_LENGTH,
        validate: validateHeight,
        required: false,
    },
    politics: {
        type: String,
        enum: PoliticsValues,
        required: false,
    },
    religion: {
        type: String,
        enum: ReligionValues,
        required: false,
    },
    zodiac: {
        type: String,
        enum: ZodiacValues,
        required: false,
    },
    nationality: {
        type: [String],
        validate: validateNationalities,
        required: false,
    },
});

// Indexes
userDetailsSchema.index({ user: 1 }, { unique: true });

export const UserDetailsModel: Model<IUserDetails> = model<IUserDetails>('UserDetails', userDetailsSchema);
