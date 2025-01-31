import Constants from 'expo-constants';
import { ScrollView, Text, View } from 'react-native';
import { FallbackComponentProps } from 'react-native-error-boundary';
import { StyleSheet } from 'react-native';
import { Colours, Sizes } from '../shared/styles/Styles';
import { PrimaryButton } from '../shared/components/Buttons/PrimaryButton';
import { ExclamationIcon } from '../shared/components/Core/Icons';
import { useState } from 'react';
import { TextButton } from '../shared/components/Buttons/TextButton';

export const FallBack = ({ error, resetError }: FallbackComponentProps) => {
    const [showError, setShowError] = useState(false);

    const { name, message, stack } = error;
    return (
        <ScrollView style={styles.list} contentContainerStyle={styles.content}>
            <ExclamationIcon color={Colours.PRIMARY} size={Sizes.ICON_SIZE_XXL} />

            <View style={styles.textWrapper}>
                <Text style={styles.headerText}>Something went wrong!</Text>
                <Text style={styles.messageText} numberOfLines={2}>
                    We're working on the problem right away. Please <Text style={styles.boldMessageText}>refresh app</Text> to continue.
                </Text>
            </View>

            <PrimaryButton label='Refresh App' containerStyle={styles.buttonContainer} textStyle={styles.buttonText} onPress={resetError} />
            <TextButton label={showError ? 'Hide Error' : 'Show Error'} onPress={() => setShowError(!showError)} />
            {showError && (
                <View>
                    <Text>{name}</Text>
                    <Text>{message}</Text>
                    <Text>{JSON.stringify(stack, null, 2)}</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    list: { flex: 1 },
    content: { height: '85%', gap: 20, justifyContent: 'center', alignItems: 'center', paddingTop: Constants.statusBarHeight + 10 },
    textWrapper: { alignItems: 'center', width: '90%', marginBottom: 20 },
    headerText: {
        fontSize: Sizes.FONT_SIZE_H2,
        fontWeight: 'bold',
        color: Colours.DARK,
    },
    messageText: {
        fontSize: Sizes.FONT_SIZE_MD,
        color: Colours.GRAY,
        fontWeight: '400',
        textAlign: 'center',
    },
    boldMessageText: {
        color: Colours.GRAY,
        fontWeight: 'bold',
    },
    buttonContainer: { paddingHorizontal: 30, paddingVertical: 10 },
    buttonText: { fontSize: Sizes.FONT_SIZE_MD },
});
