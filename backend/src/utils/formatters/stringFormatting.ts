/**
 * Sanitizes user input to only keep alphanumeric characters and spaces.
 * Use this to sanitize user inputs before making a database query.
 *
 * @param userInput The user input to sanitize
 * @returns The sanitized user input
 */
export const sanitizeUserInput = (userInput: string) => {
    return userInput.replace(/[^a-zA-Z0-9 ]/g, ''); // only keep alphanumeric characters and spaces
};

/**
 * Ellipsizes text if it is longer than the maxLength
 * @param text
 * @param maxLength
 * @returns Ellipsized text
 */
export const ellipsizeText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};
