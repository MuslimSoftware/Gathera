import { StyleSheet } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ForwardIcon } from '../../../../shared/components/Core/Icons';
import { Colours, Sizes } from '../../../../shared/styles/Styles';

interface ContinueIconButtonProps {
    enabled?: boolean;
    onPress: () => void;
}

const ContinueIconButton = ({ enabled = false, onPress }: ContinueIconButtonProps) => {
    return (
        <TouchableOpacity
            style={[styles.wrapper, !enabled && { backgroundColor: Colours.WHITE_TRANSPARENT }]}
            onPress={enabled ? onPress : undefined}
        >
            <ForwardIcon color={enabled ? Colours.BLACK : Colours.BLACK_TRANSPARENT} size={20} />
        </TouchableOpacity>
    );
};

export default ContinueIconButton;

const styles = StyleSheet.create({
    wrapper: {
        width: 40,
        height: 40,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        backgroundColor: Colours.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
