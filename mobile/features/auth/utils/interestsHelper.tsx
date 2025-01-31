import { Interest } from '../../../types/Interest';

export const addInterestIcons = (interests: Array<{ name: string }>): Array<string> => {
    const interestsWithIcons: Array<string> = [];

    interests.forEach((interest: { name: string }) => {
        const interestWithIcon: string = getInterestIcon(interest.name) + ' ' + interest.name;

        interestsWithIcons.push(interestWithIcon);
    });

    return interestsWithIcons;
};

export const getInterestData = (interest: string): Interest | undefined => {
    let interestData: Interest | undefined;

    InterestsMap.forEach((interests: { name: string; icon: string }[], category: string) => {
        const interestObj = interests.find((interestObj: { name: string; icon: string }) => interestObj.name === interest);

        if (interestObj) {
            interestData = { name: interestObj.name, icon: interestObj.icon, category };
        }
    });

    return interestData;
};

const getInterestIcon = (interest: string): string => {
    let interestIcon: string = '';

    InterestsMap.forEach((interests: { name: string; icon: string }[], category: string) => {
        const interestObj = interests.find((interestObj: { name: string; icon: string }) => interestObj.name === interest);

        if (interestObj) {
            interestIcon = interestObj.icon;
        }
    });

    return interestIcon;
};

/**
 * Map of interests to their corresponding icon and name.
 * @type {Map<String, { name: string; icon: string }[]>}
 */
const InterestsMap = new Map<
    string,
    {
        name: string;
        icon: string;
    }[]
