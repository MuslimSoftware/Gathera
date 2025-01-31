import { StyleSheet, View } from 'react-native';
import React from 'react';
import { SubscriptionLayout } from '../containers/SubscriptionLayout';
import { SubHeroSection } from './SubHeroSection';
import { SubBorderFeature } from './subFeatures/SubBorderFeature';
import { SubCTA } from './SubCTA';
import { SubDiscoverFeature } from './subFeatures/SubDiscoverFeature';
import { SubGatheringFeature } from './subFeatures/SubGatheringFeature';
import { SubPriorityFeature } from './subFeatures/SubPriorityFeature';
import { UserBorder } from '../../../gathera-lib/enums/user';
import { SubViewsFeature } from './subFeatures/SubViewsFeature';

interface SubscriptionLandingProps {
    border: UserBorder;
}

export const SubscriptionLanding = ({ border }: SubscriptionLandingProps) => {
    return (
        <SubscriptionLayout>
            <SubHeroSection />
            <View style={styles.wrapper}>
                <SubBorderFeature border={border} />
                <SubViewsFeature />
                <SubDiscoverFeature border={border} />
                <SubPriorityFeature border={border} />
                <SubGatheringFeature border={border} />
            </View>
            <SubCTA />
        </SubscriptionLayout>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 20,
        gap: 40,
    },
});
