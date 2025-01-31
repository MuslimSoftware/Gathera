import { Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { RedNumberBadge } from './RedNumberBadge';

interface IconWithRedNumberBadgeProps {
    icon: React.ReactNode;
    badgeNumber: number;
    onPress: () => void;
    padding?: number;
    badgeSize?: 'small' | 'large';
}

export const IconWithRedNumberBadge = ({ icon, badgeNumber, onPress, padding = 10, badgeSize = 'large' }: IconWithRedNumberBadgeProps) => {
    return (
        <Pressable style={[styles.button, { padding }]} onPress={onPress}>
            {icon}
            {badgeNumber > 0 && <RedNumberBadge number={badgeNumber} badgeSize={badgeSize} />}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: { paddingHorizontal: 15 },
});
