import { Model, ObjectId } from 'mongoose';
import StatusError from '@utils/StatusError';
import { consoleLogError } from './ConsoleLog';

interface PopulateOptions {
    path: string;
    select?: string;
    populate?: PopulateOptions;
}

/**
 * Fetches a document from the database by its _id field.
 * @param id The id of the document to get.
 * @param model The model to get the document from.
 * @returns The document.
 * @throws StatusError if the document does not exist.
 */
export const fetchDocument = async (id: string | ObjectId, model: Model<any>, populate?: string | PopulateOptions) => {
    const document = await model
        .findById(id)
        .populate(populate as any)
        .catch((err) => {
            consoleLogError('Error fetching document');
            consoleLogError(err);
            throw new StatusError('Something went wrong.', 500);
        });
    if (!document) throw new StatusError(`${model.modelName} does not exist.`, 400);
    return document;
};
