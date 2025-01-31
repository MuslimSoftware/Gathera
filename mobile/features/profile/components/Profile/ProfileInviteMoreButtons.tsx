import { StyleSheet, View } from 'react-native';
import React from 'react';
import { PrimaryButton } from '../../../../shared/components/Buttons/PrimaryButton';
import { Colours, Sizes } from '../../../../shared/styles/Styles';
import { InstagramIcon } from '../../../../shared/components/Core/Icons';
import { GrayButton } from '../../../../shared/components/Buttons/GrayButton';

interface ProfileInviteMoreButtonsProps {
    onInviteBtnPress: () => void;
    onInstagramPress?: () => void;
}

export const ProfileInviteMoreButtons = ({ onInviteBtnPress, onInstagramPress }: ProfileInviteMoreButtonsProps) => {
    return (
        <View style={styles.actionButtonRow}>
            <PrimaryButton label='Invite' onPress={onInviteBtnPress} containerStyle={{ flex: 1 }} vibrateOnPress />

            {onInstagramPress && (
                <View style={styles.secondaryButton}>
                    <GrayButton label=''>
                        <InstagramIcon size={Sizes.ICON_SIZE_MD} color={Colours.DARK} onPress={onInstagramPress} />
                    </GrayButton>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    actionButtonRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: Colours.GRAY_EXTRA_LIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
