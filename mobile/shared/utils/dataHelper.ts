import { decode } from 'base-64';
import { Buffer } from 'buffer';

type FilterFunction<T> = (item: T, query: string, caseSensitive: boolean) => boolean;
export type WithId = {
    _id: string;
};

/**
 * Get a value from an object using a dot-separated field string.
 * (e.g., { _id: 1, place: { name: 'Place Name' } }, 'place.name' => 'Place Name')
 * @param item The object to get the value from.
 * @param field The dot-separated field string to get the value from.
 * @returns The value from the object.
 */
export const getValueFromItem = (item: any, field: string | undefined): any => {
    if (field === undefined) return undefined;

    const fieldNames = field.split('.');
    let value = item;

    for (const fieldName of fieldNames) {
        if (value === undefined || value === null) return undefined;
        value = value[fieldName];
    }

    return value;
};

/**
 * Filters an array of objects by a query string. The query string is matched against the values of the objects' properties.
 * @param array The array to filter.
 * @param filter The query string to filter by.
 * @param filterFields The fields to filter by. If undefined, the filter will be applied to the entire object.
 * @param caseSensitive Whether the filter should be case sensitive.
 * @returns The filtered array.
 */
export const filterArray = <T>(array: T[], filter: string, filterFields?: string | string[], caseSensitive: boolean = false): T[] => {
    if (filter === '' || array.length === 0) return array;

    // If the array is an array of strings, filter by the strings as usual
    if (typeof array[0] === 'string') {
        return array.filter((item) => {
            const itemString = String(item);
            const queryToCompare = caseSensitive ? filter : filter.toLowerCase();
            const itemToCompare = caseSensitive ? itemString : itemString.toLowerCase();

            return itemToCompare.includes(queryToCompare);
        });
    }

    // If the array is an array of objects, filter by the specified fields of the objects
    const filterFieldsArray = Array.isArray(filterFields) ? filterFields : [filterFields];
    const filterFunction: FilterFunction<T> = (item, query, isCaseSensitive) => {
        return filterFieldsArray.some((field) => {
            const value = getValueFromItem(item, field);

            if (value !== undefined && value !== null) {
                const valueString = String(value);
                const queryToCompare = isCaseSensitive ? query : query.toLowerCase();
                const valueToCompare = isCaseSensitive ? valueString : valueString.toLowerCase();

                return valueToCompare.includes(queryToCompare);
            }

            return false;
        });
    };

    return array.filter((item) => filterFunction(item, filter, caseSensitive));
};

/**
 * Filters an array of objects by their _id property, removing any duplicates.
 * @param array
 * @returns unique elements array
 */
export const filterArrayDuplicates = <T extends WithId>(array: T[]): T[] => {
    const seenIds = new Set<string>();
    const uniqueElements: T[] = [];

    for (const element of array) {
        if (!seenIds.has(element._id)) {
            uniqueElements.push(element);
            seenIds.add(element._id);
        }
    }

    return uniqueElements;
};

/**
 * Update an object with new properties. This ensures that any properties that are not updated are not lost.
 * @param oldObject The object to update.
 * @param updatedProperties The new properties to add/update to the object.
 * @returns The updated object.
 */
export const updateObject = (oldObject: any, updatedProperties: any) => {
    return {
        ...oldObject,
        ...updatedProperties,
    };
};

/**
 * Converts a base64 string to a Buffer.
 * @param base64
 * @returns Buffer
 */
export const base64ToBuffer = (base64: string): Buffer => {
    const binaryData = decode(base64);

    return Buffer.from(binaryData, 'binary');
};
