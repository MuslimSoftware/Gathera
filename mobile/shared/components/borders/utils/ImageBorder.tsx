import React from 'react';
import { Image } from 'react-native';

interface ImageBorderProps {
    size: number;
    source: any;
}

const areEqual = (prevProps: any, nextProps: any) => {
    return prevProps.size === nextProps.size && prevProps.source === nextProps.source;
};

export const ImageBorder = React.memo(({ size, source }: ImageBorderProps) => {
    return (
        <Image
            style={{
                position: 'absolute',
                zIndex: 10,
                width: size,
                height: size,
                transform: [{ scale: 1.1 }],
            }}
            source={source}
        />
    );
}, areEqual);
