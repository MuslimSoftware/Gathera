import React, { useEffect, useState } from 'react';
import { GestureResponderEvent, Platform, StyleSheet, Text, View } from 'react-native';
import Slider, { SliderProps } from '@react-native-community/slider';
import { FormRow } from '../Forms/FormRow';
import { FormLabel } from '../Forms/FormLabel';
import { Colours, Sizes } from '../../styles/Styles';
import { EditIcon } from '../Core/Icons';

interface NumberSliderProps extends SliderProps {
    label: string;
    value: number;
    onValueChange: (value: number) => void;
    minimumValue: number;
    maximumValue: number;
}

/**
 * NumberSlider component that displays the current value of the slider and allows the user to edit it by tapping on the pencil icon.
 * The slider will automatically hide after 3 seconds of inactivity.
 *
 * Example usage:
 * ```
 * <NumberSlider
 *    label='Max Users'
 *    value={value} // Should be a state variable
 *    onValueChange={(value) => setValue(value)} // Should be a state setter
 *    minimumValue={0}
 *    maximumValue={10}
 * />
 * ```
 * @param label The label to display above the slider
 * @note All other props are passed to the Slider component
 */
export const NumberSlider = ({ label, value, onValueChange, minimumValue, maximumValue, ...props }: NumberSliderProps) => {
    const [isSliderVisible, setIsSliderVisible] = useState(false);
    const [dismissTimeout, setDismissTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Clear the timeout when the component unmounts
        return () => {
            if (dismissTimeout) clearTimeout(dismissTimeout);
        };
    }, []);

    const showSlider = () => {
        setIsSliderVisible(true);
        dismissSliderAfterDelay();
    };

    const dismissSliderAfterDelay = () => {
        if (dismissTimeout) {
            clearTimeout(dismissTimeout);
            setDismissTimeout(null);
        }
        setDismissTimeout(setTimeout(() => setIsSliderVisible(false), 3000));
    };

    const onTouchEnd = (event: GestureResponderEvent) => {
        dismissSliderAfterDelay();
        if (props.onTouchEnd) props.onTouchEnd(event);
    };

    const onTouchStart = (event: GestureResponderEvent) => {
        if (dismissTimeout) clearTimeout(dismissTimeout);
        if (props.onTouchStart) props.onTouchStart(event);
    };

    const defaultSliderProps: SliderProps = {
        step: 1,
        minimumTrackTintColor: Colours.PRIMARY_LIGHT,
        maximumTrackTintColor: Colours.GRAY,
        thumbTintColor: Colours.PRIMARY,
        tapToSeek: true,
        onTouchStart: onTouchStart,
        onTouchEnd: onTouchEnd,
    };

    const SliderComponent = (
        <View style={styles.sliderWrapper}>
            <Text style={[styles.valueBoundary, styles.valueBoundaryLeft]}>{minimumValue}</Text>
            <Slider
                {...defaultSliderProps}
                style={styles.slider}
                {...props}
                value={value}
                onValueChange={onValueChange}
                minimumValue={minimumValue}
                maximumValue={maximumValue}
            />
            <Text style={[styles.valueBoundary, styles.valueBoundaryRight]}>{maximumValue}</Text>
        </View>
    );

    return (
        <FormRow>
            <FormLabel label={label} />
            <View style={styles.inputRow}>
                <View style={styles.valueIndicatorWrapper}>
                    {isSliderVisible && SliderComponent}
                    <Text style={styles.valueIndicator}>{value}</Text>
                    {!isSliderVisible && <EditIcon onPress={showSlider} />}
                </View>
            </View>
        </FormRow>
    );
};

const styles = StyleSheet.create({
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    inputRow: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
    },
    sliderWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    slider: {
        flex: 1,
        width: '100%',
    },

    subLabel: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.GRAY,
    },

    valueIndicatorWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    valueIndicator: {
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: 'bold',
        color: Colours.BLACK,
        textAlign: 'center',
        borderColor: Colours.BLACK,
        borderWidth: 1,
        borderRadius: Sizes.BORDER_RADIUS_SM,
        paddingVertical: 2.5,
        paddingHorizontal: 10,
    },
    valueBoundary: {
        fontSize: Sizes.FONT_SIZE_XS,
        color: Colours.GRAY,
        textAlign: 'center',

        position: 'absolute',
        bottom: -7.5,
    },
    valueBoundaryLeft: {
        left: Platform.select({
            android: 12.5,
            ios: 0,
        }),
    },
    valueBoundaryRight: {
        right: Platform.select({
            android: 12.5,
            ios: 0,
        }),
    },
});
