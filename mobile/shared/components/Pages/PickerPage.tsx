import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import SearchBar from '../../../features/discover/components/SearchBar';
import { HeaderPageLayout } from '../../layouts/HeaderPageLayout';
import { Colours, Sizes } from '../../styles/Styles';
import { filterArray } from '../../utils/dataHelper';
import { getNavigationBarBottomPadding } from '../../utils/uiHelper';
import { ErrorMessage } from '../ErrorMessage';

export interface CategorialData {
    category: string;
    data: string[];
}

interface PickerPageProps {
    pageTitle: string; // Title of the page
    options: string[] | CategorialData[]; // All pickable options to be displayed
    onSubmit: (selectedData: string[]) => void; // Function to be called when submit button is pressed

    submitLoading?: boolean; // Whether the submit button is loading
    initialSelectedData?: string[]; // All data that is initially selected, if any
    maxNumSelections?: number; // Maximum number of options that can be selected
    error?: string; // Error message to be displayed if save fails
}

export const PickerPage = ({ pageTitle, options, onSubmit, submitLoading, initialSelectedData = [], maxNumSelections, error }: PickerPageProps) => {
    const [searchQuery, setSearchQuery] = React.useState<string>('');
    const [selectedData, setSelectedData] = React.useState<Set<string>>(new Set(initialSelectedData));
    const isCategorial = useMemo(() => options.length > 0 && typeof options[0] !== 'string', [options]);

    const filteredData = useMemo(() => {
        if (searchQuery === '') return options;

        if (isCategorial) {
            return options.map((categorialData) => {
                const { category, data } = categorialData as CategorialData;
                return { category, data: filterArray(data, searchQuery) };
            });
        }

        return filterArray(options as string[], searchQuery);
    }, [options, searchQuery]);

    const handleOptionPress = (option: string) => {
        setSelectedData((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(option)) newSet.delete(option); // If already selected, deselect
            else if (maxNumSelections === undefined) newSet.add(option); // If no maxNumSelections, select option
            else if (newSet.size < maxNumSelections) newSet.add(option); // If maxNumSelections not reached, select option
            else return prev; // If maxNumSelections reached, do nothing
            return newSet;
        });
    };

    const renderData = useCallback(() => {
        if (isCategorial) {
            return filteredData.map((categorialData) => {
                const { category, data } = categorialData as CategorialData;
                if (data.length === 0) return null;
                return (
                    <View key={category} style={styles.categoryContainer}>
                        <Text style={styles.categoryTitle}>{category}</Text>
                        <View style={styles.optionsContainer}>
                            {data.map((item) => (
                                <PickerButton key={item} label={item} onPress={() => handleOptionPress(item)} isSelected={selectedData.has(item)} />
                            ))}
                        </View>
                    </View>
                );
            });
        } else {
            return filteredData.map((itemObj) => {
                const item = itemObj as string;
                return <PickerButton key={item} label={item} onPress={() => handleOptionPress(item)} isSelected={selectedData.has(item)} />;
            });
        }
    }, [filteredData, selectedData, searchQuery]);

    const handleSubmit = () => {
        const selectedDataArray = Array.from(selectedData);
        onSubmit(selectedDataArray);
    };

    const canSubmit = useMemo(() => {
        if (initialSelectedData === undefined || initialSelectedData.length === 0) return true; // If no initialSelectedData, can submit
        if (maxNumSelections !== undefined && selectedData.size > maxNumSelections) return false; // If selectedData size is greater than maxNumSelections, cannot submit
        if (selectedData.size !== initialSelectedData.length) return true; // If selectedData size is different from initialSelectedData size, can submit

        // Lengths are the same --> compare selectedData and initialSelectedData to determine if selectedData has changed
        const initialSelectedDataSet = new Set(initialSelectedData);
        for (const item of selectedData) if (!initialSelectedDataSet.has(item)) return true;
        return false;
    }, [selectedData, initialSelectedData]);

    return (
        <HeaderPageLayout title={pageTitle} submit={{ label: 'Save', canSubmit, onSubmit: handleSubmit, isLoading: submitLoading }}>
            {error && <ErrorMessage message={error} />}
            <View style={styles.invisPadding} />
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <ScrollView contentContainerStyle={[styles.optionsContainer, { paddingBottom: getNavigationBarBottomPadding() }]}>
                {renderData()}
            </ScrollView>
            {maxNumSelections !== undefined && (
                <View style={[styles.footerWrapper, { bottom: getNavigationBarBottomPadding() }]}>
                    <Text style={styles.footerText}>
                        {selectedData.size < maxNumSelections && `${selectedData.size}/${maxNumSelections}`}
                        {selectedData.size >= maxNumSelections && 'MAX'}
                    </Text>
                </View>
            )}
        </HeaderPageLayout>
    );
};

const PickerButton = React.memo(
    ({ label, onPress, isSelected }: any) => {
        return (
            <Pressable onPress={onPress} style={[styles.buttonWrapper, isSelected && styles.buttonSelectedWrapper]}>
                <Text style={[styles.buttonText, isSelected && styles.buttonSelectedText]}>{label}</Text>
            </Pressable>
        );
    },
    (prevProps, nextProps) => prevProps.isSelected === nextProps.isSelected
);

const styles = StyleSheet.create({
    invisPadding: {
        height: 10,
    },
    optionsContainer: {
        padding: 10,
        gap: 15,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    categoryTitle: {
        fontSize: Sizes.FONT_SIZE_H2,
        fontWeight: '600',
        color: Colours.DARK,
    },
    buttonWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colours.GRAY_LIGHT,
        borderWidth: 1,
        borderColor: Colours.GRAY_LIGHT,
        borderRadius: Sizes.BORDER_RADIUS_LG,
        paddingHorizontal: 8,
        paddingVertical: 5,
    },
    buttonSelectedWrapper: {
        backgroundColor: Colours.PRIMARY_LIGHT,
        borderColor: Colours.PRIMARY_LIGHT,
    },
    buttonText: {
        fontSize: Sizes.FONT_SIZE_SM,
    },
    buttonSelectedText: {
        color: Colours.WHITE,
    },
    footerWrapper: {
        position: 'absolute',
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,

        borderWidth: 1,
        borderColor: Colours.GRAY_LIGHT,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        backgroundColor: Colours.WHITE,

        // Android shadow
        elevation: 2,

        // iOS shadow
        shadowColor: Colours.BLACK,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    footerText: {
        fontSize: Sizes.FONT_SIZE_LG,
        fontWeight: 'bold',
        textAlign: 'center',
        color: Colours.DARK,
    },
});
