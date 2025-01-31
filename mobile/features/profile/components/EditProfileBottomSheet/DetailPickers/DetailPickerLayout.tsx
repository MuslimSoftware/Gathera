import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { HeaderPageLayout } from '../../../../../shared/layouts/HeaderPageLayout';
import { getNavigationBarBottomPadding } from '../../../../../shared/utils/uiHelper';

interface DetailPickerLayoutProps {
    children: React.ReactNode;
    question: string;
    icon: React.ReactNode;
}

const DetailPickerLayout = ({ children, question, icon }: DetailPickerLayoutProps) => {
    return (
        <HeaderPageLayout>
            <View style={styles.questionWrapper}>
                {icon}
                <Text style={styles.questionText}>{question}</Text>
            </View>
            {children}
            <View style={{ height: getNavigationBarBottomPadding() }} />
        </HeaderPageLayout>
    );
};

export default DetailPickerLayout;

const styles = StyleSheet.create({
    questionWrapper: {
        height: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    questionText: {
        fontSize: 20,
        fontWeight: '600',
    },
});
