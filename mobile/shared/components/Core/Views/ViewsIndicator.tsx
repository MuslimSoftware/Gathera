import { Pressable, StyleSheet, Text } from 'react-native';
import React from 'react';
import { EyeIcon } from '../Icons';
import { LoadingSkeleton } from '../LoadingSkeleton';

interface Props {
    count: number;
    onPress?: (...params: any) => void;
}

export const ViewsIndicator = ({ count, onPress }: Props) => {
    return (
        <Pressable style={styles.wrapper} onPress={onPress}>
            <EyeIcon />
            <Text>{count ?? 0}</Text>
        </Pressable>
    );
};

export const ViewsIndicatorSkeleton = () => {
    return <LoadingSkeleton style={{ width: 40, height: 25 }} />;
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        gap: 5,
    },
});
