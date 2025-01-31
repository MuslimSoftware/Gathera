import { FlatList, StyleSheet, View, Image, Dimensions, Pressable, GestureResponderEvent } from 'react-native';
import React, { useState } from 'react';
import { Colours, Sizes } from '../styles/Styles';
import { useNavigate } from '../hooks/useNavigate';

interface ImageScrollerProps {
    images: Array<any>;
    fetchNextPage: () => void;
}

export const ImageScrollerCard = ({ images, fetchNextPage }: ImageScrollerProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { width } = Dimensions.get('window');
    const { navigateToPlaceMarker } = useNavigate();

    const renderItem = ({ item }: any) => {
        return (
            <Pressable onPress={() => navigateToPlaceMarker(item.place)}>
                <Image source={{ uri: item.url }} style={{ width, height: '100%' }} resizeMode='cover' />
            </Pressable>
        );
    };

    const onIndexBubblePress = (index: number) => {
        setSelectedIndex(index);
    };

    const handleScroll = (event: any) => {
        const contentOffset = event.nativeEvent.contentOffset;
        const index = Math.round(contentOffset.x / width);
        if (index >= images.length - 2) fetchNextPage();
        setSelectedIndex(index);
    };

    return (
        <View style={styles.globalWrapper}>
            <FlatList
                data={images}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{}}
                snapToInterval={width}
                keyExtractor={(image) => image._id}
                decelerationRate={'fast'}
                renderItem={renderItem}
                onScroll={handleScroll}
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.7}
                removeClippedSubviews
                getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
                initialNumToRender={10}
                pagingEnabled
            />
            <View style={styles.indexBubblesWrapper}>
                {images.map((image, index) => (
                    <Pressable
                        key={index}
                        style={[styles.imageIndexTracker, index === selectedIndex && styles.selectedImageIndexTracker]}
                        onPress={() => onIndexBubblePress(index)}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    globalWrapper: { flex: 1, borderRadius: Sizes.BORDER_RADIUS_LG },
    imageIndexTracker: {
        width: 10,
        height: 10,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        backgroundColor: Colours.LIGHT_TRANSPARENCY_80,
        borderWidth: 0.5,
        borderColor: Colours.GRAY,
    },
    selectedImageIndexTracker: {
        backgroundColor: Colours.WHITE,
        borderWidth: 0.5,
        borderColor: Colours.GRAY,
    },
    indexBubblesWrapper: {
        width: '90%',
        maxHeight: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 5,
        alignSelf: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
});
