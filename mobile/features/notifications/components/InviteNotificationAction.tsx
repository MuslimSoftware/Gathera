import { View, StyleSheet } from 'react-native';
import { PrimaryButton } from '../../../shared/components/Buttons/PrimaryButton';
import { GrayButton } from '../../../shared/components/Buttons/GrayButton';
import { Notification } from '../../../types/Notification';
import { useRespondToGatheringInvite } from '../hooks/useResponseToGatheringInvite';
import { useNavigate } from '../../../shared/hooks/useNavigate';
import { BUTTON_DEFAULT_MIN_WIDTH } from '../../../shared/components/Buttons/Button';
import { useToastError } from '../../../shared/hooks/useToastError';

interface InviteNotificationActionProps {
    notification: Notification;
    onPress: any;
}

export const InviteNotificationAction = ({ notification, onPress }: InviteNotificationActionProps) => {
    const { navigateToScreen } = useNavigate();
    const { acceptGatheringInvite, denyGatheringInvite, error } = useRespondToGatheringInvite(notification._id);

    useToastError(error);

    const navigateToGathering = () => {
        if (!notification.gathering) return;
        navigateToScreen('Gathering', { gatheringId: notification.gathering._id });
    };

    const handleJoinBtnPress = async () => {
        await acceptGatheringInvite();
        navigateToGathering();
        onPress();
    };

    const handleIgnoreBtnPress = async () => {
        await denyGatheringInvite();
        onPress();
    };

    return (
        <View style={styles.buttonWrapper}>
            {notification.isFull && <GrayButton label='Full' onPress={navigateToGathering} containerStyle={styles.button} />}
            {!notification.isFull && <PrimaryButton label='Join' onPress={handleJoinBtnPress} containerStyle={styles.button} />}

            <GrayButton label='Ignore' onPress={handleIgnoreBtnPress} containerStyle={styles.button} />
        </View>
    );
};

const styles = StyleSheet.create({
    buttonWrapper: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    button: {
        minWidth: BUTTON_DEFAULT_MIN_WIDTH,
    },
});
