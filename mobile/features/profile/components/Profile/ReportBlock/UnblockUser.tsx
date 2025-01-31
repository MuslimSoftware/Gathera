import React, { useEffect } from 'react';
import { MoreActionsLayout } from './MoreActionsLayout';
import { useUnblockUser } from '../../../hooks/useUnblockUser';
import { ActionButton } from './ActionButton';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { useToastError } from '../../../../../shared/hooks/useToastError';

export const UnblockUser = ({ displayName, userId, navigation }: { displayName: string; userId: string; navigation: any }) => {
    const bottomSheet = useBottomSheet();
    useFocusEffect(
        React.useCallback(() => {
            bottomSheet.snapToPosition('35%');
        }, [bottomSheet])
    );

    const onUnblockSuccess = () => {
        navigation.pop();
        navigation.replace('UnblockSuccess');
    };
    const { isLoading, error, sendRequest: sendUnblock } = useUnblockUser(userId, onUnblockSuccess);

    useToastError(error);

    return (
        <MoreActionsLayout title='Unblock User' subtitle='Confirm and unblock the user by clicking the button below.'>
            <ActionButton label={`Unblock ${displayName}`} onPress={sendUnblock} isLoading={isLoading} />
        </MoreActionsLayout>
    );
};
