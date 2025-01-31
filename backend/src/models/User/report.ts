import { model, Schema, Document } from 'mongoose';
import { validateReportDescription } from '@lib/validators/UserValidators';
import { ReportReason } from '@lib/enums/report';

export interface IReport extends Document {
    // Required fields
    user_from: Schema.Types.ObjectId;
    user_reported: Schema.Types.ObjectId;
    reason: ReportReason;

    // Optional fields
    description: string;
}

const ReportSchema = new Schema<IReport>(
    {
        user_from: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        user_reported: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        reason: {
            type: String,
            required: true,
            enum: Object.values(ReportReason),
        },
        description: {
            type: String,
            required: false,
            validate: {
                validator: validateReportDescription,
                message: 'Invalid report description',
            },
        },
    },
    { timestamps: true }
);

// Indexes
ReportSchema.index({ user_reported: 1 });
ReportSchema.index({ user_from: 1, user_reported: 1 }, { unique: true });

export const ReportModel = model<IReport>('Report', ReportSchema);
