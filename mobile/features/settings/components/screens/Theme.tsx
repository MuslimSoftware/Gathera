import React from 'react';
import { HeaderPageLayout } from '../../../../shared/layouts/HeaderPageLayout';
import { BooleanSwitchRow } from '../BooleanSwitchRow';

export const Theme = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    return (
        <HeaderPageLayout title='Theme' hasTopMargin>
            <BooleanSwitchRow label='Dark Mode' value={isDarkMode} onChange={setIsDarkMode} />
        </HeaderPageLayout>
    );
};
