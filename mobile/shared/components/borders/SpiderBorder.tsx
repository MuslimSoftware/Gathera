import React from 'react';
import { ImageBorder } from './utils/ImageBorder';

const areEqual = (prevProps: any, nextProps: any) => {
    return prevProps.size === nextProps.size;
};

export const SpiderBorder = React.memo((props: any) => {
    return <ImageBorder size={props.size} source={require('../../../assets/borders/spider-border.gif')} />;
}, areEqual);
