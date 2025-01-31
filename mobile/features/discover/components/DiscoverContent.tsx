import { Pressable, RefreshControl, StyleSheet, View, ScrollView } from 'react-native';
import React from 'react';
import DiscoverPageSection from './DiscoverPageSection';
import { useNavigation } from '@react-navigation/native';
import SearchBar from './SearchBar';
import { FireIcon, ThumbsUpIcon, TrendingIcon } from '../../../shared/components/Core/SvgIcons';
import { useTrendingUsers } from '../hooks/useTrendingUsers';
import { useTrendingPlaces } from '../hooks/useTrendingPlaces';
import { useSuggestedGatherings } from '../hooks/useSuggestedGatherings';
import { TopThree, TopThreeSkeleton } from './TopThree';
import { UserPreviewWithFollowers } from '../../../types/User';
import { PlaceList } from '../../../shared/components/PlaceList';
import { GatheringList } from '../../map/components/Gathering/GatheringList';
import { getNavigationBarBottomPadding } from '../../../shared/utils/uiHelper';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';

const NUM_SUGGESTED_GATHERINGS = 3;
const NUM_TRENDING_PLACES = 3;

const DiscoverContent = () => {
    const navigation: any = useNavigation();
    const { trendingUsers, trendingUsersError, isLoadingTrendingUsers, refreshTrendingUsers } = useTrendingUsers();
    const { trendingPlaces, trendingPlacesError, isLoadingTrendingPlaces, refreshTrendingPlaces } = useTrendingPlaces();
    const {
        displayedGatherings,
        error: displayedGatheringsError,
        isLoading: isLoadingSuggestedGatherings,
        refreshDisplayedGatherings,
    } = useSuggestedGatherings();

    const refresh = () => {
        refreshTrendingUsers();
        refreshTrendingPlaces();
        refreshDisplayedGatherings();
    };

    const navigateToSearchPage = () => navigation.push('SearchPage');

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

    const bottomPadding = getNavigationBarBottomPadding() + 10;
    return (
        <ScrollView
            style={styles.scrollWrapper}
            contentContainerStyle={[styles.scrollContainer, { paddingBottom: bottomPadding }]}
            refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}
        >
            <Pressable onPress={navigateToSearchPage} android_disableSound>
                <SearchBar searchQuery={''} setSearchQuery={() => {}} editable={false} isDummy />
            </Pressable>
            <DiscoverPageSection icon={<FireIcon />} title='Trending Users' viewAllHandler={() => navigation.push('AllTrendingUsers')}>
                {trendingUsersError && <ErrorMessage message={trendingUsersError} />}
                {trendingUsers.length == 0 && !isLoadingTrendingUsers && !trendingUsersError && <ErrorMessage message={'No users found'} />}
                {!trendingUsersError && isLoadingTrendingUsers && <TopThreeSkeleton />}
                {!trendingUsersError && !isLoadingTrendingUsers && trendingUsers.length > 0 && (
                    <View style={styles.trendingUsersWrapper}>
                        <TopThree
                            first={getUserItemData(trendingUsers[0])}
                            second={getUserItemData(trendingUsers[1])}
                            third={getUserItemData(trendingUsers[2])}
                        />
                    </View>
                )}
            </DiscoverPageSection>
            <DiscoverPageSection
                icon={<TrendingIcon />}
                title='Trending Places'
                viewAllHandler={() => navigation.push('AllTrendingPlaces')}
                disableContentPadding
            >
                <PlaceList
                    data={trendingPlaces}
                    error={trendingPlacesError}
                    isLoading={isLoadingTrendingPlaces}
                    maxDataItemsToRender={NUM_TRENDING_PLACES}
                />
            </DiscoverPageSection>
            <DiscoverPageSection
                icon={<ThumbsUpIcon />}
                title='Suggested Gatherings'
                viewAllHandler={() => navigation.push('AllSuggestedGatherings')}
            >
                <GatheringList
                    gatherings={displayedGatherings}
                    isLoading={isLoadingSuggestedGatherings}
                    error={displayedGatheringsError}
                    maxGatherings={NUM_SUGGESTED_GATHERINGS}
                />
            </DiscoverPageSection>
        </ScrollView>
    );
};

export default DiscoverContent;

const styles = StyleSheet.create({
    scrollContainer: {
        gap: 20,
    },
    scrollWrapper: {
        width: '100%',
        height: '100%',
    },
    gatheringsWrapper: {},
    trendingUsersWrapper: {
        minHeight: 100,
    },
    trendingUser: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    placesWrapper: {
        gap: 10,
    },
});
