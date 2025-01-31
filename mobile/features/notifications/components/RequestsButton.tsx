import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Sizes } from '../../../shared/styles/Styles';
import { IconWithRedNumberBadge } from '../../../shared/components/Core/IconWithRedNumberBadge';

interface RequestsButtonProps {
    title: string;
    subtitle: string;
    Icon: Function; // Custom Icon component (e.g., PersonAddIcon)
    numRequests: number;
    onPress: () => void;
}

export const RequestsButton = ({ title, subtitle, Icon, numRequests, onPress }: RequestsButtonProps) => {
    return (
        <Pressable style={styles.wrapper} onPress={onPress}>
            <IconWithRedNumberBadge
                icon={<Icon size={Sizes.ICON_SIZE_LG} />}
                badgeNumber={numRequests}
                onPress={onPress}
                padding={10}
                badgeSize='large'
            />

            <View>
                <Text>{title}</Text>
                <Text style={styles.secondaryText}>{subtitle}</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 7.5,
        borderRadius: 10,
        gap: 10,
    },
    secondaryText: {
        fontWeight: '300',
    },
});
