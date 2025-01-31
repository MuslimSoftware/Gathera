import { FireBorder } from '../components/borders/FireBorder';
import { HeartsBorder } from '../components/borders/HeartsBorder';
import { SnowBorder } from '../components/borders/SnowBorder';
import { SpiderBorder } from '../components/borders/SpiderBorder';
import { SubscriptionType, UserBorder } from './../../gathera-lib/enums/user';

export const BORDER_MAP = new Map<UserBorder, React.FC>([
    [UserBorder.FIRE, FireBorder],
    [UserBorder.SPIDER, SpiderBorder],
    [UserBorder.HEARTS, HeartsBorder],
    [UserBorder.SNOW, SnowBorder],
]);

export const BORDER_LIST = Array.from(BORDER_MAP.keys());

export const SUBSCRIPTION_TO_VALUE = new Map<SubscriptionType, number>([
    [SubscriptionType.PREMIUM_LIFETIME, 2],
    [SubscriptionType.PREMIUM, 1],
    [SubscriptionType.FREE, 0],
]);

/**
 * Sorts an array of users by their subscription type then by border.
 * Users must have a subscription and border property.
 * @param users The array of users to sort
 * @returns The sorted array DESC
 */
export const sortArrayBySubscription = (users: any[]) => {
    return users.sort((a, b) => {
        const aVal = SUBSCRIPTION_TO_VALUE.get(a.subscription) ?? 0;
        const bVal = SUBSCRIPTION_TO_VALUE.get(b.subscription) ?? 0;

        const diff = bVal - aVal;

        if (diff !== 0) return diff;

        if (a.border && !b.border) return -1;
        if (!a.border && b.border) return 1;
        return -1; // happens when both users have the same subscription and both have a border
    });
};

export const getBorder = (border: UserBorder | string) => {
    return BORDER_MAP.get(border as UserBorder);
};
