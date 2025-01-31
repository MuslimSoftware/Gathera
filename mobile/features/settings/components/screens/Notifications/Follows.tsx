import React from 'react';
import { HeaderPageLayout } from '../../../../../shared/layouts/HeaderPageLayout';
import { BooleanSwitchRow } from '../../BooleanSwitchRow';
import { ScrollView } from 'react-native-gesture-handler';

export const Follows = () => {
    const [isFollowsEnabled, setIsFollowsEnabled] = React.useState(true);
    const [isFollowRequestsEnabled, setIsFollowRequestsEnabled] = React.useState(true);

    return (
        <HeaderPageLayout title='Follows' hasTopMargin>
            <ScrollView>
                <BooleanSwitchRow label='Follows' value={isFollowsEnabled} onChange={setIsFollowsEnabled} />
                <BooleanSwitchRow label='Follow Requests' value={isFollowRequestsEnabled} onChange={setIsFollowRequestsEnabled} />
            </ScrollView>
        </HeaderPageLayout>
    );
};
