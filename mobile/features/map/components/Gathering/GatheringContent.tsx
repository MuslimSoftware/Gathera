import { StyleSheet, RefreshControl, View } from 'react-native';
import React, { Dispatch, useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { InviteUserSheet } from '../InviteUserSheet/InviteUserSheet';
import { GatheringPendingUsers } from './GatheringPendingUsers';
import { GatheringAttendingUsers } from './GatheringAttendingUsers';
import { GatheringActionButtons } from './GatheringActionButtons';
import { Colours } from '../../../../shared/styles/Styles';
import { HeaderPageLayout } from '../../../../shared/layouts/HeaderPageLayout';
import { GatheringDetails } from './GatheringDetails';
import { GearsIcon } from '../../../../shared/components/Core/Icons';
import { useNavigate } from '../../../../shared/hooks/useNavigate';
import { PlaceItem } from '../../../../shared/components/PlaceItem';
import { IPlace } from '../../../../types/Place';
import { getNavigationBarBottomPadding, showToast } from '../../../../shared/utils/uiHelper';
import { ViewsIndicator } from '../../../../shared/components/Core/Views/ViewsIndicator';
import { useJoinGathering } from '../../../../shared/hooks/useJoinGathering';
import { updateObject } from '../../../../shared/utils/dataHelper';
import { validateFutureDate } from '../../../../gathera-lib/validators/Validators';
import { getAuthContextValues } from '../../../../shared/context/AuthContext';
import { useFetch } from '../../../../shared/hooks/useFetch';
import { ErrorMessage } from '../../../../shared/components/ErrorMessage';
import { GatheringInvitedUsers } from './GatheringInvitedUsers';
import { useToastError } from '../../../../shared/hooks/useToastError';

interface GatheringContentProps {
    place: IPlace;
    gathering: any;
    setGathering: Dispatch<any>;
    fetchGathering: () => void;
    isUserAttending: boolean;
    setIsUserAttending: Dispatch<any>;
}

export const GatheringContent: React.FC<GatheringContentProps> = ({
    place,
    gathering,
    setGathering,
    fetchGathering,
    isUserAttending,
    setIsUserAttending,
}) => {
    const {
        user: { _id: userId },
    } = getAuthContextValues();
    const { navigateToScreen, navigateToChatRoomFromGathering } = useNavigate();
    const [isUserPending, setIsUserPending] = useState<boolean>(false);
    const [showInviteSheet, setShowInviteSheet] = useState<boolean>(false);
    const { fetchAsync: inviteToGathering, error: inviteError, isLoading: inviteIsLoading } = useFetch();
    const { fetchAsync: respondToRequest, error: respondError, isLoading: respondIsLoading } = useFetch();
    const { updatedGathering, joinGathering, error: joinGatheringError } = useJoinGathering(gathering);

    useEffect(() => {
        setIsUserPending(gathering?.requested_user_list.some((pendingUser: any) => pendingUser._id == userId) || false);
    }, [gathering]);

    useToastError(joinGatheringError);

    useEffect(() => {
        setGathering(updatedGathering);
        setIsUserAttending(updatedGathering?.user_list?.some((attendingUser: any) => attendingUser._id === userId));
    }, [updatedGathering]);

    const handleJoinBtnPress = async () => {
        joinGathering();
        setGathering((prev: any) => updateObject(prev, updatedGathering));
    };

    const inviteUser = async (userToInviteId: string) => {
        inviteToGathering(
            {
                url: `/gathering/invite/${gathering._id}`,
                method: 'POST',
                body: { user_id_to_add: userToInviteId },
            },
            (updatedGathering) => {
                setGathering(updatedGathering);
            }
        );
    };

    const handleSettingsBtnPress = async () => {
        navigateToScreen('GatheringSettings', { gatheringId: gathering._id });
    };

    const handleRespondToRequest = async (userId: string, join: boolean) => {
        respondToRequest(
            {
                url: `/gathering/respond-to-request/${gathering._id}`,
                method: 'POST',
                body: { requesting_user_id: userId, join },
            },
            (updatedGathering) => {
                setGathering(updatedGathering);
            }
        );
    };

    if (!gathering.user_list) {
        // gathering is empty, so it is deleted, navigate back to place details
        navigateToScreen('SelectedPlaceDetails');
        return <></>;
    }

    const HeaderRight = () => {
        return (
            <View style={styles.actionBtns}>
                <ViewsIndicator
                    count={gathering.views}
                    onPress={() => navigateToScreen('GatheringViewsDetails', { gatheringId: gathering._id, viewCount: gathering.views })}
                />
                {isUserAttending && <GearsIcon onPress={handleSettingsBtnPress} />}
            </View>
        );
    };

    const isPassed = !validateFutureDate(new Date(gathering.event_date));
    return (
        <HeaderPageLayout headerRight={<HeaderRight />}>
            <ScrollView
                style={{ backgroundColor: Colours.WHITE }}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: getNavigationBarBottomPadding() }]}
                refreshControl={<RefreshControl refreshing={false} onRefresh={fetchGathering} />}
            >
                {inviteError || (respondError && <ErrorMessage message={inviteError || respondError} />)}
                <GatheringDetails
                    gathering={gathering}
                    isUserAttending={isUserAttending}
                    navigateToChatRoomFromGathering={() => navigateToChatRoomFromGathering(gathering.conversation._id)}
                    setShowInviteSheet={setShowInviteSheet}
                />
                <GatheringActionButtons
                    gathering={gathering}
                    isUserAttending={isUserAttending}
                    isUserPending={isUserPending}
                    handleJoinBtnPress={handleJoinBtnPress}
                    setShowInviteSheet={setShowInviteSheet}
                />
                <PlaceItem place={place} />
                <GatheringAttendingUsers
                    attendingUsers={gathering.user_list}
                    gatheringHostId={gathering.host_user}
                    maxCount={gathering.max_count}
                    setShowInviteSheet={setShowInviteSheet}
                />
                {!isPassed && (
                    <GatheringPendingUsers
                        isUserAttending={isUserAttending}
                        pendingUsers={gathering.requested_user_list}
                        respondToUserRequest={handleRespondToRequest}
                    />
                )}
                <GatheringInvitedUsers isUserAttending={isUserAttending} invitedUsers={gathering.invited_user_list} />
            </ScrollView>
            {showInviteSheet && (
                <InviteUserSheet
                    showInviteSheet={showInviteSheet}
                    setShowInviteSheet={setShowInviteSheet}
                    inviteUser={inviteUser}
                    invitedUserList={gathering.invited_user_list}
                    attendingUserList={gathering.user_list}
                />
            )}
        </HeaderPageLayout>
    );
};

export default GatheringContent;

const styles = StyleSheet.create({
    scrollContent: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: Colours.WHITE,
        gap: 20,
    },
    placePreviewCard: {
        width: '100%',
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    actionBtns: {
        position: 'absolute',
        right: 10,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
});
