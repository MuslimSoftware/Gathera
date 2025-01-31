import React from 'react';
import { getAuthContextValues } from '../../../shared/context/AuthContext';
import { useNavigate } from '../../../shared/hooks/useNavigate';
import { PlacePage } from '../components/PlaceBottomSheet/PlacePage';
import { usePlaceWithInterestedUsers } from '../hooks/usePlaceWithInterestedUsers';
import * as Haptics from 'expo-haptics';
import { getMapContextValues } from '../../../shared/context/MapContext';
import { useFetch } from '../../../shared/hooks/useFetch';
import { useToastError } from '../../../shared/hooks/useToastError';
import { Loading } from '../../../shared/components/Core/Loading';

export const PlacePageContainer = () => {
    const { user } = getAuthContextValues();
    const { selectedPlace } = getMapContextValues();
    const { fetchAsync: toggleIsInterested, error: isInterestedError, isLoading: isInterestedLoading } = useFetch();

    if (!selectedPlace) return <Loading />;

    useToastError(isInterestedError);

    const {
        errorPlace,
        isLoadingPlace,
        fetchPlace,
        isInterested,
        setIsInterested,
        interestedUsers,
        setInterestedUsers,
        errorUsers,
        isLoadingUsers,
        fetchUsers,
        refresh,
    } = usePlaceWithInterestedUsers(selectedPlace._id);

    const { navigateToScreen } = useNavigate();

    const navigateToInfo = () => {
        navigateToScreen('PlaceInfo', { placeId: selectedPlace._id });
    };

    const handleHeartPress = async () => {
        toggleIsInterested(
            {
                url: `/place/toggle-interest/${selectedPlace._id}`,
                method: 'POST',
            },
            (isUserInterested) => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setIsInterested((prev) => (prev !== isUserInterested ? isUserInterested : prev));
                setInterestedUsers((prev: any) => (isUserInterested ? [...prev, user] : prev.filter((u: any) => u._id !== user._id)));
            }
        );
    };

    // @TODO: handle error / loading properly
    if (isLoadingPlace || !selectedPlace) {
        return <></>;
    }

    return (
        <PlacePage
            place={selectedPlace}
            isInterested={isInterested}
            interestedUsers={interestedUsers}
            isLoading={isLoadingUsers}
            navigateToInfo={navigateToInfo}
            refresh={refresh}
            toggleIsInterested={handleHeartPress}
            fetchUsers={fetchUsers}
        />
    );
};
