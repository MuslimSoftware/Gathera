/**
 * Resizes the Google image url to the given width and height.
 * @param url The Google image url (e.g., https://lh5.googleusercontent.com/p/AF1QipMnGv2qewVIxkonrrXI1fCRkKVaO9QTNDKrEwXb=w1920-h1080)
 * @param width The width of the image to resize to
 * @param height The height of the image to resize to
 * @returns The resized image url
 */
export const getResizedImageUrl = (url: string, width: number, height: number) => {
    const baseUrl = url ? url.split('=') : ['undefined'];
    const resizedUrl = `${baseUrl[0]}=w${width}-h${height}`;
    return resizedUrl;
};
