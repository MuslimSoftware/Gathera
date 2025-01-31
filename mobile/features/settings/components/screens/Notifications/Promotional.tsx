import { ScrollView } from 'react-native';
import React from 'react';
import { HeaderPageLayout } from '../../../../../shared/layouts/HeaderPageLayout';
import { BooleanSwitchRow } from '../../BooleanSwitchRow';

export const Promotional = () => {
    const [isEmailsEnabled, setIsEmailsEnabled] = React.useState(true);
    const [isTextsEnabled, setIsTextsEnabled] = React.useState(true);
    const [isMarketingEnabled, setIsMarketingEnabled] = React.useState(true);

    return (
        <HeaderPageLayout title='Promotional' hasTopMargin>
            <ScrollView>
                <BooleanSwitchRow label='Emails' value={isEmailsEnabled} onChange={setIsEmailsEnabled} />
                <BooleanSwitchRow label='Texts' value={isTextsEnabled} onChange={setIsTextsEnabled} />
                <BooleanSwitchRow label='Marketing' value={isMarketingEnabled} onChange={setIsMarketingEnabled} />
            </ScrollView>
        </HeaderPageLayout>
    );
};
