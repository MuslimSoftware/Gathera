import { useEffect, useState } from 'react';
import { useFetch } from '../../../shared/hooks/useFetch';
import { CategorialData } from '../../../shared/components/Pages/PickerPage';

export const useInterests = () => {
    const [interests, setInterests] = useState<CategorialData[]>([]);
    const { isLoading, error, fetchAsync } = useFetch();

    const getAllInterests = async () => {
        await fetchAsync({ url: '/interest' }, (interestsByCategory: any) => {
            // Data is an object with keys as categories and values as arrays of interests
            // Each interest is an object with keys: icon, name
            const allInterests: CategorialData[] = [];
            for (const category in interestsByCategory) {
                const interests = interestsByCategory[category].map((interest: any) => `${interest.icon} ${interest.name}`);
                allInterests.push({ category: category, data: interests });
            }
            setInterests(allInterests);
        });
    };

    useEffect(() => {
        getAllInterests();
    }, []);

    return { isLoading, error, interests };
};
