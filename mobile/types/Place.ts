import { PlaceSubType, PlaceType } from '../gathera-lib/enums/place';

export type FoodServices = {
    delivery?: boolean;
    takeout?: boolean;
    dine_in?: boolean;
    serves_beer?: boolean;
    serves_breakfast?: boolean;
    serves_brunch?: boolean;
    serves_dinner?: boolean;
    serves_lunch?: boolean;
    serves_vegetarian_food?: boolean;
    serves_wine?: boolean;
};

export interface IPlace {
    _id: string;

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
    photos?: string[];
    gathering_count?: number;
    view_count?: number;
    isInterested?: boolean;
}

export class Filter<T = any> {
    label: T;
    subFilters: Filter<any>[];
    isSelected: boolean;

    constructor(label: T, subFilters: Filter<any>[] = []) {
        this.label = label;
        this.subFilters = subFilters;
        this.isSelected = false;
    }

    select(): void {
        this.isSelected = true;
    }

    deselect(): void {
        // Deselect filters recursively
        this.subFilters.forEach((filter) => filter.deselect());
        this.isSelected = false;
    }

    isLeaf(): boolean {
        return !this.subFilters || this.subFilters.length === 0;
    }
}

export class PlaceFilter extends Filter<PlaceType | PlaceSubType> {
    constructor(label: PlaceType | PlaceSubType, subFilters: Filter<any>[] = []) {
        super(label, subFilters);
    }
}

export const PLACE_FILTERS: Filter<PlaceType>[] = [
    new Filter<PlaceType>(PlaceType.FOOD, [
        new Filter<PlaceSubType>(PlaceSubType.CAFE),
        new Filter<PlaceSubType>(PlaceSubType.PIZZA),
        new Filter<PlaceSubType>(PlaceSubType.ASIAN),
        new Filter<PlaceSubType>(PlaceSubType.STEAK),
        new Filter<PlaceSubType>(PlaceSubType.ITALIAN),
        new Filter<PlaceSubType>(PlaceSubType.MEXICAN),
        new Filter<PlaceSubType>(PlaceSubType.INDIAN),
        new Filter<PlaceSubType>(PlaceSubType.FRENCH),
        new Filter<PlaceSubType>(PlaceSubType.AMERICAN),
        new Filter<PlaceSubType>(PlaceSubType.MIDDLE_EASTERN),
    ]),
    new Filter<PlaceType>(PlaceType.ACTIVITY, [
        new Filter<PlaceSubType>(PlaceSubType.CINEMA),
        new Filter<PlaceSubType>(PlaceSubType.BOWLING),
        new Filter<PlaceSubType>(PlaceSubType.ESCAPE_ROOM),
        new Filter<PlaceSubType>(PlaceSubType.KARTING),
        new Filter<PlaceSubType>(PlaceSubType.PAINTBALL),
        new Filter<PlaceSubType>(PlaceSubType.ARCADE),
        new Filter<PlaceSubType>(PlaceSubType.GAMING),
        new Filter<PlaceSubType>(PlaceSubType.TRAMPOLINE),
    ]),
    new Filter<PlaceType>(PlaceType.SPORT, [
        new Filter<PlaceSubType>(PlaceSubType.BASKETBALL),
        new Filter<PlaceSubType>(PlaceSubType.SOCCER),
        new Filter<PlaceSubType>(PlaceSubType.TENNIS),
        new Filter<PlaceSubType>(PlaceSubType.HOCKEY),
        new Filter<PlaceSubType>(PlaceSubType.VOLLEYBALL),
        new Filter<PlaceSubType>(PlaceSubType.SKATEBOARDING),
        new Filter<PlaceSubType>(PlaceSubType.GOLF),
        new Filter<PlaceSubType>(PlaceSubType.SKI),
    ]),
    new Filter<PlaceType>(PlaceType.NIGHTLIFE, [
        new Filter<PlaceSubType>(PlaceSubType.BAR),
        new Filter<PlaceSubType>(PlaceSubType.CLUB),
        new Filter<PlaceSubType>(PlaceSubType.KARAOKE),
        new Filter<PlaceSubType>(PlaceSubType.HOOKAH),
        new Filter<PlaceSubType>(PlaceSubType.COMEDY),
    ]),
];
