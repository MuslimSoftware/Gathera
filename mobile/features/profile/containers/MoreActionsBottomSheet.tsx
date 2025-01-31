import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReportBlockButtons } from '../components/Profile/ReportBlock/ReportBlockButtons';
import { ReportUser } from '../components/Profile/ReportBlock/ReportUser';
import { ReportSent } from '../components/Profile/ReportBlock/ReportSent';
import { BlockUserInfo } from '../components/Profile/ReportBlock/BlockUserInfo';
import { BlockUser } from '../components/Profile/ReportBlock/BlockUser';
import { BlockSent } from '../components/Profile/ReportBlock/BlockSent';
import { UnblockUserInfo } from '../components/Profile/ReportBlock/UnblockUserInfo';
import { UnblockUser } from '../components/Profile/ReportBlock/UnblockUser';
import { UnblockSent } from '../components/Profile/ReportBlock/UnblockSent';
import BottomSheet from '@gorhom/bottom-sheet';
import { Backdrop } from '../../../shared/components/Sheets/Backdrop';
import { Handle } from '../../../shared/components/Sheets/Handle';
import { Colours } from '../../../shared/styles/Styles';

const Stack = createNativeStackNavigator();

interface MoreActionsBottomSheetProps {
    userBeingViewedDisplayName: string;
    userBeingViewedId: string;
    setShowSheet: (show: boolean) => void;
    isBlocked: boolean;
}

const snapPoints = ['30%', '75%', '85%']; // 30% is small, 75% is regular, 100% is for regular with keyboard open

export const MoreActionsBottomSheet = ({ userBeingViewedDisplayName, userBeingViewedId, setShowSheet, isBlocked }: MoreActionsBottomSheetProps) => {
    const bottomSheetRef = React.useRef<BottomSheet>(null);

    const handleClose = () => {
        bottomSheetRef.current?.close();
        setShowSheet(false);
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            backdropComponent={() => <Backdrop onPress={handleClose} />}
            enablePanDownToClose={false}
            enableHandlePanningGesture={false}
            enableContentPanningGesture={false}
            enableOverDrag={false}
            keyboardBehavior='interactive'
            handleComponent={(props) => <Handle {...props} />}
        >
            <Stack.Navigator
                initialRouteName='ReportBlockScreen'
                screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: Colours.WHITE } }}
            >
                <Stack.Screen name='ReportBlockScreen'>
                    {({ navigation }) => <ReportBlockButtons isBlocked={isBlocked} navigation={navigation} />}
                </Stack.Screen>

                <Stack.Screen name='ReportUser'>{({ navigation }) => <ReportUser userId={userBeingViewedId} navigation={navigation} />}</Stack.Screen>
                <Stack.Screen name='ReportSuccess'>{() => <ReportSent />}</Stack.Screen>

                <Stack.Screen name='BlockUserInfo'>{({ navigation }) => <BlockUserInfo navigation={navigation} />}</Stack.Screen>
                <Stack.Screen name='BlockUser'>
                    {({ navigation }) => <BlockUser displayName={userBeingViewedDisplayName} userId={userBeingViewedId} navigation={navigation} />}
                </Stack.Screen>
                <Stack.Screen name='BlockSuccess'>{() => <BlockSent displayName={userBeingViewedDisplayName} />}</Stack.Screen>

                <Stack.Screen name='UnblockUserInfo'>{({ navigation }) => <UnblockUserInfo navigation={navigation} />}</Stack.Screen>
                <Stack.Screen name='UnblockUser'>
                    {({ navigation }) => <UnblockUser displayName={userBeingViewedDisplayName} userId={userBeingViewedId} navigation={navigation} />}
                </Stack.Screen>
                <Stack.Screen name='UnblockSuccess'>{() => <UnblockSent displayName={userBeingViewedDisplayName} />}</Stack.Screen>
            </Stack.Navigator>
        </BottomSheet>
    );
};
