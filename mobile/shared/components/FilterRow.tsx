import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { PLACE_FILTERS_HEIGHT } from '../utils/uiHelper';
import { BackIcon } from './Core/Icons';
import { FilterItem } from './FilterItem';
import { Filter } from '../../types/Place';

interface FilterRowProps {
    filters: Filter[]; // The initial filters to be displayed
    onChangeFilters: (selectedFiltersLabels: Filter[]) => void; // The function to be called when the selected filters change
}

export const FilterRow = React.memo(({ filters, onChangeFilters }: FilterRowProps) => {
    const [visibleFilters, setVisibleFilters] = React.useState<Filter[]>(filters);
    const [selectedFilters, setSelectedFilters] = React.useState<Filter[]>([]);
    const [showBack, setShowBack] = useState<boolean>(false);
    const [filterParentsStack, setFilterParentsStack] = useState<Filter[]>([]); // Stack of filter parents to be used when going back

    useEffect(() => {
        // On mount, deselect all filters
        filters.forEach((filter) => filter.deselect());
    }, []);

    useEffect(() => {
        onChangeFilters(selectedFilters);

        if (selectedFilters.length === 0) {
            const lastFilterParent = filterParentsStack.pop();
            if (lastFilterParent) {
                selectFilter(lastFilterParent);
                setVisibleFilters(lastFilterParent.subFilters);
                setShowBack(true);
            } else {
                setVisibleFilters(filters);
                setShowBack(false);
            }
        }
    }, [selectedFilters, onChangeFilters]);

    const filterPressHandler = (filter: Filter) => {
        const hasSubFilters = !filter.isLeaf();
        const isSelected = filter.isSelected;

        if (hasSubFilters && isSelected) backPressHandler();
        else if (hasSubFilters && !isSelected) {
            // select filter
            selectFilter(filter);
            setVisibleFilters(filter.subFilters);
            setShowBack(true);
            setFilterParentsStack((prev) => [...prev, filter]);
        } else if (!hasSubFilters && isSelected) deselectFilter(filter);
        else if (!hasSubFilters && !isSelected) {
            for (const f of selectedFilters) {
                if (!f.isLeaf()) {
                    deselectFilter(f);
                }
            }
            selectFilter(filter);
        }
    };

    const selectFilter = (filter: Filter) => {
        filter.select();
        setSelectedFilters((prev) => [...prev, filter]);
    };

    const deselectFilter = (filter: Filter) => {
        filter.deselect();
        for (const f of filter.subFilters) {
        }
        setSelectedFilters((prevSelectedFilters) => prevSelectedFilters.filter((f) => f.label !== filter.label));
    };

    const backPressHandler = () => {
        setFilterParentsStack((prev) => prev.slice(0, prev.length - 1));
        selectedFilters.forEach((filter) => !filter.isLeaf() && filter.deselect());
        setSelectedFilters((prevSelectedFilters) => prevSelectedFilters.filter((f) => f.isLeaf()));
        setVisibleFilters(filters); // Goes back to root instead of parent. Works when only 1 level deep. Need to fix for more levels if needed.
        setShowBack(false);
    };

    const selectedFiltersNotVisible = selectedFilters.filter((f) => !visibleFilters.some((vf) => vf.label === f.label));

    return (
        <View style={styles.filtersWrapper}>
            {showBack && <BackIcon onPress={backPressHandler} />}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            >
                {selectedFiltersNotVisible.map((filter) => (
                    <FilterItem key={filter.label} label={filter.label} isSelected={filter.isSelected} onPress={() => filterPressHandler(filter)} />
                ))}

                {visibleFilters.map((filter) => (
                    <FilterItem key={filter.label} label={filter.label} isSelected={filter.isSelected} onPress={() => filterPressHandler(filter)} />
                ))}
            </ScrollView>
        </View>
    );
});

const styles = StyleSheet.create({
    filtersWrapper: {
        height: PLACE_FILTERS_HEIGHT,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    listContent: {
        gap: 7.5,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
});
