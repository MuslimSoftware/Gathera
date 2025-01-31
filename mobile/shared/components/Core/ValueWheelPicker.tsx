import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Colours } from '../../styles/Styles';
import WheelPicker from 'react-native-wheely';

interface ValueWheelPickerProps {
    setValue: (value: any) => void;
    values: any[];
}

const ValueWheelPicker = ({ setValue, values }: ValueWheelPickerProps) => {
    const [selectedIndex, setSelectedIndex] = useState(55);

    const onChange = (index: number) => {
        setSelectedIndex(index);
        setValue(values[index]);
    };

    return <WheelPicker decelerationRate={'normal'} selectedIndex={selectedIndex} options={values} onChange={onChange} />;
};

export default ValueWheelPicker;

const styles = StyleSheet.create({
    heightScroller: {
        flex: 1,
        backgroundColor: Colours.WHITE,
    },
});
