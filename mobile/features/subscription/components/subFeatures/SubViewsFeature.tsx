import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SubSection } from '../SubSection';
import { SubBoldText } from '../SubBoldText';
import { ViewItem } from '../../../../shared/components/Core/Views/ViewItem';
import { SubscriptionType, UserBorder, ViewType } from '../../../../gathera-lib/enums/user';
import { Colours, Sizes } from '../../../../shared/styles/Styles';

const DUMMY_USERS = [
    {
        _id: '1',
        avatar_uri: 'https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        display_name: 'Emma Young viewed your profile',
        subscription: SubscriptionType.PREMIUM,
        border: UserBorder.HEARTS,
    },
];

export const SubViewsFeature = () => {
    return (
        <SubSection
            headerText='See what people are viewing'
            subHeaderText={
                <Text>
                    <SubBoldText>See who's interested</SubBoldText> in your profile and gatherings. Not only that, but you can also see who's been
                    viewing other profiles and gatherings.
                </Text>
            }
        >
            <View style={styles.wrapper}>
                {DUMMY_USERS.map((user, index) => (
                    <ViewItem
                        key={index}
                        view={{
                            _id: user._id,
                            user: {
                                _id: user._id,
                                avatar_uri: user.avatar_uri,
                                display_name: user.display_name,
                                subscription: user.subscription,
                                border: user.border,
                            },
                            view_type: ViewType.PROFILE,
                            updatedAt: new Date(Date.now() - 1000 * 60 * 5),
                            profile: '1',
                        }}
                    />
                ))}
            </View>
        </SubSection>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        gap: 5,
        borderColor: Colours.GRAY_LIGHT,
        borderWidth: 1,
        borderRadius: Sizes.BORDER_RADIUS_LG,
    },
});
