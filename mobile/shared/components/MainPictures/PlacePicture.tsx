import React from 'react';
import { ProfilePictureSize } from '../../../types/User';
import { MainPicture } from './MainPicture';

interface PlacePictureProps {
    uri?: string;
    size?: ProfilePictureSize;
}

const areEqual = (prevProps: PlacePictureProps, nextProps: PlacePictureProps) => {
    return prevProps.uri === nextProps.uri && prevProps.size === nextProps.size;
};

export const PlacePicture = React.memo(({ size = 'small', uri }: PlacePictureProps) => {
    return <MainPicture size={size} uri={uri} type='place' />;
}, areEqual);
