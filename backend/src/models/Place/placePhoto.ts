import { Schema, model, Document } from 'mongoose';
import { validateImageUrl } from '@lib/validators/Validators';
import { validateGooglePlaceId } from '@lib/validators/PlaceValidators';

export interface IPlacePhoto extends Document {
    // Required fields
    google_place_id: string;
    url: string;
}

const placePhotoSchema = new Schema<IPlacePhoto>({
    google_place_id: {
        type: String,
        required: true,
        validate: {
            validator: validateGooglePlaceId,
            message: `Invalid google_place_id`,
        },
    },
    url: { type: String, required: true, validate: { validator: validateImageUrl, message: 'Photo url must be a valid url.' } },
});

// Indexes
placePhotoSchema.index({ google_place_id: 1 }); // Sorts photos by place
placePhotoSchema.index({ google_place_id: 1, url: 1 }, { unique: true }); // Ensures that each photo is unique

export const PlacePhotoModel = model<IPlacePhoto>('PlacePhoto', placePhotoSchema);
