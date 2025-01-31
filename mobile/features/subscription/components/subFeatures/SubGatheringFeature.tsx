import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SubSection } from '../SubSection';
import { Colours, Sizes } from '../../../../shared/styles/Styles';
import { ProfilePicture } from '../../../../shared/components/MainPictures/ProfilePicture';
import { UserBorder } from '../../../../gathera-lib/enums/user';
import { getAuthContextValues } from '../../../../shared/context/AuthContext';
import { SubBoldText } from '../SubBoldText';

export const SubGatheringFeature = ({ border }: { border: UserBorder }) => {
    const {
        user: { avatar_uri: avatarUri },
    } = getAuthContextValues();

    return (
        <SubSection
            headerText='Promote your gatherings'
            subHeaderText={
                <Text>
                    Your gatherings will be<SubBoldText> suggested more often</SubBoldText> to others in your city, making it easier to fill out your
                    gatherings and meet new people.
                </Text>
            }
        >
            <View style={styles.wrapper}>
                <View style={styles.avatarRow}>
                    <ProfilePicture
                        uri='https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                        size='medium'
                    />
                    <ProfilePicture
                        uri='https://dair-gathera-profile-pictures.s3.amazonaws.com/6577bc4790bcb8ba5d98ae25-1703623339161'
                        size='medium'
                    />
                    <ProfilePicture
                        uri='https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                        size='medium'
                    />
                    <ProfilePicture
                        uri='https://images.pexels.com/photos/2118052/pexels-photo-2118052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                        size='medium'
                    />
                    <ProfilePicture
                        uri='https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                        size='medium'
                    />
                    <ProfilePicture uri={avatarUri} border={border} size='medium' />
                </View>
                <View style={styles.labelRow}>
                    <View style={styles.suggestedTag}>
                        <Text style={styles.suggestedText}>Suggested</Text>
                    </View>
                    <Text style={styles.gatheringName} numberOfLines={1}>
                        Game Night • <Text style={styles.placeName}>Arcade Bar</Text>
                    </Text>
                </View>
            </View>
        </SubSection>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        alignItems: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        gap: 5,
        borderColor: Colours.GRAY_LIGHT,
        borderWidth: 1,
        borderRadius: Sizes.BORDER_RADIUS_LG,
        // borderTopLeftRadius: Sizes.BORDER_RADIUS_LG,
        // borderTopRightRadius: Sizes.BORDER_RADIUS_LG,
        // borderBottomWidth: 0,
    },
    avatarRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: -25,
    },
    imageWrapper: {
        width: 60,
        height: 60,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        borderWidth: 1,
        borderColor: Colours.GRAY,
        backgroundColor: Colours.GRAY_LIGHT,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    suggestedTag: {
        backgroundColor: Colours.PRIMARY,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
    },
    suggestedText: {
        color: Colours.WHITE,
        fontSize: Sizes.FONT_SIZE_XS,
        paddingHorizontal: 5,
        paddingVertical: 1,
    },
    gatheringName: { fontSize: Sizes.FONT_SIZE_SM, fontWeight: '500' },
    placeName: { fontSize: Sizes.FONT_SIZE_SM, color: Colours.TERTIARY, fontWeight: 'bold' },
});
