import { StyleSheet, TextInput, View, Pressable, Text } from 'react-native';
import React from 'react';
import { Sizes, Colours } from '../../../shared/styles/Styles';
import { Loading } from '../../../shared/components/Core/Loading';

interface MessageInputProps {
    sendMessage: (message: string) => void;
    startedTyping: () => void;
    stoppedTyping: () => void;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    scrollToBottom: Function;
}

const MessageInput = ({ sendMessage, startedTyping, stoppedTyping, isLoading, setIsLoading, scrollToBottom }: MessageInputProps) => {
    const [message, setMessage] = React.useState<string>('');
    const inputRef = React.useRef<TextInput>(null);
    const [isTyping, setIsTyping] = React.useState(false); // Track typing status
    const [typingTimeout, setTypingTimeout] = React.useState<NodeJS.Timeout | null>(null); // Track typing timeout

    const handleSendMessage = () => {
        if (message.trim().length === 0) return;

        setIsLoading(true);
        sendMessage(message);
        setMessage('');
        scrollToBottom();

        setIsTyping(false);
        stoppedTyping();
    };

    const onChangeText = (text: string) => {
        setMessage(text);

        if (!isTyping) {
            // If typing has not started, call startedTyping
            setIsTyping(true);
            startedTyping();
        }

        // Clear the previous typing timeout (if any) and set a new one
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        setTypingTimeout(
            setTimeout(() => {
                // After 3 seconds of inactivity, call stoppedTyping
                setIsTyping(false);
                stoppedTyping();
            }, 3000)
        );
    };

    const onBlur = () => {
        // Unfocus keyboard, call stoppedTyping
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        setIsTyping(false);
        stoppedTyping();
    };

    React.useEffect(() => {
        // Clean up the timeout when the component unmounts
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, []);

    return (
        <View style={styles.wrapper}>
            <View style={styles.textInputWrapper}>
                <TextInput
                    ref={inputRef}
                    placeholder='Type a message...'
                    style={styles.messageInput}
                    value={message}
                    onChangeText={(text) => onChangeText(text)}
                    multiline
                    maxLength={500}
                    textAlignVertical='center'
                    onBlur={onBlur}
                />
            </View>

            {message.length > 0 && (
                <Pressable onPress={handleSendMessage}>
                    <Text style={styles.sendText}>Send</Text>
                </Pressable>
            )}
            {isLoading && <Loading size={Sizes.ICON_SIZE_MD} />}
        </View>
    );
};

export default MessageInput;

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        gap: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    textInputWrapper: {
        flex: 1,
        paddingVertical: 5,
        justifyContent: 'center',
        borderRadius: Sizes.BORDER_RADIUS_LG,
        backgroundColor: Colours.GRAY_LIGHT,
    },
    messageInput: {
        paddingHorizontal: 15,
        fontSize: Sizes.FONT_SIZE_MD,
    },
    sendText: {
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: '500',
        color: Colours.PRIMARY,
    },
});
