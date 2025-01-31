import { ScrollView } from 'react-native';
import React from 'react';
import { HeaderPageLayout } from '../../../../../shared/layouts/HeaderPageLayout';
import { BooleanSwitchRow } from '../../BooleanSwitchRow';

export const Messages = () => {
    const [isGatheringMessagesEnabled, setIsGatheringMessagesEnabled] = React.useState(true);
    const [isGroupMessagesEnabled, setIsGroupMessagesEnabled] = React.useState(true);
    const [isPersonalMessagesEnabled, setIsPersonalMessagesEnabled] = React.useState(true);

    return (
        <HeaderPageLayout title='Messages' hasTopMargin>
            <ScrollView>
                <BooleanSwitchRow label='Gatherings' value={isGatheringMessagesEnabled} onChange={setIsGatheringMessagesEnabled} />
                <BooleanSwitchRow label='Group Chats' value={isGroupMessagesEnabled} onChange={setIsGroupMessagesEnabled} />
                <BooleanSwitchRow label='Personal' value={isPersonalMessagesEnabled} onChange={setIsPersonalMessagesEnabled} />
            </ScrollView>
        </HeaderPageLayout>
    );
};
