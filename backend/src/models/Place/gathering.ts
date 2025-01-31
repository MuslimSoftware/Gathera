import { Schema, model, Document } from 'mongoose';
import { gatheringDeletionHandler } from '@utils/GatheringsHelper';
import { validateGatheringDescription, validateGatheringName, validateMaxGatheringCount } from '@lib/validators/GatheringValidators';
import { validateDate, validateImageUrl } from '@lib/validators/Validators';

export interface IGathering extends Document {
    // Required fields
    host_user: Schema.Types.ObjectId;
    place: Schema.Types.ObjectId;
    gathering_name: string;
    user_list: Schema.Types.ObjectId[];
    max_count: number;
    conversation: Schema.Types.ObjectId;

    // Defaulted fields
    gathering_pic: string;
    requested_user_list: Schema.Types.ObjectId[];
    is_private: boolean;
    gathering_description: string;

    // Optional fields
    event_date?: Date;
}

const gatheringSchema: Schema<IGathering> = new Schema<IGathering>(
    {
        host_user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        place: {
            type: Schema.Types.ObjectId,
            ref: 'Place',
            required: true,
        },
        gathering_name: {
            type: String,
            required: true,
            validate: {
                validator: validateGatheringName,
                message: 'Invalid gathering name',
            },
        },
        user_list: {
            type: [Schema.Types.ObjectId],
            ref: 'User',
            required: true,
        },
        max_count: {
            type: Number,
            required: true,
            validate: {
                validator: validateMaxGatheringCount,
                message: 'Invalid max gathering count',
            },
        },
        conversation: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        gathering_pic: {
            type: String,
            required: false,
            validate: {
                validator: validateImageUrl,
                message: 'Gathering picture must be a valid url.',
            },
        },
        requested_user_list: {
            type: [Schema.Types.ObjectId],
            ref: 'User',
            default: [],
        },
        is_private: {
            type: Boolean,
            default: false,
        },
        gathering_description: {
            type: String,
            default: '',
            validate: {
                validator: validateGatheringDescription,
                message: 'Invalid gathering description',
            },
        },
        event_date: {
            type: Date,
            required: false,
            validate: {
                validator: validateDate,
                message: 'Invalid event date',
            },
        },
    },
    { timestamps: true }
);

// Middleware
gatheringSchema.post('findOneAndDelete', async (gathering: IGathering) => {
    if (!gathering) return;
    await gatheringDeletionHandler(gathering._id);
});

// Indexes
gatheringSchema.index({ place: 1 });
gatheringSchema.index({ event_date: -1 });

export const GatheringModel = model<IGathering>('Gathering', gatheringSchema);
