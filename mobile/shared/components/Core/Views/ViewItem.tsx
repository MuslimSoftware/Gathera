import { Text } from 'react-native';
import React from 'react';
import { View } from '../../../../types/View';
import { UserListItem } from '../../ListItems/UserListItem';
import { getTimeUntilEvent } from '../../../utils/TimeUntilEvent';
import { Colours } from '../../../styles/Styles';

interface Props {
    view: View;
}

export const ViewItem = ({ view }: Props) => {
    const time = getTimeUntilEvent(view.updatedAt).short;
    return (
        <UserListItem profile={view.user}>
            <Text style={{ color: Colours.GRAY }}>{time}</Text>
        </UserListItem>
    );
};
