import { Schema, Document, model } from 'mongoose';

export interface IPlaceInterest extends Document {
    // Required fields
    place: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
}

const placeInterestSchema = new Schema<IPlaceInterest>(
    {
        place: {
            type: Schema.Types.ObjectId,
            ref: 'Place',
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

// Indexes
placeInterestSchema.index({ place: 1, user: 1 }, { unique: true }); // Prevents duplicate interests for a place by a user

export const PlaceInterestModel = model<IPlaceInterest>('PlaceInterest', placeInterestSchema);
