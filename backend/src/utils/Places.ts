import { IPlace } from '@/models/Place/place';
import { PlacePhotoModel } from '@/models/Place/placePhoto';

export const PLACES_DISPLAY_FIELDS = '_id name location type subtype default_photo rating rating_count price_level google_place_id gathering_count';

/**
 * Adds the photos field to the place passed to it
 * @param place
 * @returns
 */
export const addPhotosToPlace = async (place: IPlace) => {
    let photos = await PlacePhotoModel.find({ google_place_id: place.google_place_id }).select('url').skip(1).limit(3);
    photos = photos.map((photo: any) => photo.url);

    if (photos.length === 0) {
        photos = [];
    }

    const placeObj = place.toObject ? place.toObject() : place;
    return {
        ...placeObj,
        photos,
    };
};

/**
 * Adds the photos field to the places passed to it
 * @param places
 * @returns Places with photos
 */
export const addPhotosToPlaces = async (places: IPlace[]) => {
    return await Promise.all(places.map(async (place: any) => addPhotosToPlace(place)));
};
