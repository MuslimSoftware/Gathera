import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SubSection } from '../SubSection';
import { UserBorder } from '../../../../gathera-lib/enums/user';
import { Colours, Sizes } from '../../../../shared/styles/Styles';
import { ProfilePicture } from '../../../../shared/components/MainPictures/ProfilePicture';
import { getAuthContextValues } from '../../../../shared/context/AuthContext';
import { SubBoldText } from '../SubBoldText';

export const SubPriorityFeature = ({ border }: { border: UserBorder }) => {
    const {
        user: { avatar_uri: avatarUri },
    } = getAuthContextValues();

    return (
        <SubSection
            headerText='Display Priority'
            subHeaderText={
                <Text>
                    You will be prioritized and <SubBoldText>shown first</SubBoldText> in gatherings, making it easier for others to see your profile.
                </Text>
            }
        >
            <View style={styles.wrapper}>
                <View style={styles.leftWrapper}>
                    <ProfilePicture uri='https://i.ytimg.com/vi/uO77_8WGf9k/maxresdefault.jpg' size='medium' />
                    <View style={styles.textWrapper}>
                        <Text style={styles.gatheringName} numberOfLines={1}>
                            Game Night
                        </Text>
                        <Text style={styles.placeName}>Arcade Bar</Text>
                        <Text style={styles.header3}>Friday</Text>
                    </View>
                </View>

                <View style={styles.avatarRow}>
                    <ProfilePicture uri='https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' />
                    <ProfilePicture uri='https://images.pexels.com/photos/2118052/pexels-photo-2118052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' />
                    <ProfilePicture uri='https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' />
                    <ProfilePicture uri={avatarUri} border={border} />
                </View>
            </View>
        </SubSection>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: Colours.GRAY_LIGHT,
        borderRadius: Sizes.BORDER_RADIUS_LG,
    },
    leftWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    textWrapper: {
        justifyContent: 'center',
    },
    avatarRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: -25,
    },
    gatheringName: { fontSize: Sizes.FONT_SIZE_MD, fontWeight: 'bold' },
    placeName: { fontSize: Sizes.FONT_SIZE_SM, color: Colours.TERTIARY, fontWeight: 'bold' },
    header3: {
        fontSize: Sizes.FONT_SIZE_SM,
        fontWeight: '400',
        color: Colours.GRAY,
    },
});
