import { ViewsDetails } from '../../../shared/components/Core/Views/ViewsDetails';
import { getAuthContextValues } from '../../../shared/context/AuthContext';
import { ViewsDetailsLocked } from '../../../shared/components/Core/Views/ViewsDetailsLocked';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { usePlaceViewsDetails } from '../hooks/usePlaceViewsDetails';
import { SubscriptionType } from '../../../gathera-lib/enums/user';

export const PlaceViewsDetailsContainer = ({ route }: any) => {
    const {
        user: { subscription },
    } = getAuthContextValues();
    const { placeId, viewCount } = route.params;

    if (!subscription || subscription === SubscriptionType.FREE) return <ViewsDetailsLocked viewCount={viewCount} title='Place Views' />;

    const { error, isLoading, loadMore, refresh, data } = usePlaceViewsDetails(placeId);

    return (
        <HeaderPageLayout title='Place Views'>
            <ViewsDetails error={error} views={data} isLoading={isLoading} loadMore={loadMore} refresh={refresh} />
        </HeaderPageLayout>
    );
};
