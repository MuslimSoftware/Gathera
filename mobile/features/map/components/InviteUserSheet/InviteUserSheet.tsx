import React, { useEffect } from 'react';
import { InviteUserListItem } from '../../../../shared/components/ListItems/InviteUserListItem';
import { ListSheet } from '../../../../shared/components/Sheets/ListSheet';
import { useInvitees } from '../../hooks/useInvitees';
import { RefreshControl } from 'react-native-gesture-handler';
import { filterArray } from '../../../../shared/utils/dataHelper';

export const InviteUserSheet = ({ setShowInviteSheet, inviteUser, invitedUserList, attendingUserList }: any) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<any[]>([]);
    const { isLoading, suggestedInvitees, fetchInvitees, refresh } = useInvitees();

    useEffect(() => {
        setSearchResults(suggestedInvitees);
    }, [suggestedInvitees]);

    useEffect(() => {
        setSearchResults(filterArray(suggestedInvitees, searchQuery, 'display_name'));
    }, [searchQuery]);

    const renderItem = ({ item }: any) => {
        const isAttending = attendingUserList.some((attendingUser: any) => attendingUser._id === item._id);
        if (isAttending) return null;
        return (
            <InviteUserListItem
                key={item._id}
                profile={item}
                inviteUser={inviteUser}
                isInvited={invitedUserList.some((invitedUser: any) => invitedUser._id === item._id)}
            />
        );
    };

    return (
        <ListSheet
            setShowSheet={setShowInviteSheet}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            title='Invite'
            flatListData={{
                data: searchResults,
                renderItem: renderItem,
                keyExtractor: (item) => item._id,
                onEndReached: fetchInvitees,
                onEndReachedThreshold: 0.5,
                RefreshControl: <RefreshControl refreshing={false} onRefresh={refresh} />,
            }}
            isEmpty={suggestedInvitees.length === 0}
            emptyText={'You are not following any users. Once you follow a user you can invite them!'}
        />
    );
};
