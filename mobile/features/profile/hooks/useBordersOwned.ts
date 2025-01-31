import { useEffect, useState } from 'react';
import { useFetch } from '../../../shared/hooks/useFetch';
import { UserBorder } from '../../../gathera-lib/enums/user';

export const useBordersOwned = (userId: string) => {
    const [bordersOwned, setBordersOwned] = useState<UserBorder[]>([]);
    const { error, isLoading, fetchAsync } = useFetch();

    const getBordersOwned = async () => {
        await fetchAsync({ url: `/user/borders/${userId}` }, (data: UserBorder[]) => setBordersOwned(data));
    };

    useEffect(() => {
        getBordersOwned();
    }, [userId]);

    return { bordersOwned, setBordersOwned, error, isLoading, getBordersOwned };
};
