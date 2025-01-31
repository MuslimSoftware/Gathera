import { StyleSheet, View } from 'react-native';
import React from 'react';
import { SectionTitle } from '../../map/components/PlaceBottomSheet/SectionTitle';
import { TextButton } from '../../../shared/components/Buttons/TextButton';

interface DiscoverPageSection {
    title: string;
    icon?: any;
    children: React.ReactNode;
    viewAllHandler: () => void;
    disableContentPadding?: boolean;
}

const DiscoverPageSection = ({ icon, title, children, viewAllHandler, disableContentPadding = false }: DiscoverPageSection) => {
    return (
        <View style={styles.trendingSection}>
            <View style={styles.headerWrapper}>
                <SectionTitle icon={icon} title={title} expand={false} />
                <TextButton label='See All' onPress={viewAllHandler} />
            </View>
            <View style={[styles.trendingContent, !disableContentPadding && { paddingHorizontal: 10 }]}>{children}</View>
        </View>
    );
};

export default DiscoverPageSection;

const styles = StyleSheet.create({
    trendingSection: {
        alignItems: 'center',
        gap: 10,
    },
    headerWrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    trendingContent: {
        width: '100%',
        flexDirection: 'column',
        gap: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
