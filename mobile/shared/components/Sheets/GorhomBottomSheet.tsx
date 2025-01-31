import { Keyboard, Platform, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { Colours, Sizes } from '../../styles/Styles';
import { useNavigate } from '../../hooks/useNavigate';
import { Backdrop } from './Backdrop';
import { Handle } from './Handle';

interface BottomSheetProps {
    setShowSheet?: (showSheet: boolean) => void;
    title?: string;
    children?: React.ReactNode;
    disableDrag?: boolean;
    disablePanDownToClose?: boolean;
    enableContentPanningGesture?: boolean;
    snapPoints?: (string | number)[];
    initialIndex?: number;
    onChange?: (props: any) => void;
}

const GorhomBottomSheet = ({
    setShowSheet,
    title = '',
    children,
    disableDrag = false,
    disablePanDownToClose = false,
    enableContentPanningGesture = false,
    snapPoints = ['60%', '90%'],
    initialIndex = 0,
    onChange,
}: BottomSheetProps) => {
    const bottomSheetRef = React.useRef<BottomSheet>(null);
    const { snapBottomSheetToIndex } = useNavigate();

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', (e: any) => snapBottomSheetToIndex(1));
        const keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', (e: any) => snapBottomSheetToIndex(0));

        // Clean up listeners when component unmounts
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const closeSheet = () => {
        setShowSheet && setShowSheet(false);
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            keyboardBehavior='extend'
            index={initialIndex}
            onClose={closeSheet}
            onChange={onChange}
            enablePanDownToClose={!disablePanDownToClose}
            style={styles.bottomSheet}
            enableOverDrag={false}
            enableContentPanningGesture={enableContentPanningGesture}
            enableHandlePanningGesture={!disableDrag}
            handleComponent={(props) => <Handle {...props} />}
            backdropComponent={() => <Backdrop onPress={closeSheet} />}
        >
            {children}
        </BottomSheet>
    );
};

export default GorhomBottomSheet;

const styles = StyleSheet.create({
    bottomSheet: {
        ...(Platform.OS === 'ios'
            ? { shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 3, backgroundColor: Colours.WHITE }
            : { elevation: 5, backgroundColor: Colours.WHITE }),
        borderTopRightRadius: Sizes.BORDER_RADIUS_LG,
        borderTopLeftRadius: Sizes.BORDER_RADIUS_LG,
    },
});
