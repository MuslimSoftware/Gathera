import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
    DumbbellIcon,
    PoliticsIcon,
    PrayerIcon,
    RulerIcon,
    SmokingIcon,
    WeedIcon,
    WineOIcon,
    ZodiacIcon,
} from '../../../../shared/components/Core/Icons';
import { Sizes, Colours } from '../../../../shared/styles/Styles';
import { useNavigation } from '@react-navigation/native';
import { DetailListItem } from './DetailListItem';
import { capitalizeAllWords } from '../../../../shared/utils/uiHelper';

const DETAIL_LIST = [
    {
        icon: <RulerIcon size={Sizes.ICON_SIZE_SM} />,
        label: 'Height',
        screen: 'HeightPicker',
    },
    {
        icon: <DumbbellIcon size={Sizes.ICON_SIZE_SM} />,
        label: 'Fitness',
        screen: 'ExercisePicker',
    },
    {
        icon: <WineOIcon size={Sizes.ICON_SIZE_SM} />,
        label: 'Alcohol',
        screen: 'AlcoholPicker',
    },
    {
        icon: <SmokingIcon size={Sizes.ICON_SIZE_SM} />,
        label: 'Smoke',
        screen: 'SmokingPicker',
    },
    {
        icon: <WeedIcon size={Sizes.ICON_SIZE_SM} />,
        label: 'Weed',
        screen: 'CannabisPicker',
    },
    {
        icon: <ZodiacIcon size={Sizes.ICON_SIZE_SM} />,
        label: 'Zodiac',
        screen: 'ZodiacPicker',
    },
    {
        icon: <PoliticsIcon size={Sizes.ICON_SIZE_SM} />,
        label: 'Politics',
        screen: 'PoliticsPicker',
    },
    {
        icon: <PrayerIcon size={Sizes.ICON_SIZE_SM} />,
        label: 'Religion',
        screen: 'ReligionPicker',
    },
];

const getDetailValue = (profile: any, detail: string) => {
    return capitalizeAllWords(profile.details[detail.toLowerCase()] || '');
};

export const EditAboutMe = ({ profile }: any) => {
    const navigation: any = useNavigation();

    return (
        <View style={styles.globalWrapper}>
            <View style={styles.headerWrapper}>
                <Text style={styles.headerText}>About Me</Text>
                <Text style={styles.subText}>Cover the things most people are curious about</Text>
            </View>
            <View style={styles.detailListWrapper}>
                {DETAIL_LIST.map((detail, index) => {
                    const value = getDetailValue(profile, detail.label);
                    return (
                        <DetailListItem
                            key={index}
                            icon={detail.icon}
                            label={detail.label}
                            value={value}
                            onPress={() =>
                                navigation.navigate('DetailPickers', {
                                    screen: detail.screen,
                                    params: { currentSelection: value },
                                })
                            }
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    globalWrapper: {
        width: '100%',
        paddingVertical: 10,
        gap: 10,
    },

    headerWrapper: {
        width: '100%',
    },
    headerText: {
        fontSize: Sizes.FONT_SIZE_XL,
        fontWeight: '500',
    },
    subText: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.GRAY,
    },
    detailListWrapper: {
        gap: 5,
    },
});