>([
    [
        'Sports',
        [
            { name: 'E-Sports', icon: '🎮' },
            { name: 'Soccer', icon: '⚽' },
            { name: 'Running', icon: '👟' },
            { name: 'Hiking', icon: '🥾' },
            { name: 'Yoga', icon: '🧘‍♀️' },
            { name: 'Swimming', icon: '🏊‍♀️' },
            { name: 'Cycling', icon: '🚴‍♀️' },
            { name: 'Basketball', icon: '🏀' },
            { name: 'Tennis', icon: '🎾' },
            { name: 'Golf', icon: '⛳' },
            { name: 'Baseball', icon: '⚾' },
            { name: 'Football', icon: '🏈' },
            { name: 'Volleyball', icon: '🏐' },
            { name: 'Cricket', icon: '🏏' },
            { name: 'Rugby', icon: '🏉' },
            { name: 'Hockey', icon: '🏒' },
            { name: 'Skating', icon: '⛸️' },
            { name: 'Skiing', icon: '⛷️' },
            { name: 'Snowboarding', icon: '🏂' },
            { name: 'Surfing', icon: '🏄‍♀️' },
            { name: 'Skateboarding', icon: '🛹' },
            { name: 'Bowling', icon: '🎳' },
            { name: 'Dancing', icon: '💃' },
            { name: 'Martial Arts', icon: '🥋' },
            { name: 'Boxing', icon: '🥊' },
            { name: 'Wrestling', icon: '🤼‍♀️' },
            { name: 'Gymnastics', icon: '🤸‍♀️' },
            { name: 'Weightlifting', icon: '🏋️‍♀️' },
            { name: 'Fishing', icon: '🎣' },
            { name: 'Hunting', icon: '🏹' },
            { name: 'Camping', icon: '🏕️' },
            { name: 'Boating', icon: '⛵' },
            { name: 'Kayaking', icon: '🚣‍♀️' },
            { name: 'Canoeing', icon: '🛶' },
            { name: 'Sailing', icon: '⛵' },
            { name: 'Rock Climbing', icon: '🧗‍♀️' },
            { name: 'Archery', icon: '🏹' },
        ],
    ],
    [
        'Film & TV',
        [
            { name: 'Anime', icon: '🎬' },
            { name: 'Comedy', icon: '🎬' },
            { name: 'Romance', icon: '🎬' },
            { name: 'Action', icon: '🎬' },
            { name: 'Documentary', icon: '🎬' },
            { name: 'Drama', icon: '🎬' },
            { name: 'Horror', icon: '🎬' },
            { name: 'Thriller', icon: '🎬' },
            { name: 'Adventure', icon: '🎬' },
            { name: 'Fantasy', icon: '🎬' },
            { name: 'Sci-Fi', icon: '🎬' },
            { name: 'Mystery', icon: '🎬' },
            { name: 'Crime', icon: '🎬' },
        ],
    ],
    [
        'Reading',
        [
            { name: 'Fiction', icon: '📚' },
            { name: 'Non-Fiction', icon: '📚' },
            { name: 'Manga', icon: '📚' },
            { name: 'Books', icon: '📚' },
            { name: 'History', icon: '📚' },
            { name: 'Poetry', icon: '📚' },
            { name: 'Fantasy', icon: '📚' },
            { name: 'Sci-Fi', icon: '📚' },
            { name: 'Mystery', icon: '📚' },
            { name: 'Crime', icon: '📚' },
            { name: 'Biography', icon: '📚' },
            { name: 'Romance', icon: '📚' },
        ],
    ],
    [
        'Self Care',
        [
            { name: 'Meditation', icon: '🧘' },
            { name: 'Yoga', icon: '🧘‍♀️' },
            { name: 'Journaling', icon: '📝' },
            { name: 'Reading', icon: '📚' },
            { name: 'Walking', icon: '🚶‍♀️' },
            { name: 'Therapy', icon: '💆' },
            { name: 'Skincare', icon: '🧖🏻‍♀️' },
            { name: 'Makeup', icon: '💄' },
            { name: 'Haircare', icon: '💇‍♀️' },
            { name: 'Nails', icon: '💅' },
            { name: 'Exercise', icon: '🏋️‍♀️' },
        ],
    ],
    [
        'Hobbies',
        [
            { name: 'Gaming', icon: '🎮' },
            { name: 'Painting', icon: '🎨' },
            { name: 'Fashion', icon: '👔' },
            { name: 'Photography', icon: '📷' },
            { name: 'Cars', icon: '🚗' },
            { name: 'Meditation', icon: '🧘‍♀️' },
            { name: 'Politics', icon: '⚖️' },
            { name: 'Cooking', icon: '🍳' },
            { name: 'Baking', icon: '🧁' },
            { name: 'Gardening', icon: '🌱' },
            { name: 'DIY', icon: '🔨' },
            { name: 'Fishing', icon: '🎣' },
        ],
    ],
    [
        'Music',
        [
            { name: 'Pop', icon: '🎵' },
            { name: 'Rock', icon: '🎵' },
            { name: 'Hip-Hop', icon: '🎵' },
            { name: 'Rap', icon: '🎵' },
            { name: 'Metal', icon: '🎵' },
            { name: 'Country', icon: '🎵' },
            { name: 'Jazz', icon: '🎵' },
            { name: 'Classical', icon: '🎵' },
            { name: 'Electronic', icon: '🎵' },
            { name: 'R&B', icon: '🎵' },
            { name: 'Reggae', icon: '🎵' },
            { name: 'Folk', icon: '🎵' },
            { name: 'Punk', icon: '🎵' },
            { name: 'Alternative', icon: '🎵' },
        ],
    ],
    [
        'Food',
        [
            { name: 'American', icon: '🍔' },
            { name: 'Italian', icon: '🍝' },
            { name: 'Mexican', icon: '🌮' },
            { name: 'Chinese', icon: '🍜' },
            { name: 'Japanese', icon: '🍣' },
            { name: 'Korean', icon: '🍱' },
            { name: 'Thai', icon: '🍲' },
            { name: 'Indian', icon: '🍛' },
            { name: 'Greek', icon: '🥗' },
            { name: 'French', icon: '🥐' },
            { name: 'Spanish', icon: '🥘' },
            { name: 'Middle Eastern', icon: '🥙' },
            { name: 'African', icon: '🍛' },
            { name: 'Vegan', icon: '🥗' },
            { name: 'Vegetarian', icon: '🥗' },
            { name: 'Keto', icon: '🥗' },
            { name: 'Halal', icon: 'حلال' },
        ],
    ],
]);
