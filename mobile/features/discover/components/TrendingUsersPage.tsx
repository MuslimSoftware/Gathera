import { Text, StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { useTrendingUsers } from '../hooks/useTrendingUsers';
import { useNavigation } from '@react-navigation/native';
import { TopThree } from './TopThree';
import { UserPreviewWithFollowers } from '../../../types/User';
import { Colours, Sizes } from '../../../shared/styles/Styles';
import { getNavigationBarBottomPadding } from '../../../shared/utils/uiHelper';
import { PaginatedList } from '../../../shared/components/Core/PaginatedList';
import { InfoIcon } from '../../../shared/components/Core/Icons';
import { Overlay } from '../../../shared/components/Overlays/Overlay';
import { UserListItem, UserListItemSkeleton } from '../../../shared/components/ListItems/UserListItem';

export const TrendingUsersPage = () => {
    const { trendingUsers, fetchTrendingUsers, isLoadingTrendingUsers, refreshTrendingUsers, trendingUsersError } = useTrendingUsers();
    const navigation: any = useNavigation();
    const [showInfoOverlay, setShowInfoOverlay] = React.useState(false);

    const getUserItemData = (user: UserPreviewWithFollowers) => {
        if (!user) return null;
        return {
            _id: user._id,
            title: user.display_name,
            subtitle: `${user.follower_count} follower${user.follower_count === 1 ? '' : 's'}`,
            picture_uri: user.avatar_uri,
            onPress: () => navigation.push('OtherProfile', { profileId: user._id }),
            border: user.border,
        };
    };

    const data = [{ _id: 'top-three' }, ...trendingUsers.slice(3)];
    const renderItem = ({ item, index }: any) => {
        if (item._id === 'top-three') {
            return (
                <TopThree
                    first={getUserItemData(trendingUsers[0])}
                    second={getUserItemData(trendingUsers[1])}
                    third={getUserItemData(trendingUsers[2])}
                />
            );
        }
        return <UserListItem profile={item} leftChildren={<Text style={styles.placementText}>{index + 3}</Text>} />;
    };

    const infoContent = useMemo(
        () => ({
            title: 'How it works',
            description:
                'Users are ranked by how often they use the features of the app and their popularity on the app within the last week. Premium members receive a 50% boost in their rankings!',
            imageSource: require('../../../assets/images/podium.png'),
        }),
        []
    );

    return (
        <HeaderPageLayout title='Trending Users' headerRight={<InfoIcon style={{ padding: 10 }} onPress={() => setShowInfoOverlay(true)} />}>
            <Overlay
                content={infoContent}
                modalProps={{ visible: showInfoOverlay }}
                dismissOverlay={() => setShowInfoOverlay(false)}
                dismissOnBackdropPress
                dismissButtonLabel='Got it!'
            />
            <PaginatedList
                contentContainerStyle={[styles.listWrapper, { paddingBottom: getNavigationBarBottomPadding() }]}
                data={data}
                error={trendingUsersError}
                renderItem={renderItem}
                onEndReached={fetchTrendingUsers}
                refresh={refreshTrendingUsers}
                isLoading={isLoadingTrendingUsers}
                renderSkeletonItem={() => (
                    <View style={styles.skeletonWrapper}>
                        <UserListItemSkeleton />
                    </View>
                )}
                numFooterSkeletonItemsToRender={3}
            />
        </HeaderPageLayout>
    );
};

const styles = StyleSheet.create({
    listWrapper: {
        gap: 20,
        padding: 10,
    },
    placementText: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.GRAY,
    },
    skeletonWrapper: { paddingLeft: 10, marginRight: -10 },
});
