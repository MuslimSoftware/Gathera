import { StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { Colours } from '../../../shared/styles/Styles';
import { StatusBar } from 'expo-status-bar';
import { getBottomInset } from '../../../shared/utils/uiHelper';

interface Props {
    children: React.ReactNode;
}

export const SubscriptionLayout = ({ children }: Props) => {
    return (
        <>
            <StatusBar style='dark' backgroundColor={Colours.TRANSPARENT} />
            <HeaderPageLayout
                title='Get Gathera Premium'
                headerStyle={{ backgroundColor: Colours.TRANSPARENT }}
                showBackBtn
                hasTopMargin
                backgroundTransparent
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.wrapper}
                    contentContainerStyle={[styles.content, { paddingBottom: getBottomInset() + 30 }]}
                    overScrollMode='never'
                >
                    {children}
                </ScrollView>
            </HeaderPageLayout>
        </>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingBottom: 5,
    },
    content: {
        gap: 40,
    },
});
