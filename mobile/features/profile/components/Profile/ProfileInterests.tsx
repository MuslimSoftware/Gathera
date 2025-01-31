import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import { getAuthContextValues } from '../../../../shared/context/AuthContext';
import { SectionTitle } from '../../../map/components/PlaceBottomSheet/SectionTitle';
import { ProfileInfoItem } from './ProfileInfoItem';

interface ProfileInterestsProps {
    interests: string[];
    isSelfProfile: boolean;
}

export const ProfileInterests: React.FC<ProfileInterestsProps> = ({ interests, isSelfProfile }) => {
    const {
        user: { interests: authUserInterests },
    } = getAuthContextValues();

    if (!interests || interests.length == 0) return <></>;
    if (!authUserInterests) {
        console.warn('Auth context user interests is undefined. This should not happen.');
    }

    const interestsSortedByCommonality = useMemo(() => {
        const authUserInterestsSet = new Set(authUserInterests);
        return interests.sort((a, b) => {
            if (authUserInterestsSet.has(a) && !authUserInterestsSet.has(b)) return -1;
            if (!authUserInterestsSet.has(a) && authUserInterestsSet.has(b)) return 1;
            return 0;
        });
    }, [authUserInterests, interests]);

    return (
        <View style={styles.globalWrapper}>
            <SectionTitle title='Interests' thin />
            <View style={styles.wrapper}>
                {interestsSortedByCommonality.map((interest: string) => {
                    return (
                        <ProfileInfoItem
                            key={interest}
                            label={interest}
                            isHighlighted={isSelfProfile ? false : authUserInterests.includes(interest)}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    globalWrapper: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapper: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingTop: 5,
    },
});
