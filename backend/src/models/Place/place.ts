import { Schema, model, Document } from 'mongoose';
import { validateImageUrl } from '@lib/validators/Validators';
import { validateGooglePlaceId, validatePlaceName } from '@lib/validators/PlaceValidators';
import { PlaceSubType, PlaceType, FoodServices } from '@lib/enums/place';

export interface IPlace extends Document {
    // Required fields
    name: string;
    google_place_id: string;
    location: {
        locality?: string; // Ex: City
        administrative_area?: string; // Ex: Province
        country?: string;
        lat: number;
        lng: number;
    };
    type: PlaceType;
    subtype: PlaceSubType;

    // Defaulted fields
    default_photo?: string;
    trending_score?: number; // Used for trending places

    // Optional fields
    food_services?: FoodServices;
    rating?: number;
    rating_count?: number;
    price_level?: number;
    reservable?: boolean;
    opening_hours?: Object;
    google_maps_url?: string;
    website?: string;
    phone_number?: string;
    summary?: string;
    address?: string;
}

const placeSchema = new Schema<IPlace>(
    {
        // Required fields
        name: {
            type: String,
            required: true,
            validate: {
                validator: validatePlaceName,
                message: `Invalid place name`,
            },
        },
        google_place_id: {
            type: String,
            required: true,
            validate: {
                validator: validateGooglePlaceId,
                message: `Invalid google_place_id`,
            },
        },
        location: {
            _id: false,
            type: {
                locality: {
                    type: String,
                    required: false,
                },
                administrative_area: {
                    type: String,
                    required: false,
                },
                country: {
                    type: String,
                    required: false,
                },
                lat: {
                    type: Number,
                    required: true,
                },
                lng: {
                    type: Number,
                    required: true,
                },
            },
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(PlaceType),
            required: true,
        },
        subtype: {
            type: String,
            enum: Object.values(PlaceSubType),
            required: true,
        },

        // Defaulted fields
        default_photo: {
            type: String,
            required: false,
            default: 'https://cdn-icons-png.flaticon.com/512/3207/3207949.png',
            validate: {
                validator: validateImageUrl,
                message: (props: any) => `${props.value} is not a valid image URL!`,
            },
        },
        trending_score: {
            type: Number,
            required: false,
            default: 0,
        },

        // Optional fields
        food_services: {
            _id: false,
            type: {
                delivery: {
                    type: Boolean,
                    required: false,
                },
                takeout: {
                    type: Boolean,
                    required: false,
                },
                dine_in: {
                    type: Boolean,
                    required: false,
                },
                serves_beer: {
                    type: Boolean,
                    required: false,
                },
                serves_breakfast: {
                    type: Boolean,
                    required: false,
                },
                serves_brunch: {
                    type: Boolean,
                    required: false,
                },
                serves_dinner: {
                    type: Boolean,
                    required: false,
                },
                serves_lunch: {
                    type: Boolean,
                    required: false,
                },
                serves_vegetarian_food: {
                    type: Boolean,
                    required: false,
                },
                serves_wine: {
                    type: Boolean,
                    required: false,
                },
            },
        },
        rating: {
            type: Number,
            required: false,
        },
        rating_count: {
            type: Number,
            required: false,
        },
        price_level: {
            type: Number,
            required: false,
        },
        reservable: {
            type: Boolean,
            required: false,
        },
        opening_hours: {
            type: Object,
            required: false,
        },
        google_maps_url: {
            type: String,
            required: false,
        },
        website: {
            type: String,
            required: false,
        },
        phone_number: {
            type: String,
            required: false,
        },
        summary: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

// Virtuals
placeSchema.virtual('gathering_count', {
    ref: 'Gathering',
    localField: '_id',
    foreignField: 'place',
    count: true,
    match: { $or: [{ event_date: { $exists: true, $gte: new Date() } }, { event_date: { $exists: false } }] },
});

placeSchema.virtual('view_count', {
    ref: 'View',
    localField: '_id',
    foreignField: 'place',
    count: true,
});

// Indexes
placeSchema.index({ google_place_id: 1 }, { unique: true }); // Get places by google_place_id
placeSchema.index({ trending_score: -1 }); // Get places by trending_score

export const PlaceModel = model<IPlace>('Place', placeSchema);
