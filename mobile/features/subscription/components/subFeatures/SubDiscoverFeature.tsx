import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SubSection } from '../SubSection';
import { ItemData, TopThree } from '../../../discover/components/TopThree';
import { UserBorder } from '../../../../gathera-lib/enums/user';
import { getAuthContextValues } from '../../../../shared/context/AuthContext';
import { SubBoldText } from '../SubBoldText';

export const SubDiscoverFeature = ({ border }: { border: UserBorder }) => {
    const {
        user: { avatar_uri: avatarUri, display_name: displayName },
    } = getAuthContextValues();

    const displayedUsers: ItemData[] = [
        {
            _id: '1',
            picture_uri: avatarUri,
            border: border,
            onPress: () => {},
            title: displayName,
            subtitle: '',
        },
        {
            _id: '1',
            picture_uri: 'https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            border: UserBorder.HEARTS,
            onPress: () => {},
            title: 'Emma Young',
            subtitle: '',
        },
        {
            _id: '1',
            picture_uri: 'https://dair-gathera-profile-pictures.s3.amazonaws.com/6577bc4790bcb8ba5d98ae25-1703623339161',
            border: UserBorder.SNOW,
            onPress: () => {},
            title: 'Daniel Fisher',
            subtitle: '',
        },
    ];

    return (
        <SubSection
            headerText='Become a Trending User'
            subHeaderText={
                <Text>
                    <SubBoldText>Increase your chances</SubBoldText> of being featured on the Trending Users page, allowing your profile to be{' '}
                    <SubBoldText>more visible</SubBoldText> to other people in your city.
                </Text>
            }
        >
            <View style={styles.trendingUsersWrapper}>
                <TopThree first={displayedUsers[0]} second={displayedUsers[1]} third={displayedUsers[2]} />
            </View>
        </SubSection>
    );
};

const styles = StyleSheet.create({
    trendingUsersWrapper: {
        minHeight: 100,
    },
});
