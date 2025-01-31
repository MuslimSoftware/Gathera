import { StyleSheet, ScrollView, View } from 'react-native';
import React from 'react';
import { ProfileInterests } from './ProfileInterests';
import ProfileAboutMe from './ProfileAboutMe';
import ProfileBasics from './ProfileBasics';
import { Colours, Sizes } from '../../../../shared/styles/Styles';
import { LoadingSkeleton } from '../../../../shared/components/Core/LoadingSkeleton';
import { Detail } from '../../../../gathera-lib/enums/user';
import { getNavigationBarBottomPadding } from '../../../../shared/utils/uiHelper';
import { getAuthContextValues } from '../../../../shared/context/AuthContext';

interface ProfileAboutTabProps {
    profile: any;
}

const BASICS = new Set([Detail.WORK, Detail.EDUCATION, 'gender', 'age']);
const ABOUT_ME = new Set(Object.values(Detail).filter((detail) => !BASICS.has(detail)));

const ProfileAboutTab = ({ profile }: ProfileAboutTabProps) => {
    const {
        user: { _id: authUserId },
    } = getAuthContextValues();
    const basics: any = [];
    const aboutMe: any = [];

    // Split the details into basics and about me
    Object.keys(profile.details).forEach((key: any) => {
        const detail = { detail: key, value: profile.details[key] };
        if (!detail.value) return; // Skip if the value is empty
        if (Array.isArray(detail.value) && detail.value.length === 0) return; // Skip if the value is an empty array

        BASICS.has(key) && basics.push(detail);
        ABOUT_ME.has(key) && aboutMe.push(detail);
    });

    return (
        <ScrollView style={styles.container} contentContainerStyle={[styles.wrapper, { paddingBottom: getNavigationBarBottomPadding() }]}>
            <ProfileBasics details={basics} />
            <ProfileAboutMe details={aboutMe} />
            <ProfileInterests interests={profile.interests} isSelfProfile={authUserId === profile._id} />
            {/* <ProfileLinks /> */}
        </ScrollView>
    );
};

export const ProfileAboutTabSkeleton = () => {
    return (
        <View style={styles.skeletonWrapper}>
            <LoadingSkeleton style={styles.skeletonShort} />
            <View style={styles.skeletonItemRow}>
                <LoadingSkeleton style={styles.skeletonItem} />
                <LoadingSkeleton style={styles.skeletonItem} />
                <LoadingSkeleton style={styles.skeletonItem} />
                <LoadingSkeleton style={styles.skeletonItem} />
            </View>
        </View>
    );
};

export default ProfileAboutTab;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colours.WHITE,
    },
    wrapper: {
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 12.5,
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skeletonWrapper: {
        width: '100%',
        gap: 10,
    },
    skeletonShort: {
        width: '30%',
        height: 25,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
    },
    skeletonItem: {
        width: '20%',
        height: 25,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
    },
    skeletonItemRow: {
        flexDirection: 'row',
        gap: 5,
    },
});
