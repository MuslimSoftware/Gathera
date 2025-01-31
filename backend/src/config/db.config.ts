import mongoose from 'mongoose';
import { ConnectionOptions } from 'tls';
import { consoleLogSuccess, consoleLogError } from '@utils/ConsoleLog';
import { MONGODB_URI } from '@config/env.config';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4,
        } as ConnectionOptions);
        consoleLogSuccess('Database is connected!');
    } catch (error: any) {
        consoleLogError(`There was an error connecting to the database: ${error.message}`);
    }
};
