import { StyleSheet } from 'react-native';
import React from 'react';
import { HeaderPageLayout } from '../../layouts/HeaderPageLayout';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ScrollView } from 'react-native-gesture-handler';

export interface HeaderPageSubmit {
    label: string;
    onSubmit: (props: any) => void;
    canSubmit?: boolean;
    isLoading?: boolean;
}

interface FormProps {
    formTitle: string;
    submit: HeaderPageSubmit;
    close?: {
        label: string;
        onClose: () => void;
    };
    children: React.ReactNode;
    isBottomSheet?: boolean;
}

export const Form = ({ formTitle, submit, children, close, isBottomSheet = false }: FormProps) => {
    const ScrollViewComponent = isBottomSheet ? BottomSheetScrollView : ScrollView;
    return (
        <HeaderPageLayout title={formTitle} submit={submit} close={close}>
            <ScrollViewComponent style={styles.wrapper} contentContainerStyle={styles.bodyWrapper} keyboardShouldPersistTaps='handled'>
                {children}
            </ScrollViewComponent>
        </HeaderPageLayout>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 10,
        flex: 1,
    },
    bodyWrapper: {
        width: '100%',
        paddingHorizontal: 10,
        paddingBottom: 20,
        gap: 10,
    },
});
