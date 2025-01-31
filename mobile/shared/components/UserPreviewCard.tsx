import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Colours, Sizes } from '../styles/Styles';
import { Card } from './Core/Card';
import { ProfilePicture } from './MainPictures/ProfilePicture';
import { PlusIcon } from './Core/Icons';
import { User } from '../../types/User';

interface UserPreviewCardProps {
    user?: User;
    label?: string;
    labelColor?: string;
    hasHighlightedBorder?: boolean;
    isDummy?: boolean;
    fixedWidth?: boolean;
    leftChildren?: React.ReactNode;
    rightChildren?: React.ReactNode;
    fillContainer?: boolean;
}

export const UserPreviewCard = ({
    user,
    hasHighlightedBorder = false,
    label,
    labelColor,
    isDummy = false,
    fixedWidth = false,
    leftChildren,
    rightChildren,
    fillContainer = false,
}: UserPreviewCardProps) => {
    const navigation: any = useNavigation();

    if (isDummy || !user) {
        return <PlusIcon color={Colours.GRAY_LIGHT} />;
    }

    const handlePress = () => {
        navigation.push('OtherProfile', { profileId: user._id });
    };

    const width = fillContainer ? { flex: 1 } : fixedWidth ? { width: 200 } : { width: '49%' };

    return (
        <Card
            style={[
                width,
                {
                    paddingHorizontal: 5,
                    backgroundColor: Colours.LIGHT,
                    borderWidth: 1,
                    borderColor: Colours.GRAY_EXTRA_LIGHT,
                },
                hasHighlightedBorder && {
                    borderWidth: 1.5,
                    borderColor: Colours.PRIMARY_TRANSPARENT_75,
                },
            ]}
            onPress={handlePress}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {leftChildren && leftChildren}

                <View style={styles.profileWrapper}>
                    <ProfilePicture uri={user.avatar_uri} border={user.border} />
                    <View style={styles.details}>
                        <View>
                            <Text style={styles.displayName} numberOfLines={1} ellipsizeMode='tail'>
                                {user.display_name}
                            </Text>
                            {!isNaN(user.follower_count) && (
                                <Text style={styles.followerText}>
                                    {user.follower_count} follower{user.follower_count === 1 ? '' : 's'}
                                </Text>
                            )}
                        </View>
                        {label && (
                            <View
                                style={[
                                    styles.label,
                                    [
                                        labelColor
                                            ? { backgroundColor: labelColor }
                                            : {
                                                  backgroundColor: Colours.PRIMARY_TRANSPARENT_75,
                                              },
                                    ],
                                ]}
                            >
                                <Text style={[styles.labelText]}>{label}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {rightChildren && rightChildren}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    profileWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    profilePic: {
        width: 55,
        height: 55,
        backgroundColor: Colours.WHITE,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        borderWidth: 1,
        borderColor: Colours.GRAY,
    },
    displayName: {
        fontSize: Sizes.FONT_SIZE_H3,
    },
    followerText: {
        fontSize: Sizes.FONT_SIZE_P,
        color: Colours.GRAY,
    },
    details: {
        maxWidth: '60%',
        height: '95%',
        gap: 2.5,
    },
    label: {
        padding: 2,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
    },
    labelText: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.WHITE,
        textAlign: 'center',
    },
});
