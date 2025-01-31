import { StyleSheet, View } from 'react-native';
import React from 'react';
import { IconButton } from '../../../../shared/components/Buttons/IconButton';
import { PrimaryButton } from '../../../../shared/components/Buttons/PrimaryButton';
import { HeartIcon, HeartOIcon, InfoIcon } from '../../../../shared/components/Core/Icons';
import { Colours, Sizes } from '../../../../shared/styles/Styles';
import { useNavigate } from '../../../../shared/hooks/useNavigate';

interface PlacePageActionButtonsProps {
    placeId: string;
    isInterested: boolean;
    toggleIsInterested: any;
    navigateToInfo: any;
}

export const PlacePageActionButtons = ({ placeId, isInterested, toggleIsInterested, navigateToInfo }: PlacePageActionButtonsProps) => {
    const { navigateToScreen, snapBottomSheetToIndex } = useNavigate();
    return (
        <View style={styles.placeInformation}>
            <PrimaryButton
                label='Create Gathering'
                onPress={() => {
                    navigateToScreen('CreateGathering', {
                        placeId,
                    });
                    snapBottomSheetToIndex(2);
                }}
                vibrateOnPress
                containerStyle={styles.summaryTextWrapper}
            />
            <View style={styles.infoActions}>
                {isInterested && (
                    <IconButton
                        icon={<HeartIcon size={20} color={Colours.RED} />}
                        style={[styles.actionButton, { backgroundColor: Colours.RED_LIGHT }]}
                        onPress={toggleIsInterested}
                    />
                )}
                {!isInterested && <IconButton icon={<HeartOIcon size={20} />} style={styles.actionButton} onPress={toggleIsInterested} />}
                <IconButton icon={<InfoIcon size={25} color={Colours.DARK} />} onPress={navigateToInfo} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    placeInformation: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        gap: 5,
    },
    summaryTextWrapper: {
        flex: 1,
        height: 35,
    },
    summaryText: {
        fontSize: Sizes.FONT_SIZE_SM,
    },
    moreInfoText: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.CLICKABLE_TEXT,
    },
    infoActions: {
        flexDirection: 'row',
        gap: 5,
    },
    contentWrapper: {
        width: '100%',
        height: 1000,
    },
    actionButton: {
        width: 45,
        height: 45,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
