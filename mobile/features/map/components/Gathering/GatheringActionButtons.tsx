import { StyleSheet, View } from 'react-native';
import React from 'react';
import { PrimaryButton } from '../../../../shared/components/Buttons/PrimaryButton';
import { GrayButton } from '../../../../shared/components/Buttons/GrayButton';
import { Gathering } from '../../../../types/Gathering';

interface GatheringActionButtonsProps {
    gathering: Gathering;
    isUserAttending: boolean;
    isUserPending: boolean;
    handleJoinBtnPress: () => void;
    setShowInviteSheet: (show: boolean) => void;
}

export const GatheringActionButtons = ({
    gathering,
    isUserAttending,
    isUserPending,
    handleJoinBtnPress,
    setShowInviteSheet,
}: GatheringActionButtonsProps) => {
    const isGatheringFull = gathering.user_list.length >= gathering.max_count;
    const isGatheringPrivate = gathering.is_private || false;
    let ButtonComponent = <PrimaryButton label='Join' onPress={handleJoinBtnPress} containerStyle={styles.button} vibrateOnPress />;

    if (isUserAttending) return <></>;

    if (isGatheringFull) ButtonComponent = <GrayButton label='FULL' containerStyle={styles.button} />;

    if (isGatheringPrivate && !isUserPending) {
        ButtonComponent = <PrimaryButton label='Request To Join' onPress={handleJoinBtnPress} containerStyle={styles.button} />;
    }

    if (isGatheringPrivate && isUserPending) {
        ButtonComponent = <GrayButton label='Requested' containerStyle={styles.button} />;
    }

    return <View style={styles.buttonRowWrapper}>{ButtonComponent}</View>;
};

const styles = StyleSheet.create({
    buttonRowWrapper: {
        width: '100%',
        paddingHorizontal: '2%',
        gap: 10,
        flexDirection: 'row',
    },
    button: {
        flex: 1,
    },
});
