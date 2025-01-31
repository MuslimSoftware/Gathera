import { ViewsDetails } from '../../../shared/components/Core/Views/ViewsDetails';
import { getAuthContextValues } from '../../../shared/context/AuthContext';
import { ViewsDetailsLocked } from '../../../shared/components/Core/Views/ViewsDetailsLocked';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { useGatheringViewsDetails } from '../hooks/useGatheringViewsDetails';
import { SubscriptionType } from '../../../gathera-lib/enums/user';

export const GatheringViewsDetailsContainer = ({ route }: any) => {
    const {
        user: { subscription },
    } = getAuthContextValues();
    if (!subscription || subscription === SubscriptionType.FREE)
        return <ViewsDetailsLocked viewCount={route.params.viewCount} title='Gathering Views' />;

    const { gatheringId } = route.params;
    const { error, isLoading, loadMore, refresh, data } = useGatheringViewsDetails(gatheringId);

    return (
        <HeaderPageLayout title='Gathering Views'>
            <ViewsDetails error={error} views={data} isLoading={isLoading} loadMore={loadMore} refresh={refresh} />
        </HeaderPageLayout>
    );
};
