import { StyleSheet, Text, View, ViewProps } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Sizes } from '../../styles/Styles';
import { ForwardIcon } from '../Core/Icons';

interface ListItemButtonProps extends ViewProps {
    labelText: string;
    labelStyle?: any;
    icon?: any;
    onPress?: () => void;
    hideArrow?: boolean;
}

const ListItemButton = ({ labelText, labelStyle, icon, onPress, hideArrow = false, ...props }: ListItemButtonProps) => {
    return (
        <TouchableOpacity style={styles.wrapper} onPress={onPress} {...props}>
            <View style={styles.labelWrapper}>
                {icon && icon}
                <Text style={[styles.label, labelStyle]}>{labelText}</Text>
            </View>
            {!hideArrow && <ForwardIcon size={25} />}
        </TouchableOpacity>
    );
};

export default ListItemButton;

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    labelWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    label: {
        fontSize: Sizes.FONT_SIZE_LG,
    },
});
