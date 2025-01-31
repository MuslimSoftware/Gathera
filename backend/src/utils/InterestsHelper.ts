import { IInterest, InterestModel } from '@/models/User/interest';
import { UserInterestModel } from '@/models/User/userInterest';

/**
 * Retrieves user's interests in string format
 * @param user_id
 * @returns List of user's interests ['interest1', 'interest2']
 */
export const getUserInterestsAsync = async (user_id: string): Promise<String[]> => {
    const documents = await UserInterestModel.find({ user: user_id })
        .populate<{ interest: IInterest }>({ path: 'interest' })
        .select('-_id -__v -user')
        .lean();
    const interests = documents.map((userInterest) => `${userInterest.interest.icon} ${userInterest.interest.name}`);

    return interests;
};

/**
 * Retrieves interest document ids to facilitate adding and removing interests
 * @param interests
 * @returns {Promise<ObjectId[]>} of interest document ids
 */
export const getInterestDocumentIds = async (interests: String[]) => {
    const documentIds = [];

    if (interests.length > 0) {
        for (const interest of interests) {
            const [icon, name] = interest.split(' ');
            const document = await InterestModel.findOne({ icon, name }).lean();
            if (document) {
                documentIds.push(document._id);
            }
        }
    }

    return documentIds;
};
