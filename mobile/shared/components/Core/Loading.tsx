// Loading.tsx
import React from 'react';
import { View, ActivityIndicator, StyleProp } from 'react-native';

interface LoadingProps {
    style?: StyleProp<any>;
    size?: number;
    color?: string;
}

export const Loading = ({ style, size, color = 'black' }: LoadingProps) => {
    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                ...style,
            }}
        >
            <ActivityIndicator size={size ?? 20} color={color} />
        </View>
    );
};
