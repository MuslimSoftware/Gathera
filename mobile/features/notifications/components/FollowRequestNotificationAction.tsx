import { View, StyleSheet } from 'react-native';
import { useRespondToFollowRequest } from '../hooks/useRespondToFollowRequest';
import { PrimaryButton } from '../../../shared/components/Buttons/PrimaryButton';
import { GrayButton } from '../../../shared/components/Buttons/GrayButton';
import { BUTTON_DEFAULT_MIN_WIDTH } from '../../../shared/components/Buttons/Button';
import { useToastError } from '../../../shared/hooks/useToastError';

// Action buttons for follow request notifications
export const FollowRequestNotificationAction = ({ notificationId, onPress }: { notificationId: string; onPress: any }) => {
    const { acceptFollowRequest, denyFollowRequest, error, isLoading } = useRespondToFollowRequest(notificationId);

    useToastError(error);

    const handleJoinBtnPress = async () => {
        await acceptFollowRequest();
        onPress();
    };

    const handleIgnoreBtnPress = async () => {
        await denyFollowRequest();
        onPress();
    };

    return (
        <View style={styles.buttonWrapper}>
            <PrimaryButton onPress={handleJoinBtnPress} label='Accept' containerStyle={styles.button} vibrateOnPress />
            <GrayButton onPress={handleIgnoreBtnPress} label='Ignore' containerStyle={styles.button} />
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
