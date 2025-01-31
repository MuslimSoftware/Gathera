import { ScrollView } from 'react-native';
import React from 'react';
import { HeaderPageLayout } from '../../../../../shared/layouts/HeaderPageLayout';
import { BooleanSwitchRow } from '../../BooleanSwitchRow';

export const Gatherings = () => {
    const [isNewMembersEnabled, setIsNewMembersEnabled] = React.useState(true);

    return (
        <HeaderPageLayout title='Gatherings' hasTopMargin>
            <ScrollView>
                <BooleanSwitchRow label='New Members' value={isNewMembersEnabled} onChange={setIsNewMembersEnabled} />
            </ScrollView>
        </HeaderPageLayout>
    );
};
