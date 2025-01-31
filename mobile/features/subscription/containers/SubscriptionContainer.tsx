import React from 'react';
import { SubscriptionLanding } from '../components/SubscriptionLanding';
import { UserBorder } from '../../../gathera-lib/enums/user';

export const SubscriptionContainer = ({ route }: any) => {
    const border = route?.params?.border || UserBorder.FIRE;
    return <SubscriptionLanding border={border} />;
};
