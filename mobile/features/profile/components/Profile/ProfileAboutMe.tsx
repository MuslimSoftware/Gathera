import { StyleSheet, View } from 'react-native';
import React from 'react';
import { SectionTitle } from '../../../map/components/PlaceBottomSheet/SectionTitle';
import { Colours, Sizes } from '../../../../shared/styles/Styles';
import { FormattedDetail, getFormattedDetail } from '../../utils/profileHelper';
import { ProfileInfoItem } from './ProfileInfoItem';

const ProfileAboutMe = ({ details }: any) => {
    if (details.length === 0) return null;
    return (
        <View style={styles.wrapper}>
            <SectionTitle title='About Me' thin />
            <View style={styles.characteristicsWrapper}>
                {details.map((profileDetail: any) => {
                    const detail: FormattedDetail = getFormattedDetail(profileDetail);

                    return <ProfileInfoItem key={detail.label} label={detail.value} icon={detail.icon} />;
                })}
            </View>
        </View>
    );
};

export default ProfileAboutMe;

const styles = StyleSheet.create({
    wrapper: {
        gap: 10,
    },
    characteristicsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colours.GRAY_LIGHT,
        borderRadius: Sizes.BORDER_RADIUS_LG,
        paddingVertical: 5,
        paddingHorizontal: 7,
        gap: 5,
    },
    characteristicText: {
        color: Colours.DARK,
        fontSize: Sizes.FONT_SIZE_P,
        fontWeight: '500',
    },
});
