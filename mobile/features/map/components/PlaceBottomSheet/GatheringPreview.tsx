import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { UserAvatarRow } from '../../../../shared/components/User/UserAvatarRow';
import { Colours, Sizes } from '../../../../shared/styles/Styles';
import { DisplayedGatheringType } from '../../../discover/hooks/useSuggestedGatherings';
import { useNavigation } from '@react-navigation/native';
import { useNavigate } from '../../../../shared/hooks/useNavigate';

interface GatheringPreviewProps {
    gathering: any;
    type?: DisplayedGatheringType;
    width?: number;
}

export const GatheringPreview = React.memo(({ gathering, width, type = 'Suggested' }: GatheringPreviewProps) => {
    const { navigateToMapGathering } = useNavigate();
    const navigation: any = useNavigation();

    const avatars = gathering.user_list.map((user: any) => {
        return { uri: user.avatar_uri, subscription: user.subscription, border: user.border };
    });

    const onPress = () => {
        navigateToMapGathering(gathering._id, gathering.place._id);
    };

    return (
        <Pressable style={[styles.globalWrapper, width ? { width } : {}]} onPress={onPress}>
            <View style={styles.userAvatarRow}>
                <UserAvatarRow avatars={avatars} />
            </View>
            <View style={styles.headerText}>
                <View style={styles.tagWrapper}>
                    <Text style={styles.tagText}>{type}</Text>
                </View>
                <Text style={styles.gatheringName} numberOfLines={1}>
                    <Text style={styles.placeName}>{gathering.place.name}</Text> • <Text style={styles.dateText}>Tuesday 4pm</Text>
                </Text>
            </View>
        </Pressable>
    );
});

const styles = StyleSheet.create({
    globalWrapper: {
        gap: 2.5,
    },
    headerText: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 5,
    },
    gatheringName: {
        color: Colours.DARK,
        fontWeight: '500',
        fontSize: Sizes.FONT_SIZE_SM,
        maxWidth: '70%',
    },
    placeName: {
        color: Colours.PRIMARY,
        fontWeight: '600',
        fontSize: Sizes.FONT_SIZE_SM,
    },
    userAvatarRow: {
        flexDirection: 'row',
    },
    dateWrapper: {
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateText: {
        color: Colours.DARK,
        fontSize: Sizes.FONT_SIZE_XS,
        fontWeight: '500',
    },
    tagWrapper: {
        backgroundColor: Colours.PRIMARY,
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        alignSelf: 'flex-start',
    },
    tagText: {
        color: Colours.WHITE,
        fontSize: Sizes.FONT_SIZE_XXS,
        fontWeight: '600',
    },
});
