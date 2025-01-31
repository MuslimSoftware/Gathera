import { InterestModel } from '@/models/User/interest';
import { Request, Response } from 'express';

/**
 * Gets all interests from the database grouped by category.
 * @route /interest
 * @method GET
 * @requireAuth false
 * @return interests by category: { category: [{ icon: string, name: string }] }
 */
export const getInterests = async (_req: Request, res: Response) => {
    const interests = await InterestModel.find().select('-__v -_id').lean();
    const interestsByCategory: any = {};
    for (const interest of interests) {
        const category = interest.category;
        const data = { icon: interest.icon, name: interest.name };

        if (!interestsByCategory[category]) {
            interestsByCategory[category] = [data];
        } else {
            interestsByCategory[category].push(data);
        }
    }

    return res.status(200).json(interestsByCategory);
};
