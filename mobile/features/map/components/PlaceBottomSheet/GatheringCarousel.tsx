import { Dimensions, StyleSheet } from 'react-native';
import React, { Ref, useEffect, useRef, useState } from 'react';
import { useSuggestedGatherings } from '../../../discover/hooks/useSuggestedGatherings';
import { LoadingSkeleton } from '../../../../shared/components/Core/LoadingSkeleton';
import { GatheringPreview } from './GatheringPreview';
import { FlatList } from 'react-native-gesture-handler';
import { PaginatedList } from '../../../../shared/components/Core/PaginatedList';

export const GATHERING_CAROUSEL_WIDTH = Dimensions.get('window').width * 0.85;

export const GatheringCarousel = React.memo(() => {
    const flatListRef: Ref<FlatList> = useRef(null);
    const {
        displayedGatherings,
        displayedGatheringType,
        error,
        isLoading: isLoadingDisplayedGatherings,
        refreshDisplayedGatherings,
    } = useSuggestedGatherings();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [manualScrolling, setManualScrolling] = useState(false);

    // Interval to scroll to the next index every X milliseconds
    useEffect(() => {
        let scrollInterval: any;

        if (!isLoadingDisplayedGatherings && displayedGatherings.length > 0 && !manualScrolling) {
            scrollInterval = setInterval(() => {
                // Calculate the next index, considering looping back to 0
                const nextIndex = (currentIndex + 1) % displayedGatherings.length;
                setCurrentIndex(nextIndex);

                // Scroll to the next index
                flatListRef?.current?.scrollToIndex({ animated: true, index: nextIndex });
            }, 5000);
        }

        return () => {
            clearInterval(scrollInterval);
        };
    }, [currentIndex, isLoadingDisplayedGatherings, displayedGatherings, manualScrolling]);

    const handleScroll = (event: any) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const currentIndex = Math.floor(contentOffset.x / layoutMeasurement.width);
        setCurrentIndex(currentIndex);
    };

    return (
        <PaginatedList
            bounces={false}
            data={displayedGatherings}
            style={styles.wrapper}
            contentContainerStyle={styles.content}
            horizontal
            directionalLockEnabled
            overScrollMode='never'
            pagingEnabled
            dataName='gatherings'
            refresh={refreshDisplayedGatherings}
            showsHorizontalScrollIndicator={false}
            onScrollBeginDrag={() => setManualScrolling(true)}
            onScrollEndDrag={() => setManualScrolling(false)}
            onMomentumScrollEnd={handleScroll}
            renderItem={({ item }) => <GatheringPreview gathering={item} width={GATHERING_CAROUSEL_WIDTH} type={displayedGatheringType} />}
            isLoading={isLoadingDisplayedGatherings}
            error={error}
            renderSkeletonItem={() => <LoadingSkeleton style={styles.wrapper} />}
        />
    );
});

const styles = StyleSheet.create({
    wrapper: {
        width: GATHERING_CAROUSEL_WIDTH,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
