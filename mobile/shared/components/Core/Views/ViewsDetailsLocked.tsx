import { StyleSheet, View } from 'react-native';
import React from 'react';
import { HeaderPageLayout } from '../../../layouts/HeaderPageLayout';
import { Colours, Sizes } from '../../../styles/Styles';
import { PROFILE_PIC_SIZES } from '../../MainPictures/ProfilePicture';
import { LockedOverlay } from '../Subscription/LockedOverlay';

interface ViewsDetailsLockedProps {
    title: string;
    viewCount: number;
}

export const ViewsDetailsLocked = ({ title, viewCount }: ViewsDetailsLockedProps) => {
    return (
        <HeaderPageLayout title={title}>
            <View style={styles.globalWrapper}>
                <View style={styles.dummyWrapper}>
                    {Array.from({ length: viewCount || 10 }, (_, i) => (
                        <UserListItemDummy key={i} />
                    ))}
                </View>
                <LockedOverlay />
            </View>
        </HeaderPageLayout>
    );
};

const UserListItemDummy = () => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
                style={{ ...PROFILE_PIC_SIZES['medium'], borderRadius: Sizes.BORDER_RADIUS_FULL, marginVertical: 5, backgroundColor: Colours.GRAY }}
            />
            <View style={{ height: 15, width: '50%', backgroundColor: Colours.GRAY, borderRadius: Sizes.BORDER_RADIUS_FULL }} />
        </View>
    );
};

const styles = StyleSheet.create({
    globalWrapper: { width: '100%', height: '100%' },
    dummyWrapper: { paddingLeft: 15, paddingVertical: 10 },
});
