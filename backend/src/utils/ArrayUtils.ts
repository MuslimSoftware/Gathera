import { validateObjectId } from '@utils/validators/Validators';

/**
 * Toggles an element from an array. If the element is not in the array, it is added. If it is in the array, it is removed.
 * @param arr the array to toggle from
 * @param element the element to toggle
 * @returns the array with the element toggled
 */
export const toggleFromArray = (arr: Array<any>, element: any) => {
    const index = arr.findIndex((e) => e == element);

    if (index !== -1) {
        arr.splice(index, 1);
    } else {
        arr.push(element);
    }

    return arr;
};

/**
 * Converts a list of documents to a list of ids.
 * @param documents
 * @returns String[] | ObjectId[]
 */
export const convertDocumentsToIds = (documents: any[]) => {
    return documents.map((doc) => doc._id || doc);
};

/**
 * Validates an array of object ids.
 * @param objectIds
 * @returns True if all ids are ObjectIds, false otherwise
 */
export const validateObjectIds = (objectIds: string[]) => {
    if (!Array.isArray(objectIds)) return false;
    if (!objectIds.every((item) => validateObjectId(item))) return false;

    return true;
};
