import { View, Pressable, Text, StyleSheet } from 'react-native';
import { ForwardIcon } from '../../../../shared/components/Core/Icons';
import { Sizes, Colours } from '../../../../shared/styles/Styles';

interface DetailListItemProps {
    icon?: React.ReactNode;
    label: string;
    onPress?: () => any;
    value?: string | undefined;
    hideNotification?: boolean;
}

export const DetailListItem = ({ icon, label, onPress, value, hideNotification = false }: DetailListItemProps) => {
    return (
        <View style={styles.detailInput}>
            <Pressable style={styles.detailInfoWrapper} onPress={onPress}>
                {icon && <Text>{icon}</Text>}
                <Text style={styles.detailInputLabel}>{label}</Text>
            </Pressable>
            <Pressable style={styles.addDetailWrapper} onPress={onPress}>
                {value && (
                    <Text style={[styles.addDetailText]} numberOfLines={1}>
                        {Array.isArray(value) ? value.join(', ') : value}
                    </Text>
                )}
                {!value && !hideNotification && (
                    <View style={styles.detailTextRow}>
                        <View style={styles.noti} />
                        <Text style={styles.addDetailText}>Add</Text>
                    </View>
                )}
                <ForwardIcon size={Sizes.ICON_SIZE_SM} color={Colours.GRAY_LIGHT} />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    detailInput: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    detailInputLabel: {
        fontSize: Sizes.FONT_SIZE_SM,
    },
    detailInfoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    noti: {
        width: 7,
        height: 7,
        borderRadius: 5,
        backgroundColor: Colours.PRIMARY,
    },
    detailTextRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7.5,
    },
    addDetailText: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.DARK,
    },
    addDetailWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        maxWidth: '50%',
        gap: 3,
    },
});
