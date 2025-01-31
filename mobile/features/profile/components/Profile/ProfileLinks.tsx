import { StyleSheet, View } from 'react-native';
import React from 'react';
import { InstagramIcon, TwitterIcon, LinkedinIcon, FacebookIcon, YoutubeIcon, GithubIcon } from '../../../../shared/components/Core/Icons';
import { Colours, Sizes } from '../../../../shared/styles/Styles';
import { SectionTitle } from '../../../map/components/PlaceBottomSheet/SectionTitle';

interface ProfileLinksProps {}

const ProfileLinks = ({}: ProfileLinksProps) => {
    return (
        <View style={styles.wrapper}>
            <SectionTitle title='Links' thin />
            <View style={styles.handlesSection}>
                <View style={styles.handle}>
                    <InstagramIcon color={Colours.PRIMARY} size={Sizes.ICON_SIZE_SM} />
                </View>
                <View style={styles.handle}>
                    <TwitterIcon color={Colours.PRIMARY} size={Sizes.ICON_SIZE_SM} />
                </View>
                <View style={styles.handle}>
                    <LinkedinIcon color={Colours.PRIMARY} size={Sizes.ICON_SIZE_SM} />
                </View>
                <View style={styles.handle}>
                    <FacebookIcon color={Colours.PRIMARY} size={Sizes.ICON_SIZE_SM} />
                </View>
                <View style={styles.handle}>
                    <YoutubeIcon color={Colours.PRIMARY} size={Sizes.ICON_SIZE_SM} />
                </View>
                <View style={styles.handle}>
                    <GithubIcon color={Colours.PRIMARY} size={Sizes.ICON_SIZE_SM} />
                </View>
            </View>
        </View>
    );
};

export default ProfileLinks;

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        gap: 5,
    },
    handlesSection: {
        width: '100%',
        gap: 10,
        backgroundColor: Colours.WHITE,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    handle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        padding: 5,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        borderWidth: 1,
        borderColor: Colours.PRIMARY_TRANSPARENT_20,
    },
});
