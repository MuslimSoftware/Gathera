import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React from 'react';
import { ProfilePicture, PROFILE_PIC_SIZES } from '../../../shared/components/MainPictures/ProfilePicture';
import { Colours, Sizes } from '../../../shared/styles/Styles';
import { LoadingSkeleton } from '../../../shared/components/Core/LoadingSkeleton';
import { ellipsizeText } from '../../../shared/utils/uiHelper';
import { UserBorder } from '../../../gathera-lib/enums/user';

export interface ItemData {
    _id: string;
    title: string | number;
    subtitle: string | number;
    picture_uri: string;
    onPress: () => void;
    border: UserBorder;
}

interface Props {
    first: ItemData | null;
    second: ItemData | null;
    third: ItemData | null;
}

export const TopThree = ({ first, second, third }: Props) => {
    if (!first && !second && !third) return null;

    return (
        <View style={styles.trendingUsersWrapper}>
            {second && <Item item={second} icon={ICONS.second} size='medium' />}
            {first && <Item item={first} icon={ICONS.first} size='large' />}
            {third && <Item item={third} icon={ICONS.third} size='medium' />}
        </View>
    );
};

const Item = ({ item, icon, size = 'medium' }: { item: ItemData; icon: React.ReactNode; size: 'medium' | 'large' }) => {
    return (
        <Pressable style={styles.itemWrapper} onPress={item.onPress}>
            {icon}
            <ProfilePicture uri={item.picture_uri} size={size} border={item.border} />
            <View style={styles.itemTextWrapper}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                    {ellipsizeText(`${item.title}`, 13)}
                </Text>
                <Text style={styles.itemSubtitle} numberOfLines={1}>
                    {item.subtitle}
                </Text>
            </View>
        </Pressable>
    );
};

const ItemSkeleton = ({ icon, size = 'medium' }: { icon: React.ReactNode; size: 'medium' | 'large' }) => {
    return (
        <View style={styles.itemWrapper}>
            {icon}
            {size === 'large' && <LoadingSkeleton style={{ ...PROFILE_PIC_SIZES.large, borderRadius: Sizes.BORDER_RADIUS_FULL }} />}
            {size === 'medium' && <LoadingSkeleton style={{ ...PROFILE_PIC_SIZES.medium, borderRadius: Sizes.BORDER_RADIUS_FULL }} />}
            <LoadingSkeleton style={{ height: 20, width: '100%' }} />
            <LoadingSkeleton style={{ height: 20, width: '100%' }} />
        </View>
    );
};

export const TopThreeSkeleton = () => {
    return (
        <View style={styles.trendingUsersWrapper}>
            <ItemSkeleton icon={ICONS.second} size='medium' />
            <ItemSkeleton icon={ICONS.first} size='large' />
            <ItemSkeleton icon={ICONS.third} size='medium' />
        </View>
    );
};

const styles = StyleSheet.create({
    trendingUsersWrapper: {
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    itemWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
    },
    itemTextWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.DARK,
        fontWeight: '500',
    },
    itemSubtitle: {
        color: Colours.GRAY,
        fontSize: Sizes.FONT_SIZE_XS,
    },
    rankIcon: {
        fontSize: 35,
    },
    crownIcon: {
        fontSize: 45,
    },
});

const ICONS = {
    first: <Text style={styles.crownIcon}>👑</Text>,
    second: <Text style={styles.rankIcon}>🥈</Text>,
    third: <Text style={styles.rankIcon}>🥉</Text>,
};
