import { StyleSheet, View } from 'react-native';
import React from 'react';
import { SectionTitle } from '../../../map/components/PlaceBottomSheet/SectionTitle';
import { Sizes, Colours } from '../../../../shared/styles/Styles';
import { FormattedDetail, getFormattedDetail } from '../../utils/profileHelper';
import { ProfileInfoItem } from './ProfileInfoItem';

const ProfileBasics = ({ details }: any) => {
    if (details.length === 0) return null;
    return (
        <View style={styles.wrapper}>
            <SectionTitle title='My Basics' thin />
            <View style={styles.basicsWrapper}>
                {details.map((profileDetail: any) => {
                    const detail: FormattedDetail = getFormattedDetail(profileDetail);

                    return <ProfileInfoItem key={detail.label} label={detail.value} icon={detail.icon} />;
                })}
            </View>
        </View>
    );
};

export default ProfileBasics;

const styles = StyleSheet.create({
    wrapper: {
        gap: 5,
    },
    basicsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    basic: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: Sizes.BORDER_RADIUS_LG,
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderColor: Colours.GRAY_LIGHT,
        gap: 5,
    },
    basicText: {
        fontSize: Sizes.FONT_SIZE_P,
        color: Colours.DARK,
    },
});
