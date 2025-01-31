export enum PlaceType {
    FOOD = 'food',
    ACTIVITY = 'activity',
    SPORT = 'sport',
    NIGHTLIFE = 'nightlife',
}

export enum PlaceSubType {
    // FOOD SUBTYPES
    CAFE = 'cafe',
    PIZZA = 'pizza',
    ASIAN = 'asian',
    STEAK = 'steak',
    ITALIAN = 'italian',
    MEXICAN = 'mexican',
    INDIAN = 'indian',
    FRENCH = 'french',
    AMERICAN = 'american',
    MIDDLE_EASTERN = 'middle_eastern',

    // ACTIVITY SUBTYPES
    ESCAPE_ROOM = 'escape_room',
    KARTING = 'karting',
    GAMING = 'gaming',
    PAINTBALL = 'paintball',
    TRAMPOLINE = 'trampoline',
    BOWLING = 'bowling',
    ARCADE = 'arcade',
    CINEMA = 'cinema',

    // SPORT SUBTYPES
    SOCCER = 'soccer',
    HOCKEY = 'hockey',
    BASKETBALL = 'basketball',
    TENNIS = 'tennis',
    VOLLEYBALL = 'volleyball',
    SKATEBOARDING = 'skateboarding',
    GOLF = 'golf',
    SKI = 'ski',

    // NIGHTLIFE SUBTYPES
    KARAOKE = 'karaoke',
    COMEDY = 'comedy',
    BAR = 'bar',
    CLUB = 'club',
    HOOKAH = 'hookah',
}

export interface FoodServices {
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
}
