import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { SingleLineTextInput } from '../../../shared/components/LabelInputs/SingleLineTextInput';
import { FollowUserListItem } from '../../../shared/components/ListItems/FollowUserListItem';
import ListItemButton from '../../../shared/components/Buttons/ListItemButton';
import { LeaveIcon, PersonAddIcon } from '../../../shared/components/Core/Icons';
import { useNavigate } from '../../../shared/hooks/useNavigate';
import { getBottomInset } from '../../../shared/utils/uiHelper';
import { getAuthContextValues } from '../../../shared/context/AuthContext';
import { useFetch } from '../../../shared/hooks/useFetch';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';

interface ChatRoomSettingsProps {
    conversation: any;
    convoName: string;
    setConvoName: (value: string) => void;
}

const ChatRoomSettings = ({ conversation, convoName, setConvoName }: ChatRoomSettingsProps) => {
    const {
        user: { _id: userId },
    } = getAuthContextValues();
    const { fetchAsync, error, isLoading } = useFetch();

    const [canSubmit, setCanSubmit] = React.useState<boolean>(false);
    const { navigateToScreen } = useNavigate();

    const onChangeName = (value: string) => {
        // letters numbers and spaces only and commas
        const validateRegex = /^[a-zA-Z0-9\s,]*$/;
        if (!validateRegex.test(value)) {
            return;
        }

        if (value.trim().length > 50 || value.trim().length < 1) {
            setCanSubmit(false);
        } else {
            setCanSubmit(true);
        }

        setConvoName(value);
    };

    const updateConversation = async () => {
        fetchAsync(
            {
                url: `/conversation/update/${conversation._id}`,
                method: 'PATCH',
                body: {
                    conversation_name: convoName.trim(),
                },
            },
            (updatedConversation) => {
                navigateToScreen('ChatRoom', { conversationId: updatedConversation._id });
            }
        );
    };

    const navigateToChatRoomAddUsers = () => {
        navigateToScreen('ChatRoomAddUsers', { conversationId: conversation._id });
    };

    const leaveConversation = async () => {
        fetchAsync(
            {
                url: `/conversation/leave/${conversation._id}`,
                method: 'POST',
            },
            () => {
                navigateToScreen('Conversations');
            }
        );
    };

    const canEdit = conversation.users.length > 2 && conversation.users.find((u: any) => u._id === userId);
    const submit = canEdit ? { label: 'Save', onSubmit: updateConversation, canSubmit: canSubmit, isLoading } : undefined;
    return (
        <HeaderPageLayout submit={submit} title='Chat Settings'>
            <ScrollView
                style={styles.wrapper}
                contentContainerStyle={[
                    styles.wrapperContainer,
                    {
                        paddingBottom: getBottomInset(),
                    },
                ]}
            >
                {error && <ErrorMessage message={error} />}
                {canEdit && <SingleLineTextInput label='Title' value={convoName} onChangeText={onChangeName} maxLength={50} />}
                <View style={styles.actionButtons}>
                    <ListItemButton labelText='Add Users' onPress={navigateToChatRoomAddUsers} icon={<PersonAddIcon />} />
                    <ListItemButton labelText='Leave Conversation' onPress={leaveConversation} icon={<LeaveIcon />} />
                </View>
                <View style={styles.userListSection}>
                    <Text style={styles.headerText}>Users</Text>
                    {conversation.users.map((user: any) => (
                        <FollowUserListItem key={user._id} profile={user} />
                    ))}
                </View>
            </ScrollView>
        </HeaderPageLayout>
    );
};

export default ChatRoomSettings;

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    wrapperContainer: {
        gap: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '500',
    },
    userListSection: {
        gap: 10,
    },
    actionButtons: {
        gap: 10,
    },
});
