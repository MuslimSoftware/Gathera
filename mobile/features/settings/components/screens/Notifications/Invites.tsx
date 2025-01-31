import { ScrollView } from 'react-native';
import React from 'react';
import { HeaderPageLayout } from '../../../../../shared/layouts/HeaderPageLayout';
import { BooleanSwitchRow } from '../../BooleanSwitchRow';

export const Invites = () => {
    const [isGatheringInvitesEnabled, setIsGatheringInvitesEnabled] = React.useState(true);

    return (
        <HeaderPageLayout title='Invites' hasTopMargin>
            <ScrollView>
                <BooleanSwitchRow label='Gatherings' value={isGatheringInvitesEnabled} onChange={setIsGatheringInvitesEnabled} />
            </ScrollView>
        </HeaderPageLayout>
    );
};
