import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import GroupProfilePicture from '../../../shared/components/GroupProfilePicture';
import { Sizes, Colours } from '../../../shared/styles/Styles';
import { PROFILE_PIC_SIZES, ProfilePicture } from '../../../shared/components/MainPictures/ProfilePicture';
import { GroupIcon } from '../../../shared/components/Core/Icons';
import { LoadingSkeleton } from '../../../shared/components/Core/LoadingSkeleton';

interface ConversationSummary {
    convoName: string;
    summaryText: string;
    avatarUris: string[];
    onPress: () => void;
    isGathering: boolean;
    usersLength: number;

    style?: object;
}

export const ConversationSummary = ({ convoName, isGathering, summaryText, usersLength, avatarUris, onPress, style = {} }: ConversationSummary) => {
    return (
        <Pressable style={[styles.summary, style]} onPress={onPress}>
            {(isGathering || usersLength == 2) && (
                <ProfilePicture uri={avatarUris[0]} size='large' icon={isGathering && <GroupIcon size={Sizes.ICON_SIZE_SM} />} />
            )}
            {!isGathering && usersLength > 2 && <GroupProfilePicture uri={avatarUris[0]} otherUri={avatarUris[1]} size={'large'} />}
            <View style={styles.summaryLabel}>
                <Text style={styles.convoName} numberOfLines={2}>
                    {convoName}
                </Text>
                <Text style={styles.summaryText}>{summaryText}</Text>
            </View>
        </Pressable>
    );
};

export const ConversationSummarySkeleton = () => {
    return (
        <View style={styles.summary}>
            <LoadingSkeleton style={{ ...PROFILE_PIC_SIZES['large'], borderRadius: Sizes.BORDER_RADIUS_FULL }} />
            <LoadingSkeleton style={{ width: '50%', height: 25 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    summary: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        gap: 15,
    },
    summaryLabel: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
    },
    convoName: {
        textAlign: 'center',
        fontSize: Sizes.FONT_SIZE_XL,
        fontWeight: '600',
        color: Colours.DARK,
    },
    summaryText: {
        fontSize: Sizes.FONT_SIZE_LG,
        fontWeight: '400',
        color: Colours.GRAY,
    },
});
