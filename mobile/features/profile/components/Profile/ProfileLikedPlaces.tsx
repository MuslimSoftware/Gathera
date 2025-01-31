import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useLikedPlaces } from '../../hooks/useLikedPlaces';
import { PlaceList } from '../../../../shared/components/PlaceList';
import { Colours } from '../../../../shared/styles/Styles';

interface ProfileLikedPlacesProps {
    profile?: any;
}

export const ProfileLikedPlaces = ({ profile }: ProfileLikedPlacesProps) => {
    const { places, isLoading, error, loadMore, refresh } = useLikedPlaces(profile._id);

    return (
        <PlaceList
            data={places}
            isLoading={isLoading}
            error={error}
            onEndReached={loadMore}
            refresh={refresh}
            style={styles.container}
            contentContainerStyle={styles.contentWrapper}
            format='compact'
            enableBottomPadding
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colours.WHITE,
    },
    contentWrapper: {
        paddingTop: 10,
        paddingLeft: 7.5,
    },
});
