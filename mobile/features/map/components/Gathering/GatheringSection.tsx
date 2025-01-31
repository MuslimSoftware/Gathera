import { StyleSheet, View, Text } from 'react-native';
import React from 'react';
import { Sizes, Colours } from '../../../../shared/styles/Styles';
import { GatheringItem } from './GatheringItem';
import { SectionTitle } from '../PlaceBottomSheet/SectionTitle';
import { useNavigate } from '../../../../shared/hooks/useNavigate';

const MAX_GATHERINGS_PREVIEW = 5;

const GatheringSection = ({ gatherings, gatheringCount, place }: any) => {
    const { navigateToScreen } = useNavigate();

    const handleShowAllPress = () => {
        navigateToScreen('SelectedPlaceGatherings', { place_id: place._id });
    };

    const handleCreatePress = () => {
        navigateToScreen('CreateGathering', { placeId: place._id });
    };

    return (
        <View style={styles.listWrapper}>
            <View style={styles.header}>
                <View style={styles.headerText}>
                    <SectionTitle title='Gatherings' expand={false} />
                    {gatheringCount > 0 && <Text style={styles.gatheringCount}>{gatheringCount}</Text>}
                </View>

                <View style={styles.headerBtns}>
                    <Text style={styles.showAllText} onPress={handleCreatePress}>
                        Create
                    </Text>
                    {gatheringCount > MAX_GATHERINGS_PREVIEW && (
                        <Text style={styles.showAllText} onPress={handleShowAllPress}>
                            Show All
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.listContent}>
                {gatherings.length === 0 && (
                    <View style={styles.noGatheringsWrapper}>
                        <Text style={styles.noGatheringsText}>No Gatherings</Text>
                    </View>
                )}
                {gatherings.length > 0 &&
                    gatherings.slice(0, MAX_GATHERINGS_PREVIEW).map((gathering: any) => <GatheringItem key={gathering._id} gathering={gathering} />)}
            </View>
        </View>
    );
};

export default GatheringSection;

const styles = StyleSheet.create({
    listWrapper: {
        width: '100%',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 10,
    },
    listContent: {
        width: '100%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        gap: 0,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    showAllText: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.PRIMARY_TRANSPARENT_75,
        fontWeight: '600',
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    headerBtns: {
        flexDirection: 'row',
        gap: 5,
    },
    headerText: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    gatheringCount: {
        fontSize: Sizes.FONT_SIZE_LG,
        color: Colours.GRAY,
        height: 'auto',
    },
    noGatheringsWrapper: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: Colours.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noGatheringsText: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.GRAY,
    },
});
