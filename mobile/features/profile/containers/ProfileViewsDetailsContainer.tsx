import { ViewsDetails } from '../../../shared/components/Core/Views/ViewsDetails';
import { useProfileViewsDetails } from '../hooks/useProfileViewsDetails';
import { getAuthContextValues } from '../../../shared/context/AuthContext';
import { SubscriptionType } from '../../../gathera-lib/enums/user';
import { ViewsDetailsLocked } from '../../../shared/components/Core/Views/ViewsDetailsLocked';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';

export const ProfileViewsDetailsContainer = ({ route }: any) => {
    const {
        user: { subscription },
    } = getAuthContextValues();
    if (!subscription || subscription === SubscriptionType.FREE)
        return <ViewsDetailsLocked viewCount={route.params.viewCount} title='Profile Views' />;

    const { profileId } = route.params;
    const { profileViews, profileViewsLoading, profileViewsError, fetchMoreProfileViews, refreshProfileViews } = useProfileViewsDetails(profileId);

    return (
        <HeaderPageLayout title='Profile Views'>
            <ViewsDetails
                views={profileViews}
                error={profileViewsError}
                isLoading={profileViewsLoading}
                loadMore={fetchMoreProfileViews}
                refresh={refreshProfileViews}
            />
        </HeaderPageLayout>
    );
};
