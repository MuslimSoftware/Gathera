import { model, Schema, Document } from 'mongoose';
import { ViewType } from '@lib/enums/user';
import { SEVEN_DAYS_MS } from '@utils/validators/Validators';

export interface IView extends Document {
    // Required fields
    user: Schema.Types.ObjectId;
    view_type: ViewType;

    // Optional fields (only one of them)
    profile: Schema.Types.ObjectId;
    gathering: Schema.Types.ObjectId;
    place: Schema.Types.ObjectId;
}

const ViewSchema = new Schema<IView>(
    {
        // Required fields
        user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        view_type: { type: String, required: true, enum: Object.values(ViewType) },

        // Optional fields
        profile: { type: Schema.Types.ObjectId, required: false, ref: 'User' },
        gathering: { type: Schema.Types.ObjectId, required: false, ref: 'Gathering' },
        place: { type: Schema.Types.ObjectId, required: false, ref: 'Place' },
    },
    { timestamps: true }
);

// Indexes
ViewSchema.index({ profile: 1 }); // For querying all views of a specific profile
ViewSchema.index({ gathering: 1 }); // For querying all views of a specific gathering
ViewSchema.index({ place: 1 }); // For querying all views of a specific place
ViewSchema.index({ user: 1, view_type: 1, profile: 1 }); // For querying a specific profile view
ViewSchema.index({ user: 1, view_type: 1, gathering: 1 }); // For querying a specific gathering view
ViewSchema.index({ user: 1, view_type: 1, place: 1 }); // For querying a specific place view
ViewSchema.index({ updatedAt: 1 }, { expireAfterSeconds: SEVEN_DAYS_MS / 1000 }); // For expiring views after 7 days (in seconds) of inactivity

export const ViewModel = model<IView>('View', ViewSchema);
