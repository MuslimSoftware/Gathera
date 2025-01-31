import React, { useEffect } from 'react';
import { MoreActionsLayout } from './MoreActionsLayout';
import { useBlockUser } from '../../../hooks/useBlockUser';
import { ActionButton } from './ActionButton';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { useToastError } from '../../../../../shared/hooks/useToastError';

export const BlockUser = ({ displayName, userId, navigation }: { displayName: string; userId: string; navigation: any }) => {
    const onBlockSuccess = () => {
        navigation.pop();
        navigation.replace('BlockSuccess');
    };

    const { isLoading, error, blockUser } = useBlockUser(userId, onBlockSuccess);
    const bottomSheet = useBottomSheet();

    useFocusEffect(
        React.useCallback(() => {
            bottomSheet.snapToPosition('35%');
        }, [bottomSheet])
    );

    useToastError(error);

    return (
        <MoreActionsLayout title='Block User' subtitle='Confirm and block the user by clicking the button below.'>
            <ActionButton label={`Block ${displayName}`} onPress={blockUser} isLoading={isLoading} />
        </MoreActionsLayout>
    );
};
